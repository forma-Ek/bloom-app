import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { error: "No se proporcionó la cadena de imagen" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "La API key de Gemini no está configurada" },
        { status: 500 }
      );
    }

    // Limpiar el encabezado Base64 (data:image/...;base64,)
    const base64Data = image.includes(",") ? image.split(",")[1] : image;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Analiza la etiqueta de esta bolsa de café de especialidad. Extrae únicamente un JSON válido con los campos: origin, producer, varietal, process, roastLevel, tastingNotes (array de cadenas). No incluyas bloques de código Markdown ni texto explicativo adicional.";

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
    const cleanJsonText = responseText.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanJsonText);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error detallado en /api/scan-bag:", error);
    return NextResponse.json(
      { error: error.message || "Error interno del servidor al procesar la imagen" },
      { status: 500 }
    );
  }
}
