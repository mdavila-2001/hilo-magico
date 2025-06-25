interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function sendChatMessage(message: string): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }

    const data = await response.json();
    return data.reply || 'Lo siento, no pude procesar tu mensaje.';
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
    return 'Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.';
  }
}

export function createMessageElement(message: string, isUser: boolean): HTMLElement {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user' : 'assistant'}-message`;
  messageDiv.textContent = message;
  return messageDiv;
}

export function createTypingIndicator(): HTMLElement {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message assistant-message typing-indicator';
  typingDiv.innerHTML = '<span></span><span></span><span></span>';
  return typingDiv;
}
