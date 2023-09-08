async function summarizeArticle() {
  const userInput = document.getElementById('toSummarize').value;
  const chatDiv = document.getElementById('summarized');
  const systemSettings = 'The user will input a piece of text. Your job is to write a short summary, in Arabic.';
  const response = await fetch('/gpt-api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      system_settings: systemSettings,
      user_input: userInput,
      chunk: true
    }),
  });

  const reader = response.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = new TextDecoder().decode(value);
    chatDiv.innerHTML += chunk;
  }
  writeTitle()
}

async function writeKeywords() {
  const userInput = document.getElementById('summarized').value.slice(0, 3000);
  const chatDiv = document.getElementById('keywords');
  const systemSettings = 'You must write keywords/tags based on the user input. These keywords/tags must be in Arabic, separated by commas.';
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

  const reader = response.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = new TextDecoder().decode(value);
    chatDiv.innerHTML += chunk;
  }
  generateImage()
}

async function writeTitle() {
  const userInput = document.getElementById('summarized').value.slice(0, 3000);
  const chatDiv = document.getElementById('title');
  const systemSettings = 'You are given a short text. Give this text a suitable title in Arabic.';
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

  const reader = response.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = new TextDecoder().decode(value);
    chatDiv.innerHTML += chunk;
  }
  writeKeywords()
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
  const prompt = document.getElementById('keywords').value;
  const drawButton = document.getElementById('drawButton');
  const outputImage = document.getElementById('outputImage');
  drawButton.style.backgroundColor = '#99d1ff';
  drawButton.style.borderColor = '#99d1ff';
  drawButton.innerHTML = 'جاري التحميل...';

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