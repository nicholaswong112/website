from django.db import models

class Tag(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Post(models.Model):
    title = models.CharField(max_length=100)
    slug = models.CharField(max_length=50, unique=True)
    hook = models.CharField(max_length=200)
    feature_image = models.CharField(max_length=100)
    tags = models.ManyToManyField(Tag, blank=True)
    publish_date = models.DateField(auto_now_add=True)
    latest_modified_date = models.DateField(auto_now=True)
    body = models.TextField()

    def __str__(self):
        return self.title