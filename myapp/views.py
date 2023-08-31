from django.shortcuts import render
from django.http import JsonResponse
from django.http import JsonResponse, HttpResponse 
import requests
import json
import base64
from django.http import HttpResponse
import io
import tensorflow as tf
from PIL import Image
from django.views.decorators.csrf import csrf_exempt
from .openai_logic import generate_openai_image
from .generate_stablediffusion_images import generate_stablediffusion_image
from .image_transform import stylize_image
from .store_fetch_data import insert_ai_image_db 
from .store_fetch_data import fetch_ai_images


def homepage(request):
    return render(request, 'homepage.html')

def mainpage(request):
    return render(request, 'mainpage.html')

def gallery(request):
    images = fetch_ai_images()  # Query your image model for data
    
    return render(request, 'gallery.html', {'images': images})

def generate_openai_image_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            prompt = data.get('prompt', '')

            image_url = generate_openai_image(prompt)
            if image_url:
                return JsonResponse({'image_url': image_url})
            else:
                return JsonResponse({'error': 'Failed to generate image'}, status=500)
        except Exception as e:
            error_message = f"Error generating OpenAI image: {e}"
            print(error_message)
            return JsonResponse({'error': error_message}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=400)


def generate_stablediffusion_image_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            prompt = data.get('prompt', '')

            image_url = generate_stablediffusion_image(prompt)
            if image_url:
                    return JsonResponse({'image_url': image_url})
            else:
                    return JsonResponse({'error': 'Failed to generate image'}, status=500)
        except Exception as e:
            error_message = f"Error generating Stable Diffusion image: {e}"
            print(error_message)
            return JsonResponse({'error': error_message}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=400)



def transform_image(request):
    if request.method == 'POST':
        content_image_url = request.POST.get('content_image_url')
        style_image_url = request.POST.get('style_image_url')
        print(content_image_url)
        print(style_image_url)

        transformed_image = stylize_image(content_image_url, style_image_url)

        # Convert the transformed image to PNG format using TensorFlow
        transformed_image_png = tf.image.encode_png(tf.cast(transformed_image * 255, tf.uint8))

        # Return the PNG image as a binary response
        response = HttpResponse(transformed_image_png.numpy(), content_type='image/png')
        response['Content-Disposition'] = 'attachment; filename="transformed_image.png"'
        return response




from django.http import JsonResponse

def insert_ai_image(request):
    if request.method == 'POST':
        prompt = request.POST.get('prompt')
        ai_model = request.POST.get('ai_model')
        style_name = request.POST.get('style_name')
        transformed_image_blob = request.FILES.get('transformed_image')

        try:
            # Convert the Blob image to binary data
            transformed_image_binary = transformed_image_blob.read()

            # Use the insert_ai_image function to insert data into the database
            success = insert_ai_image_db(prompt, ai_model, style_name, transformed_image_binary)

            if success:
                return JsonResponse({'success': True})  # Return a JSON response indicating success
            else:
                return JsonResponse({'success': False})  # Return a JSON response indicating failure
        except Exception as e:
            print('Error:', e)
            return JsonResponse({'success': False})  # Return a JSON response indicating failure


