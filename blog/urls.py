from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='blog'),
    path('<slug:slug>/', views.post, name='post')
]
