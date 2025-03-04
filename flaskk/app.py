from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = Flask(__name__)

# CORS setup to allow requests from React app
CORS(app, resources={r"/upload": {"origins": "http://localhost:5173"}})

# Your existing Google Gemini API configuration
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def analyze_image_and_prompt(image_data, prompt, code_prompt):
    model = genai.GenerativeModel('gemini-bard')
    response = model.generate_content([prompt] + image_data + [code_prompt])
    return response.text

@app.route('/upload', methods=['POST'])
def upload():
    prompt = request.form.get('prompt', '')
    
    # Check if a file is uploaded
    if 'file' in request.files and request.files['file'].filename != '':
        file = request.files['file']
        
        # Process the image
        img = Image.open(file)
        img_data = io.BytesIO()
        img.save(img_data, format='PNG')
        img_data.seek(0)

        # Prepare the image data for the API
        image_parts = [{
            "mime_type": file.content_type,
            "data": img_data.getvalue()
        }]
    else:
        image_parts = []  # No image data if no file is uploaded

    code_prompt = """
    you are a code helper ai. help the person by solving or helping in finding the error. The way to express that type of questions is following:
    if the person's question is solving an error, then first give the error explanation then provide a solution in the easiest way.
    else if the person asks a question for writing code, then first give an explanation and the way to solve that code, then write the code for that question and prefer cpp language for writing code.
    else if the person asks any theory question, then first write the solution of that question, provide examples if needed, and you may use code for examples.
    else if the person asks a question that is not related to coding, then say sorry, but I can't help you with this type of question.
    """

    # Call the Gemini API
    analysis_response = analyze_image_and_prompt(image_parts, prompt, code_prompt)

    return jsonify({'response': analysis_response})

if __name__ == '__main__':
    app.run(debug=True)
