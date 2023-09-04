from flask import Flask, render_template, request
from utils import chatgpt, diffusion, transcribe_function, translate_keywords, modified_gpt
import tempfile
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/create-article')
def create_article():
    return render_template('create-article.html')
    
@app.route('/summarize-article')
def summarize_article():
    return render_template('summarize-article.html')
    
@app.route('/gpt-api', methods=['POST'])
def gpt_api():
    system_settings = request.json.get('system_settings')
    user_input = request.json.get('user_input')
    chunk = request.json.get('chunk')
    #Token in Arabic != Token in English
    return chatgpt(system_settings, user_input, chunk)

@app.route('/langchain-gpt', methods=['POST'])
def langchain_gpt():
    user_input = request.json.get('user_input')
    return modified_gpt(user_input)

@app.route('/sd-api', methods=['POST'])
def sd_api():
    prompt = request.json.get('prompt')
    return {
        'imageUrl': "data:image/png;base64, " + diffusion(translate_keywords(prompt))
    }

@app.route('/transcribe')
def transcribe():
    return render_template('transcribe.html')

@app.route('/chatbot')
def chatbot():
    return render_template('chatbot.html')

@app.route('/transcribe-api', methods=['POST'])
def transcribe_api():
    uploaded_file = request.files['file']
    original_filename = uploaded_file.filename
    _, file_extension = os.path.splitext(original_filename)
    with tempfile.NamedTemporaryFile(suffix=file_extension, delete=False) as temp_file:
        temp_path = temp_file.name
        uploaded_file.save(temp_path)
        transcription = transcribe_function(temp_path)
        print(transcription)
        temp_file.close()
    os.remove(temp_path)
    return transcription

if __name__ == "__main__":
    app.run(debug=True)