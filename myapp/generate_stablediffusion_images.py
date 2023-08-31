import requests
import json


def generate_stablediffusion_image(prompt):
    url = "https://stablediffusionapi.com/api/v3/text2img"
    payload = json.dumps({
        "key": "",
        "prompt": prompt,
        "negative_prompt": None,
        "width": "512",
        "height": "512",
        "samples": "1",
        "num_inference_steps": "20",
        "seed": None,
        "guidance_scale": 7.5,
        "safety_checker": "yes",
        "multi_lingual": "no",
        "panorama": "no",
        "self_attention": "no",
        "upscale": "no",
        "embeddings_model": None,
        "webhook": None,
        "track_id": None
    })
    headers = {
        'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    print(response.text)
    response_data = response.json()

    if 'output' in response_data and len(response_data['output']) > 0:
        image_url = response_data['output']
        image_response = requests.get(image_url)
        
        print(response_data)
        return image_url
    else:
        return None
    


generate_stablediffusion_image("car image")