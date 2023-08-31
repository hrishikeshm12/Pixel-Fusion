
document.addEventListener("DOMContentLoaded", function () {
    const mobileDropdownButton = document.getElementById('mobile-dropdown-button');
    const mobileDropdownContent = document.getElementById('mobile-dropdown-content');

    mobileDropdownButton.addEventListener('click', () => {
        mobileDropdownContent.classList.toggle('hidden');
    });
    
    // Close dropdown if clicked outside
    document.addEventListener('click', (event) => {
        if (!mobileDropdownButton.contains(event.target) && !mobileDropdownContent.contains(event.target)) {
            mobileDropdownContent.classList.add('hidden');
        }
    });
});

let modelname=""  // this will be used to catch the model name used in generation of the prompt image
document.addEventListener('DOMContentLoaded', function () {
    const generateOpenAIButton = document.getElementById('generate-openai-images');
    const openaiGeneratedImage = document.getElementById('openai-generated-image');
    const openaiImageLoading = document.getElementById('openai-loading');
    const openaiDownloadButton = document.getElementById('openai-download-button');
    const openaiTransformButton = document.getElementById('openai-transform-button');
    const aiGeneratedImage = document.getElementById('ai-generated-image');

    // Get CSRF token from the cookie
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    generateOpenAIButton.addEventListener('click', async function () {
        const commonPrompt = document.getElementById('common-prompt').value;
        const csrfToken = getCookie('csrftoken');
        modelname="Open AI";

        openaiImageLoading.classList.remove('hidden'); // Show the loading animation

        try {
            const openaiResponse = await fetch('/generate_openai_image/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    prompt: commonPrompt,
                }),
            });

            if (openaiResponse.ok) {
                const openaiData = await openaiResponse.json();
                if (openaiData && openaiData.image_url) {
                    const openaiImageUrl = openaiData.image_url;
                    openaiGeneratedImage.src = openaiImageUrl;
                    
                    // Enable the download button
                    openaiDownloadButton.disabled = false;
                    // Enable the transform button
                    openaiTransformButton.disabled = false;
                } else {
                    console.error('No OpenAI image URL received from the server.');
                }
            } else {
                console.error('Network response for OpenAI was not ok');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            openaiImageLoading.classList.add('hidden'); // Hide the loading animation
        }
    });

    // Download button click handler
    openaiDownloadButton.addEventListener('click', function () {
        const openaiImageUrl = openaiGeneratedImage.src;
        window.open(openaiImageUrl, '_blank');
    });

    // Transform button click handler
    openaiTransformButton.addEventListener('click', function () {
        // Your logic for transforming the OpenAI image and updating aiGeneratedImage goes here
        aiGeneratedImage.src = openaiGeneratedImage.src;
    });

    
});


document.addEventListener('DOMContentLoaded', function () {
    const generateStableDiffusionButton = document.getElementById('generate-stablediffusion-images');
    const stablediffusionGeneratedImage = document.getElementById('stablediffusion-generated-image');
    const stablediffusionImageLoading = document.getElementById('stablediffusion-loading');

    // Get CSRF token from the cookie
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    generateStableDiffusionButton.addEventListener('click', async function () {
        const commonPrompt = document.getElementById('common-prompt').value;
        const csrfToken = getCookie('csrftoken');
        modelname="Stable Diffusion";

        stablediffusionImageLoading.classList.remove('hidden'); // Show the loading animation

        try {
            const stablediffusionResponse = await fetch('/generate_stablediffusion_image/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    prompt: commonPrompt,
                }),
            });

            if (stablediffusionResponse.ok) {
                const stablediffusionData = await stablediffusionResponse.json();
                if (stablediffusionData && stablediffusionData.image_url) {
                    const stablediffusionImageUrl = stablediffusionData.image_url;
                    stablediffusionGeneratedImage.src = stablediffusionImageUrl;
                } else {
                    console.error('No Stable Diffusion image URL received from the server.');
                }
            } else {
                console.error('Network response for Stable Diffusion was not ok');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            stablediffusionImageLoading.classList.add('hidden'); // Hide the loading animation
        }
    });

});




// style dropdown logic 

