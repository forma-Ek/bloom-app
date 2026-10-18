import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawImage = body.image || body.file || body.imageData || body.base64;

    if (!rawImage) {
      return NextResponse.json(
        { error: "No se recibió ninguna imagen en el cuerpo de la petición." },
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

    // Extraer limpia la cadena Base64
    const base64Clean = rawImage.includes(",") ? rawImage.split(",")[1] : rawImage;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt =
      "Analiza la etiqueta de esta bolsa de café de especialidad. Extrae en formato JSON únicamente los siguientes campos: name, roaster, origin, variety, process, roastLevel, altitude, roastDate, tastingNotes (array de cadenas), notes. Devuelve SOLO el objeto JSON sin formato markdown.";

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Clean,
          mimeType: body.mimeType || "image/jpeg",
        },
      },
    ]);

    const responseText = result.response.text();
    // Limpieza agresiva de bloques de código Markdown
    const cleanJson = responseText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const data = JSON.parse(cleanJson);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error capturado en /api/scan-bag:", error);
    return NextResponse.json(
      { error: error.message || "Error interno del servidor al procesar la imagen con Gemini." },
      { status: 500 }
    );
  }
}