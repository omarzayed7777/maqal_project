const button = document.querySelector('.btn-primary');
const textarea = document.getElementById('toSummarize');
const fileInput = document.getElementById('file');

button.addEventListener('click', async function () {
    button.innerHTML = 'جاري التفريغ...'
    button.style.background = '#d4e9ff';
    button.style.borderColor = '#d4e9ff';

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
    button.innerHTML = 'اكتب'
    button.style.background = '';
    button.style.borderColor = '';
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
  }