const styleDict = {
    "kanagawa_great_wave":'https://upload.wikimedia.org/wikipedia/commons/0/0a/The_Great_Wave_off_Kanagawa.jpg',
    "kandinsky_composition_7":'https://upload.wikimedia.org/wikipedia/commons/b/b4/Vassily_Kandinsky%2C_1913_-_Composition_7.jpg',
    "hubble_pillars_of_creation":'https://upload.wikimedia.org/wikipedia/commons/6/68/Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg',
    "van_gogh_starry_night":'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1024px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
    "turner_nantes":'https://upload.wikimedia.org/wikipedia/commons/b/b7/JMW_Turner_-_Nantes_from_the_Ile_Feydeau.jpg',
    "munch_scream":'https://upload.wikimedia.org/wikipedia/commons/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg',
    "picasso_demoiselles_avignon":'https://upload.wikimedia.org/wikipedia/en/4/4c/Les_Demoiselles_d%27Avignon.jpg',
    "picasso_violin":'https://upload.wikimedia.org/wikipedia/en/3/3c/Pablo_Picasso%2C_1911-12%2C_Violon_%28Violin%29%2C_oil_on_canvas%2C_Kr%C3%B6ller-M%C3%BCller_Museum%2C_Otterlo%2C_Netherlands.jpg',
    "picasso_bottle_of_rum":'https://upload.wikimedia.org/wikipedia/en/7/7f/Pablo_Picasso%2C_1911%2C_Still_Life_with_a_Bottle_of_Rum%2C_oil_on_canvas%2C_61.3_x_50.5_cm%2C_Metropolitan_Museum_of_Art%2C_New_York.jpg',
    "fire":'https://upload.wikimedia.org/wikipedia/commons/3/36/Large_bonfire.jpg',
    "derkovits_woman_head":'https://upload.wikimedia.org/wikipedia/commons/0/0d/Derkovits_Gyula_Woman_head_1922.jpg',
    "amadeo_style_life":'https://upload.wikimedia.org/wikipedia/commons/8/8e/Untitled_%28Still_life%29_%281913%29_-_Amadeo_Souza-Cardoso_%281887-1918%29_%2817385824283%29.jpg',
    "derkovtis_talig":'https://upload.wikimedia.org/wikipedia/commons/3/37/Derkovits_Gyula_Talig%C3%A1s_1920.jpg',
    "amadeo_cardoso":'https://upload.wikimedia.org/wikipedia/commons/7/7d/Amadeo_de_Souza-Cardoso%2C_1915_-_Landscape_with_black_figure.jpg'
};

const styleDropdown = document.getElementById("style-dropdown");
const styleImage = document.getElementById("style-image");

// Populate dropdown with style names
for (const styleName in styleDict) {
    const option = document.createElement("option");
    option.value = styleName;
    option.text = styleName;
    styleDropdown.appendChild(option);
}

// Add event listener for dropdown change
styleDropdown.addEventListener("change", function () {
    const selectedStyle = styleDropdown.value;
    const selectedStyleImageURL = styleDict[selectedStyle];
    styleImage.src = selectedStyleImageURL;
});


document.addEventListener('DOMContentLoaded', function () {
    
    const PerformTransformButton = document.getElementById('perform-style-transfer');
    const TransformedImage = document.getElementById('transformed-image');
    const SaveTransformedImageButton = document.getElementById('save-transformed-image');
    const TransformedImageLoading = document.getElementById('transformed-image-loading');


     // Get CSRF token from the cookie
     function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    
    // Event listener for the style dropdown
    const styleDropdown = document.getElementById('style-dropdown');
    let selectedStyleImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/0/0a/The_Great_Wave_off_Kanagawa.jpg'; // Default value
    styleDropdown.addEventListener('change', function () {
        selectedStyleImageUrl = styleDict[styleDropdown.value];
    });

    PerformTransformButton.onclick = async function () {
        // Get the content image URL from the generated image
        const contentImageUrl = document.getElementById('ai-generated-image').src;
        const csrfToken = getCookie('csrftoken');
        
        // Show the loading animation
        console.log('Button clicked, showing loading spinner...');
        TransformedImageLoading.classList.remove('hidden');;

        // Send a request to the server for transformation
        try {
            const response = await fetch('/transform_image/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrfToken,
                },
                body: `content_image_url=${encodeURIComponent(contentImageUrl)}&style_image_url=${encodeURIComponent(selectedStyleImageUrl)}`
            });
    
            if (response.ok) {
                const blob = await response.blob(); // Get the blob from the response
                const transformedImageUrl = URL.createObjectURL(blob); // Create object URL from the blob
    
                // Update the "Transformed Image" element with the transformed image
                TransformedImage.src = transformedImageUrl;
            } else {
                console.error('Error:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            // Hide the loading animation
            console.log('Transformed image updated, hiding loading spinner...');
            TransformedImageLoading.classList.add('hidden');;
        }
    };

    // Save transformed image to the gallery
    SaveTransformedImageButton.onclick = function () {
        const transformedImageUrl = TransformedImage.src;
        // Implement the logic to save the image to the gallery here
    };
});


///////////////////////////////////////////////////// image save to databse logic ////////////////////////////////////////////




const saveToGalleryButton = document.getElementById('save-transformed-image');

saveToGalleryButton.addEventListener('click', async () => {
    const promptText = document.getElementById('common-prompt').value;
    const aiModel = modelname;
    const styleName = document.getElementById("style-dropdown").value;
    // Get the blob image URL from an HTML element by its ID
    const blobImageUrl = document.getElementById('transformed-image').src;

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const csrftoken = getCookie('csrftoken'); // Get the CSRF token

    try {
        const formData = new FormData();
        formData.append('prompt', promptText);
        formData.append('ai_model', aiModel);
        formData.append('style_name', styleName);

        // Fetch the Blob directly from the Blob URL
        const imageResponse = await fetch(blobImageUrl);
        const binaryImageBlob = await imageResponse.blob();
        formData.append('transformed_image', binaryImageBlob);

        const insertResponse = await fetch('/insert_ai_image/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': csrftoken, // Include CSRF token in the headers
            },
        });

        if (insertResponse.ok) {
            const data = await insertResponse.json();
            if (data.success) {
                alert('Image saved successfully');
                console.log('Image inserted successfully');
            } else {
                console.error('Failed to insert image');
            }
        } else {
            console.error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});



///////////////////// Render Saved Images /////////////////////////////////









