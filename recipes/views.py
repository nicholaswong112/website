from django.http import Http404
from django.shortcuts import render, get_object_or_404

from .models import Recipe

# Create your views here.

# Shows all recipes
# TODO only show X recipes
def index(request):
    recipes = Recipe.objects.all()
    # filter out fields to use
    recipes = [(r.title, r.blurb, r.slug_str()) for r in recipes]
    context = {
        'recipes': recipes
    }
    return render(request, 'recipes/index.html', context)

def detail(request, slug):
    # id is after microseconds, see models.py
    recipe_id = int(slug.split('-')[-1][6:])
    recipe = get_object_or_404(Recipe, pk=recipe_id)
    # validate the slug
    if recipe.slug_str() != slug:
        raise Http404('Unknown recipe URL')
    return render(request, 'recipes/detail.html', { 'recipe': recipe })