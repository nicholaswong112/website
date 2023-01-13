from django.shortcuts import render, redirect
import string
import random
import requests
import os
import time 
import constance
from base64 import b64encode
from urllib.parse import urlencode

if 'RENDER' in os.environ:
    CLIENT_SECRET = os.environ['SPOTIFY_CLIENT_SECRET']
    # TODO probably shouldn't hardcode the URL.. create a constants file or something
    REDIRECT_URI = 'https://website-31gs.onrender.com/spotify/callback'
else:
    # TODO remove this before committing
    CLIENT_SECRET = 'c30db88935a74688ad6f738a79db08d6'
    REDIRECT_URI = 'http://localhost:8000/spotify/callback'

CLIENT_ID = '4b73799e86f6492ab514fd92b08f30b6'
ENCODED_CLIENT_INFO = b64encode((CLIENT_ID + ':' + CLIENT_SECRET).encode('utf-8')).decode('utf-8')

def index(request):
    context = {
        'logged_in': 'access_token' in request.session,
        'access_token': request.session.get('access_token'),
        'refresh_token': request.session.get('refresh_token'),
        'expires_at': request.session.get('expires_at'),
        'is_staff': request.user.is_staff
    }
    return render(request, 'spotify/index.html', context)

def setContance(access_token, refresh_token, expires_at):
    constance.config.STAFF_ACCESS_TOKEN = access_token
    constance.config.STAFF_EXPIRES_AT = expires_at
    if refresh_token:
        constance.config.STAFF_REFRESH_TOKEN = refresh_token

def login(request):
    state = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
    redir = redirect('https://accounts.spotify.com/authorize?' + 
        urlencode({
            'response_type': 'code', 
            'scope': 'user-read-private user-read-currently-playing user-read-recently-played user-top-read',
            'client_id': CLIENT_ID,
            'redirect_uri': REDIRECT_URI,
            'state': state,
    }))
    request.session['state'] = state
    return redir

def callback(request):
    code = request.GET.get('code', None)
    state = request.GET.get('state', None)
    if state == None or state != request.session['state']:
        error = request.GET.get('error', None)
        print('Authorization Error: ' + error) # TODO
        return redirect('spotify')
    else:
        r = requests.post('https://accounts.spotify.com/api/token',
            data = {
                'grant_type': 'authorization_code',
                'code': code,
                'redirect_uri': REDIRECT_URI,
            }, 
            headers = {
                'Authorization': 'Basic ' + ENCODED_CLIENT_INFO
            }
        )
        if r.status_code != 200:
            print('Error when requesting access token: ' + str(r.status_code)) # TODO
        else:
            data = r.json()
            access_token = data['access_token']
            refresh_token = data['refresh_token']
            expires_at = time.time() + float(data['expires_in'])
            request.session['access_token'] = access_token
            request.session['refresh_token'] = refresh_token
            request.session['expires_at'] = expires_at

            if request.user.is_staff:
                setContance(access_token, refresh_token, expires_at)
        
        return redirect('spotify')

def refresh_token(request):
    refresh_token = request.session['refresh_token']
    r = requests.post('https://accounts.spotify.com/api/token',
        data = {
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token,
        }, 
        headers = {
            'Authorization': 'Basic ' + ENCODED_CLIENT_INFO
        }
    )
    
    if r.status_code != 200:
        print('Error when using refresh token: ' + str(r.status_code)) # TODO
    else:
       data = r.json()

       access_token = data['access_token']
       expires_at = time.time() + float(data['expires_in'])

       request.session['access_token'] = access_token
       request.session['expires_at'] = expires_at

       if request.user.is_staff:
            setContance(access_token, None, expires_at)
    
    return redirect('spotify')

def logout(request):
    for key in ['access_token', 'refresh_token', 'expires_at']:
        if key in request.session:
            del request.session[key]

    if request.user.is_staff:
        constance.config.STAFF_ACCESS_TOKEN = ''
        constance.config.STAFF_REFRESH_TOKEN = ''
        constance.config.STAFF_EXPIRES_AT = 0.0

    return redirect('spotify')