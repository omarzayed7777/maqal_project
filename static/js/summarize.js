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