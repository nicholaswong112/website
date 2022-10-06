from django.shortcuts import render
from django.http import Http404

from .models import Post, Tag

def index(request):
    posts = Post.objects.all()
    tags = list(map(lambda tag: str(tag), Tag.objects.all()))
    context = { 'posts': posts, 'tags': tags }
    return render(request, 'blog/index.html', context)

def post(request, slug):
    try:
        post = Post.objects.get(slug=slug)
    except Post.DoesNotExist:
        raise Http404("Post does not exist")       
    context = {'post': post}
    return render(request, 'blog/post.html', context)
