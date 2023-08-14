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