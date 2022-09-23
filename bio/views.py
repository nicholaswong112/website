from django.shortcuts import render

def index(request):
    return render(request, 'bio/index.html')

def about(request):
    return render(request, 'bio/about.html')
