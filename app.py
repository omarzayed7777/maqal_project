from flask import Flask, render_template, request, Response
from utils import chatgpt, diffusion, transcribe_function, translate_keywords
import tempfile
import os
import time

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/create-article', methods=['GET', 'POST'])
def create_article():
    if request.method == 'GET':
        return render_template('create-article.html')
    
    
@app.route('/summarize-article', methods=['GET', 'POST'])
def summarize_article():
    if request.method == 'GET':
        return render_template('summarize-article.html')
    
@app.route('/gpt-api', methods=['POST'])
def gpt_api():
    system_settings = request.json.get('system_settings')
    user_input = request.json.get('user_input')
    return Response(chatgpt(system_settings, user_input))

@app.route('/sd-api', methods=['POST'])
def sd_api():
    prompt = request.json.get('prompt')
    print(prompt)
    return {
        'imageUrl': "data:image/png;base64, " + diffusion(translate_keywords(prompt))
    }

@app.route('/transcribe')
def transcribe():
    return render_template('transcribe.html')

@app.route('/transcribe-api', methods=['POST'])
def transcribe_api():

    # Assuming the audio file is sent as 'file' in the POST request
    uploaded_file = request.files['file']
    original_filename = uploaded_file.filename
    _, file_extension = os.path.splitext(original_filename)
    # Create a temporary file
    with tempfile.NamedTemporaryFile(suffix=file_extension, delete=False) as temp_file:
        temp_path = temp_file.name

        # Save the uploaded file to the temporary path
        uploaded_file.save(temp_path)

        # Transcribe the audio
        transcription = transcribe_function(temp_path)
        print(transcription)

        # Close the temporary file before removing it
        temp_file.close()

    # Remove the temporary file now that it's closed
    os.remove(temp_path)

    # Return the transcription as a response
    return transcription

if __name__ == "__main__":
    app.run(debug=True)