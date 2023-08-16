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