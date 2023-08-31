from pymongo import MongoClient
import uuid  # To generate unique IDs
import base64

def insert_ai_image_db(prompt, ai_model, style_used, transformed_image_data):
    try:
        # Create a MongoClient
        client = MongoClient('localhost', 27017)  # Change host and port as needed

        # Create or access a database
        db = client['ai_generator']

        # Define a collection schema
        ai_images_collection = db['ai_images']

        # Generate a unique ID
        unique_id = str(uuid.uuid4())

        # Insert a new AI image into the collection
        new_ai_image = {
            'id': unique_id,
            'prompt': prompt,
            'ai_model': ai_model,
            'style_used': style_used,
            'transformed_image': transformed_image_data
        }

        # Insert the document into the collection
        ai_images_collection.insert_one(new_ai_image)

        # Close the MongoDB connection
        client.close()

        print("Success: Document inserted successfully.")
        return 1
    except Exception as e:
        print("Error:", e)
        return 0
    

def fetch_ai_images():
    try:
        # Create a MongoClient
        client = MongoClient('localhost', 27017)  # Change host and port as needed

        # Access the database
        db = client['ai_generator']

        # Access the collection
        ai_images_collection = db['ai_images']

        # Fetch all AI images from the collection
        ai_images = ai_images_collection.find({})

        # Process the fetched data
        processed_images = []
        for image in ai_images:
            # Convert binary image data to base64
            image_data = base64.b64encode(image['transformed_image']).decode('utf-8')
            image_url = f"data:image/jpeg;base64,{image_data}"  # Convert to URL format
            
            processed_image = {
                'id': image['id'],
                'prompt': image['prompt'],
                'ai_model': image['ai_model'],
                'style_used': image['style_used'],
                'transformed_image': image_url  # Use the URL format
            }
            processed_images.append(processed_image)

        # Close the MongoDB connection
        client.close()
        print("image data fetched successfully")
        return processed_images
    except Exception as e:
        print("Error:", e)
        return []
