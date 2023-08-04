async function summarizeArticle() {
  const chatDiv = document.getElementById('summarized');
  const systemSettings = 'The user will input an article. Your job is to write a very short summary, in Arabic.';
  const userInput = document.getElementById('toSummarize').value;
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
    // Process the chunk of data (e.g., append it to the chatDiv)
    chatDiv.innerHTML += chunk;
  }
  writeTitle()
  writeKeywords()
}

function clipboard(inputField) {
  // Get the text field
  var copyText = document.getElementById(inputField);

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

   // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);

}

async function writeKeywords() {
  const chatDiv = document.getElementById('keywords');
  const systemSettings = 'You must write keywords/tags based on the user input. These keywords/tags must be in Arabic.';
  const userInput = document.getElementById('summarized').value;
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
    // Process the chunk of data (e.g., append it to the chatDiv)
    chatDiv.innerHTML += chunk;
  }
}

async function writeTitle() {
  const chatDiv = document.getElementById('title');
  const systemSettings = 'You are given a short text. Give this text a suitable title.';
  const userInput = document.getElementById('summarized').value;
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
    // Process the chunk of data (e.g., append it to the chatDiv)
    chatDiv.innerHTML += chunk;
  }
}

function generateImage() {
  const promptInput = document.getElementById('imagePrompt');
  const drawButton = document.getElementById('drawButton');
  const outputImage = document.getElementById('outputImage');
  drawButton.style.backgroundColor = '#99d1ff';
  drawButton.style.borderColor = '#99d1ff';
  drawButton.innerHTML = 'جاري التحميل...';

  const prompt = promptInput.value;

  // Call your API endpoint with the prompt JSON data
  fetch('/sd-api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt: prompt })
  })
    .then(response => response.json())
    .then(data => {
      // Assuming your API returns the image URL in the 'imageUrl' field of the response
      const imageUrl = data.imageUrl;
      outputImage.src = imageUrl;
      
      // Reset the button styles and text after the image is fetched and displayed
      drawButton.style.backgroundColor = '';
      drawButton.style.borderColor = '';
      drawButton.innerHTML = 'ارسم';
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      // Reset the button styles and text in case of an error
      drawButton.style.backgroundColor = '';
      drawButton.style.borderColor = '';
      drawButton.innerHTML = 'ارسم';
    });
}

function downloadImage() {
  // Get the reference to the outputImage element
  const outputImage = document.getElementById('outputImage');

  // Create a new anchor element to act as a download link
  const downloadLink = document.createElement('a');

  // Set the href attribute of the anchor to the image source
  downloadLink.href = outputImage.src;

  // Set the download attribute to specify the desired filename for the downloaded image
  downloadLink.download = 'downloaded_image.jpg';

  // Append the anchor element to the document
  document.body.appendChild(downloadLink);

  // Programmatically trigger the click event on the anchor element
  downloadLink.click();

  // Remove the anchor element from the document after the download
  document.body.removeChild(downloadLink);
}
