import json
import openai
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


OPENAI_API_KEY = ''

def generate_openai_image(prompt):
    openai.api_key = OPENAI_API_KEY 

    try:
        response = openai.Image.create(
            prompt=prompt,
            n=1,
            size="256x256"
        )

        image_url = response['data'][0]['url']
        return image_url
    except Exception as e:
        error_message = f"Error generating OpenAI image: {e}"
        print(error_message)
        return None