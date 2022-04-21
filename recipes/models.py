from django.db import models

# Create your models here.
class Recipe(models.Model):
    title = models.CharField(max_length=100)
    blurb = models.CharField(max_length=100)
    author = models.CharField(max_length=50)
    portion_yield = models.PositiveSmallIntegerField()
    creation_stamp = models.DateTimeField(auto_now_add=True)
    update_stamp = models.DateTimeField(auto_now=True)
    ingredients = models.TextField()
    steps = models.TextField()

    def __str__(self):
        return self.title

    # uses title, creation_stamp microseconds, and id to 
    # construct a unique string per recipe
    # only the digits after the first 6 matters for lookup
    def slug_str(self):
        title = '-'.join(self.title.lower().split())
        return title + self.creation_stamp.strftime('-%f') + str(self.id)

class Tag(models.Model):
    text = models.CharField(max_length=30)
    recipes = models.ManyToManyField(Recipe)

    def __str__(self):
        return self.text
