from flask import Flask, render_template, request, Response
from utils import chatgpt, diffusion

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
    return {
        'imageUrl': "data:image/png;base64, " + diffusion(prompt)
    }

@app.route('/transcribe')
def transcribe():
    return render_template('transcribe.html')

@app.route('/transcribe-api', methods=['POST'])
def transcribe_api():
    return 'hey'

if __name__ == "__main__":
    app.run(debug=True)