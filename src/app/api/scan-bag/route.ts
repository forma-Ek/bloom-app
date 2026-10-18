import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawImage = body.image || body.file || body.imageData || body.base64;

    if (!rawImage) {
      return NextResponse.json(
        { error: "No se recibió ninguna imagen en la petición." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Falta configurar GEMINI_API_KEY en las variables de entorno de Vercel." },
        { status: 500 }
      );
    }

    const base64Clean = rawImage.includes(",") ? rawImage.split(",")[1] : rawImage;

    const genAI = new GoogleGenerativeAI(apiKey);

    // Modelos actualizados según recomendación de la API de Google
    const modelCandidates = [
      "gemini-3.5-flash-lite",
      "gemini-3.5-flash",
      "gemini-1.5-flash",
      "gemini-1.5-flash-8b",
    ];

    let result = null;
    let lastError = null;

    const prompt = `Analiza la etiqueta de esta bolsa de café de especialidad.
Extrae la información y devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta:
{
  "name": "Nombre del café o finca",
  "roaster": "Nombre del tostador",
  "origin": "País y región",
  "variety": "Variedad botánica (ej: Geisha, Bourbon)",
  "process": "washed | natural | honey | anaerobic | experimental",
  "roastLevel": "light | medium_light | medium | medium_dark | dark",
  "altitude": 1800,
  "roastDate": "YYYY-MM-DD",
  "tastingNotes": ["Nota 1", "Nota 2"],
  "notes": "Notas adicionales si las hay"
}
No incluyas marcas de formato Markdown (como \`\`\`json), solo el JSON plano.`;

    for (const modelName of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: base64Clean,
              mimeType: body.mimeType || "image/jpeg",
            },
          },
        ]);
        if (result) break;
      } catch (err) {
        lastError = err;
        console.warn(`Falló el modelo ${modelName}, probando el siguiente candidato...`);
      }
    }

    if (!result) {
      throw lastError || new Error("No se pudo conectar con ningún modelo de Gemini disponible.");
    }

    const responseText = result.response.text();
    const cleanJsonText = responseText.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanJsonText);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error en /api/scan-bag:", error);
    return NextResponse.json(
      { error: error.message || "Error al procesar la imagen con Gemini." },
      { status: 500 }
    );
  }
}