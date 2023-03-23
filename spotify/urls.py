from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.index, name='spotify'),
    path('login', views.login, name='splogin'),
    path('callback', views.callback, name='spcallback'),
    path('refresh_token', views.refresh_token, name='sprefresh'),
    path('logout', views.logout, name='splogout'),
    re_path(r'^api/', views.api, name='api'),
]
