function toggleView() {
    const chatView = document.querySelector('#chatView')
    if (chatView.style.display == 'block') {
        chatView.style.display = 'none';
    } else {
        chatView.style.display = 'block';
    }
}

async function sendMessage() {
    const userInput = document.getElementById('humanInput').value;

    const newMessage = document.createElement("div");
    newMessage.classList.add('humanMessage')
    newMessage.innerHTML = userInput;

    const messageList = document.getElementById('messageList');
    messageList.appendChild(newMessage);

    const replyMessage = document.createElement("div");
    replyMessage.classList.add('botMessage')
    messageList.appendChild(replyMessage);
    
    const systemSettings = 'You are a chat bot. Please reply in Arabic.';

    document.getElementById('humanInput').value = '';
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
    userInput.innerHTML = '';
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = new TextDecoder().decode(value);
      // Process the chunk of data (e.g., append it to the chatDiv)
      replyMessage.innerHTML += chunk;
    }
  }
function fetchLangchain() {
  const userInput = document.getElementById('humanInput').value;

  const newMessage = document.createElement("div");
  newMessage.classList.add('humanMessage')
  newMessage.innerHTML = userInput;

  const messageList = document.getElementById('messageList');
  messageList.appendChild(newMessage);

  const replyMessage = document.createElement("div");
  replyMessage.innerHTML = 'نفكر...'
  replyMessage.classList.add('botMessage')
  messageList.appendChild(replyMessage);
  
  document.getElementById('humanInput').value = '';
  
  const endpoint = '/langchain-gpt';  // Update this with your actual Flask endpoint
  const data = { user_input: userInput };

  fetch(endpoint, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  })
  .then(response => response.text())  // Note: Using .text() instead of .json()
  .then(output => {
      replyMessage.innerHTML = output;
  })
  .catch(error => {
      console.error("Error:", error);
  });
}
