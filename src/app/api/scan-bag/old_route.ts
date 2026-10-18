import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Fallback para aceptar 'image', 'file' o 'imageData'
    const image = body.image || body.file || body.imageData || body.base64;

    if (!image) {
      return NextResponse.json(
        { error: "No se recibió ninguna imagen en el cuerpo de la petición. Verifica el cliente." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "La API key de Gemini no está configurada en las variables de entorno." },
        { status: 500 }
      );
    }

    // Extraer solo la cadena base64 limpia
    const base64Data = image.includes(",") ? image.split(",")[1] : image;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Analiza la etiqueta de esta bolsa de café de especialidad. Extrae únicamente un JSON válido con los campos: origin, producer, varietal, process, roastLevel, tastingNotes (array de cadenas). No incluyas marcas de formato Markdown ni texto extra.";

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
    console.error("Error en /api/scan-bag:", error);
    return NextResponse.json(
      { error: error.message || "Error al procesar la imagen con Gemini" },
      { status: 500 }
    );
  }
}
