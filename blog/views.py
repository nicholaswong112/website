from django.contrib.postgres.search import SearchVector, SearchQuery
from django.shortcuts import render, get_object_or_404, redirect
from django.http import Http404

from .models import Post, Tag
from .forms import CommentForm

# Helper for search bar tag options
# CR-someday: cache this?
def get_all_tags():
    return list(map(lambda tag: str(tag), Tag.objects.all()))

# doesn't filter if keywords == ""
def maybe_filtered_posts(keywords):
    if not keywords:
        return Post.objects.all()
    vector = SearchVector('title', 'hook', 'body')
    query = SearchQuery(keywords)
    return Post.objects.annotate(search=vector).filter(search=query)

def index(request):
    keywords = request.GET.get('keywords') # None if missing
    tags = request.GET.getlist('tags') # empty list if missing
    all_tags = get_all_tags()
    if keywords is None and tags == []:
        # return everything, no filtering
        context = { 
            'posts': Post.objects.all().order_by('-publish_date'), 
            'active_tags': all_tags,
            'all_tags': all_tags
        }
    else:
        posts = maybe_filtered_posts(keywords)
        posts = posts.filter(tags__name__in=tags).distinct()
        context = { 
            'is_search': True, 
            'search_terms': keywords, 
            'posts': posts.order_by('-publish_date'), 
            'active_tags': tags,
            'all_tags': all_tags
        }
    return render(request, 'blog/index.html', context)

def post(request, slug):
    post = get_object_or_404(Post, slug=slug)
    all_tags = get_all_tags()
    comments = post.comment_set.all()
    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.post = post
            comment.save()

            return redirect('post', slug=slug)
    else:
        form = CommentForm()
    context = {
        'post': post, 
        'active_tags': all_tags,
        'all_tags': all_tags,
        'comments': comments,
        'form': form,
    }
    return render(request, 'blog/post.html', context)
