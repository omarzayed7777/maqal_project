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
    navigator.clipboard.writeText(copyText.value);
  }

async function chatgptCall(systemSettings, userInput, chatDiv, chunk) {
  const response = await fetch('/gpt-api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      system_settings: systemSettings,
      user_input: userInput,
      chunk: chunk
    }),
  });

  const reader = response.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = new TextDecoder().decode(value);
    chatDiv.innerHTML += chunk;
  }
}