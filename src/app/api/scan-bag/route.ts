import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No se proporcionó imagen" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Falta la API Key de Gemini en las variables de entorno" }, { status: 500 });
    }

    // Limpiar el encabezado Base64 de FileReader
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Analiza la etiqueta de esta bolsa de café de especialidad. Extrae en formato JSON válido los campos: origin, producer, varietal, process, roastLevel, tastingNotes (array de strings). Solo devuelve JSON puro.";

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanJson);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error en /api/scan-bag:", error);
    return NextResponse.json({ error: error.message || "Error al procesar la imagen" }, { status: 400 });
  }
}
