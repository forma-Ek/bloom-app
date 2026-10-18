import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
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
        { error: "Falta configurar GEMINI_API_KEY en Vercel." },
        { status: 500 }
      );
    }

    const base64Clean = rawImage.includes(",") ? rawImage.split(",")[1] : rawImage;

    const genAI = new GoogleGenerativeAI(apiKey);

    // Definición de esquema para forzar salida JSON estructurada
    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        name: { type: SchemaType.STRING },
        roaster: { type: SchemaType.STRING },
        origin: { type: SchemaType.STRING },
        variety: { type: SchemaType.STRING },
        process: { type: SchemaType.STRING },
        roastLevel: { type: SchemaType.STRING },
        altitude: { type: SchemaType.NUMBER },
        roastDate: { type: SchemaType.STRING },
        tastingNotes: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        notes: { type: SchemaType.STRING },
      },
      required: ["name"],
    };

    // Usar gemini-1.5-flash-latest para asegurar compatibilidad de versión
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const prompt = "Analiza la etiqueta de esta bolsa de café de especialidad y extrae toda la información visible.";

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Clean,
          mimeType: body.mimeType || "image/jpeg",
        },
      },
    ]);

    const data = JSON.parse(result.response.text());
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error en /api/scan-bag:", error);
    return NextResponse.json(
      { error: error.message || "Error al procesar la imagen con Gemini." },
      { status: 500 }
    );
  }
}