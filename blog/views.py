from django.contrib.postgres.search import SearchVector, SearchQuery
from django.shortcuts import render
from django.http import Http404
# from django.db.models import Q

from .models import Post, Tag

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

def filter_by_tags(posts, tags):
    return posts.filter(tags__name__in=tags)

def index(request):
    queries = request.GET
    if 'keywords' not in queries and 'tags' not in queries:
        # return everything, no filtering
        all_tags = get_all_tags()
        context = { 
            'posts': Post.objects.all().order_by('-publish_date'), 
            'active_tags': all_tags,
            'all_tags': all_tags
        }
    else:
        keywords = queries.get('keywords') # None if missing
        tags = queries.getlist('tags') # empty list if missing
        posts = maybe_filtered_posts(keywords)
        posts = filter_by_tags(posts, tags)
        context = { 
            'is_search': True, 
            'search_terms': keywords, 
            'posts': posts.order_by('-publish_date'), 
            'active_tags': tags,
            'all_tags': get_all_tags()
        }
    return render(request, 'blog/index.html', context)

def post(request, slug):
    try:
        post = Post.objects.get(slug=slug)
    except Post.DoesNotExist:
        raise Http404("Post does not exist")       
    all_tags = get_all_tags()
    context = {
        'post': post, 
        'active_tags': all_tags,
        'all_tags': all_tags 
    }
    return render(request, 'blog/post.html', context)
