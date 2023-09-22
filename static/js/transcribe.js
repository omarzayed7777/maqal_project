async function transcribeFunction() {
    const transcribeButton = document.querySelector('#transcribeAudio');
    const textarea = document.getElementById('toSummarize');
    const fileInput = document.getElementById('file');
    transcribeButton.innerHTML = 'جاري التفريغ...'
    transcribeButton.style.background = '#99d1ff';
    transcribeButton.style.borderColor = '#99d1ff';

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    const response = await fetch('/transcribe-api', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const transcription = await response.text();
    textarea.value = transcription;

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