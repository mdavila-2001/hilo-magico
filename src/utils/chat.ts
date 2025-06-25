// Tipos para el chat
type MessageRole = 'user' | 'assistant' | 'system';

interface Message {
  role: MessageRole;
  content: string;
}

// Hacer las funciones disponibles globalmente
declare global {
  // Función para enviar mensaje al servidor
  function sendChatMessage(message: string): Promise<string>;
  
  // Función para crear un elemento de mensaje
  function createMessageElement(message: string, isUser: boolean): HTMLElement;
  
  // Función para crear un indicador de escritura
  function createTypingIndicator(): HTMLElement;
}

// Implementación de las funciones

// Función para enviar mensaje al servidor
window.sendChatMessage = async function(message: string): Promise<string> {
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
};

// Función para crear un elemento de mensaje
window.createMessageElement = function(message: string, isUser: boolean): HTMLElement {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user' : 'assistant'}-message`;
  messageDiv.textContent = message;
  return messageDiv;
};

// Función para crear un indicador de escritura
window.createTypingIndicator = function(): HTMLElement {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message assistant-message typing-indicator';
  typingDiv.innerHTML = '<span></span><span></span><span></span>';
  return typingDiv;
};
