from django.urls import path
from . import views

urlpatterns = [
    path('', views.homepage, name='homepage'),
     path('mainpage/', views.mainpage, name='mainpage'),
     path('gallery/', views.gallery, name='gallery'),
     path('generate_openai_image/', views.generate_openai_image_view, name='generate_openai_image'),
    path('generate_stablediffusion_image/', views.generate_stablediffusion_image_view, name='generate_stablediffusion_image'),
    path('transform_image/', views.transform_image, name='transform_image'),
    path('insert_ai_image/', views.insert_ai_image, name='insert_ai_image'),
    
    # Add more URL patterns here
]
