async function writeArticle() {
  const chatDiv = document.getElementById('maqal');
  const systemSettings = 'The user will input a title. Your job is to use the title to write an article in Arabic.';
  const userInput = document.getElementById('articleTitle').value;
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

async function writeKeywords() {
  const chatDiv = document.getElementById('keywords');
  const systemSettings = 'You must write keywords/tags based on the user input. These keywords/tags must be in Arabic.';
  const userInput = document.getElementById('articleTitle').value;
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

async function extendArticle() {
  const chatDiv = document.getElementById('maqal');
  const systemSettings = 'The user will input an article. Your job is to extend the article in Arabic. Only give the extension.';
  const userInput = document.getElementById('maqal').value;
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
  chatDiv.innerHTML += '\n\n';
  const reader = response.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = new TextDecoder().decode(value);
    chatDiv.innerHTML += chunk;
  }
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