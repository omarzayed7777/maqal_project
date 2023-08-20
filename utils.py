import openai
import os
from dotenv import load_dotenv
import requests
from langchain.document_loaders import TextLoader
from langchain.indexes import VectorstoreIndexCreator
from langchain.chat_models import ChatOpenAI
load_dotenv()

loader = TextLoader('questions.txt', encoding='utf-8')
index = VectorstoreIndexCreator().from_loaders([loader])
openai.api_key = os.getenv('OPENAI_API_KEY')
ENGINE_ID = 'stable-diffusion-xl-1024-v1-0'
API_HOST = 'https://api.stability.ai'
stablediffusion_api_key = os.getenv('DREAMSTUDIO_KEY')

def chatgpt(system_settings, user_input):
    for x in user_input:
        if len(x) != 0:
            if len(x) > 2000:
                x = x[:2000]
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "system", "content": system_settings}, {"role": "user", "content": x}],
                temperature=0,
                stream=True
            )
            for x in response:
                if x.choices[0].delta.get('content'):
                    yield x.choices[0].delta.content
            if len(user_input) != 1 and user_input[-1] != x:
                yield '\n\n'

def modified_gpt(user_input):
    response = index.query(question=user_input, llm=ChatOpenAI())
    return response

def diffusion(prompt):
    response = requests.post(
    f"{API_HOST}/v1/generation/{ENGINE_ID}/text-to-image",
    headers={
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": f"Bearer {stablediffusion_api_key}"
    },
    json={
            "text_prompts": [
                {
                    "text": prompt
                }
            ],
            "cfg_scale": 7,
            "height": 1024,
            "width": 1024,
            "samples": 1,
            "steps": 30,
        },
    )

    if response.status_code != 200:
        raise Exception("Non-200 response: " + str(response.text))

    data = response.json()
    output = ''
    for i, image in enumerate(data["artifacts"]):
        base64_string = image["base64"]
        output += base64_string
    return output

def transcribe_function(path):
    with open(path, "rb") as audio_file:
        transcript = openai.Audio.transcribe("whisper-1", audio_file)
    return transcript['text']

def translate_keywords(user_input):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "system", "content": 'You will be given a set of keywords. Translate them into English.'}, {"role": "user", "content": user_input}],
        temperature=0
    )
    return response['choices'][0]['message']['content']