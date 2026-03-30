const promptInput = document.getElementById('prompt');
const sendButton = document.getElementById('send-btn');
const statusEl = document.getElementById('status');
const answerEl = document.getElementById('answer');
const promptTokensEl = document.getElementById('promptTokens');
const completionTokensEl = document.getElementById('completionTokens');
const totalTokensEl = document.getElementById('totalTokens');

sendButton.addEventListener('click', async () => {
  const prompt = promptInput.value.trim();

  statusEl.textContent = 'Sending...';
  sendButton.disabled = true;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    answerEl.textContent = data.answer;
    promptTokensEl.textContent = String(data.usage.prompt_tokens);
    completionTokensEl.textContent = String(data.usage.completion_tokens);
    totalTokensEl.textContent = String(data.usage.total_tokens);
    statusEl.textContent = 'Done';
  } catch (error) {
    statusEl.textContent = error instanceof Error ? error.message : 'Unknown error';
  } finally {
    sendButton.disabled = false;
  }
});
