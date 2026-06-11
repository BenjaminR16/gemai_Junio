import ollama from 'ollama';

async function procesarConOllama() {
    // El JSON base que quieres enviarle a tu agente local
    const jsonEntrada = {
        usuario: "Carlos",
        mensaje: "Hola, estoy bastante estresado porque no he podido terminar el reporte de ventas y mañana tengo que entregarlo sin falta. ¿Me ayudas?",
        fecha: "2026-06-11"
    };

    // Definimos el esquema JSON (Estándar JSON Schema requerido por Ollama)
    const esquemaJSON = {
        type: 'object',
        properties: {
            sentimientoPredominante: { type: 'string' },
            urgenciaAlta: { type: 'boolean' },
            tareasDetectadas: {
                type: 'array',
                items: { type: 'string' }
            }
        },
        required: ['sentimientoPredominante', 'urgenciaAlta', 'tareasDetectadas']
    };

    try {
        // Llamamos a Ollama local
        const response = await ollama.chat({
            model: 'llama3.1', // O el modelo que hayas bajado (ej. 'mistral')
            messages: [
                {
                    role: 'system',
                    content: 'Eres un asistente analítico. Debes extraer la información del mensaje del usuario y responder estrictamente siguiendo el esquema JSON provisto.'
                },
                {
                    role: 'user',
                    content: `Analiza esto: ${JSON.stringify(jsonEntrada)}`
                }
            ],
            // Aquí forzamos a Ollama a que la salida sea SÓLO el JSON estructurado
            format: esquemaJSON,
            options: {
                temperature: 0 // Temperatura en 0 para que sea ultra preciso y lógico
            }
        });

        // Parseamos el resultado
        const jsonResultado = JSON.parse(response.message.content);

        console.log("¡Ollama local respondió con éxito!");
        console.log(jsonResultado);

        if (jsonResultado.urgenciaAlta) {
            console.log("🚨 [LOCAL] Alerta: Ejecutando acción prioritaria para", jsonEntrada.usuario);
        }

    } catch (error) {
        console.error("Error procesando con Ollama:", error);
    }
}

procesarConOllama();