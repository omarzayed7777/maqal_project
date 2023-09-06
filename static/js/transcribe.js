
async function transcribeFunction() {
    const transcribeButton = document.querySelector('#transcribeAudio');
    const textarea = document.getElementById('toSummarize');
    const fileInput = document.getElementById('file');
    transcribeButton.innerHTML = 'جاري التفريغ...'
    transcribeButton.style.background = '#99d1ff';
    transcribeButton.style.borderColor = '#99d1ff';

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
      const response = await fetch('/transcribe-api', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const transcription = await response.text();
      textarea.value = transcription;
    } catch (error) {
      console.error('Error:', error);
    }
    transcribeButton.innerHTML = 'اكتب'
    transcribeButton.style.background = '';
    transcribeButton.style.borderColor = '';
    writeKeywords()
};

async function writeKeywords() {
  const chatDiv = document.getElementById('keywords');
  const systemSettings = 'You must write keywords/tags based on the user input. These keywords/tags must be in Arabic.';
  const userInput = document.getElementById('toSummarize').value.slice(0, 3000);
  const response = await fetch('/gpt-api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      system_settings: systemSettings,
      user_input: userInput,
    }),
  });
  chatDiv.innerHTML = '';
  const reader = response.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = new TextDecoder().decode(value);
    chatDiv.innerHTML += chunk;
  }
  generateImage()
}

function downloadImage() {
  const outputImage = document.getElementById('outputImage');
  const downloadLink = document.createElement('a');
  downloadLink.href = outputImage.src;
  downloadLink.download = 'downloaded_image.jpg';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function generateImage() {
  const promptInput = document.getElementById('keywords');
  const drawButton = document.getElementById('drawButton');
  const outputImage = document.getElementById('outputImage');
  drawButton.style.backgroundColor = '#99d1ff';
  drawButton.style.borderColor = '#99d1ff';
  drawButton.innerHTML = 'جاري التحميل...';

  const prompt = promptInput.value;

  fetch('/sd-api', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: prompt })
  })
  .then(response => response.json())
  .then(data => {
      const imageUrl = data.imageUrl;
      outputImage.src = imageUrl;
      drawButton.style.backgroundColor = '';
      drawButton.style.borderColor = '';
      drawButton.innerHTML = 'إعادة رسم';
  })
  .catch(error => {
      console.error('Error fetching data:', error);
      drawButton.style.backgroundColor = '';
      drawButton.style.borderColor = '';
      drawButton.innerHTML = 'إعادة رسم';
  });
}

function clipboard(inputField) {
  var copyText = document.getElementById(inputField);
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyText.value);
}