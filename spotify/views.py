from django.shortcuts import render, redirect
import string, random, requests, base64
from urllib.parse import urlencode

CLIENT_ID = '4b73799e86f6492ab514fd92b08f30b6'
CLIENT_SECRET = '<redacted>'
ENCODED_CLIENT_INFO = base64.b64encode((CLIENT_ID + ':' + CLIENT_SECRET).encode('utf-8')).decode('utf-8')
REDIRECT_URI = 'http://localhost:8000/spotify/callback'

def index(request):
    context = {}
    if request.session.get('access_token'):
        context['logged_in'] = True
    return render(request, 'spotify/index.html', context)

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
        print('Error: ' + error) # TODO
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
            print('Error: ' + str(r.status_code)) # TODO
            return redirect('spotify')
        else:
           data = r.json()
           request.session['access_token'] = data['access_token'] 
           request.session['refresh_token'] = data['refresh_token'] 
           #expires_in = data['expires_in'] 
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
        print('Error: ' + str(r.status_code)) # TODO
        return redirect('spotify')
    else:
       data = r.json()
       request.session['access_token'] = data['access_token'] 
       #expires_in = data['expires_in'] 
       return redirect('spotify')

def logout(request):
    request.session.flush()
    return redirect('spotify')