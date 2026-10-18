import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Soporta múltiples nombres de propiedades enviadas desde el cliente
    const rawImage = body.image || body.file || body.imageData || body.base64;

    if (!rawImage) {
      return NextResponse.json(
        { error: "No se recibió ninguna imagen válida en el body de la petición." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Falta configurar GEMINI_API_KEY en las variables de entorno." },
        { status: 500 }
      );
    }

    // Limpia encabezados data:image/...;base64, si existen
    const base64Clean = rawImage.includes(",") ? rawImage.split(",")[1] : rawImage;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt =
      "Analiza la etiqueta de esta bolsa de café de especialidad. Extrae en formato JSON válido los campos: origin, producer, varietal, process, roastLevel, tastingNotes (array de cadenas). Devuelve únicamente el objeto JSON sin bloques de Markdown ni texto explicativo.";

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Clean,
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
    return NextResponse.json(
      { error: error.message || "Error al procesar la imagen" },
      { status: 500 }
    );
  }
}