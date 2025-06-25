export async function post({ request }) {
  try {
    // Obtener el mensaje del cuerpo de la solicitud
    const { message } = await request.json();

    // Validar que se recibió un mensaje
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'No se proporcionó ningún mensaje' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Enviar el mensaje a la API de OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente útil que responde preguntas sobre costura y confección.'
          },
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    // Manejar la respuesta de la API
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error de la API de OpenRouter:', errorData);
      throw new Error('Error al procesar la solicitud');
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || 'No se pudo generar una respuesta.';

    // Devolver la respuesta al cliente
    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error en el endpoint /api/chat:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
