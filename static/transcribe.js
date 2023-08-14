const transcribeButton = document.querySelector('#transcribeAudio');
const textarea = document.getElementById('toSummarize');
const fileInput = document.getElementById('file');

transcribeButton.addEventListener('click', async function () {
    transcribeButton.innerHTML = 'جاري التفريغ...'
    transcribeButton.style.background = '#d4e9ff';
    transcribeButton.style.borderColor = '#d4e9ff';

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
  });

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
    chatDiv.innerHTML = '';
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = new TextDecoder().decode(value);
      // Process the chunk of data (e.g., append it to the chatDiv)
      chatDiv.innerHTML += chunk;
    }
    generateImage()
  }

  function generateImage() {
    const promptInput = document.getElementById('keywords');
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
        drawButton.innerHTML = 'إعادة رسم';
      });
  }