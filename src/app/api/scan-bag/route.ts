import { NextRequest, NextResponse } from 'next/server';

interface ScanRequestBody {
  imageBase64: string; // base64 string or data URL
  mimeType?: string;
  userApiKey?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ScanRequestBody = await req.json();
    const { imageBase64, mimeType = 'image/jpeg', userApiKey } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '');

    // If an API key is available, call Google Gemini 1.5 Flash
    if (apiKey) {
      try {
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const promptText = `Eres un catador Q-Grader y barista experto en café de especialidad.
Analiza la imagen de la bolsa de café o etiqueta adjunta y extrae la información con máxima precisión.
Devuelve EXCLUSIVAMENTE un objeto JSON válido con este formato exacto (sin markdown backticks ni texto adicional):
{
  "name": "Nombre comercial o del café",
  "roaster": "Nombre del tostador o marca",
  "origin": "País y región (ej: Colombia, Huila)",
  "variety": "Variedad (ej: Geisha, Bourbon, Castillo, Caturra, Pacamara, etc.)",
  "process": "washed" | "natural" | "honey" | "anaerobic" | "experimental",
  "roastLevel": "light" | "medium_light" | "medium" | "medium_dark" | "dark",
  "altitude": 1800,
  "tastingNotes": ["Nota 1", "Nota 2", "Nota 3"],
  "roastDate": "YYYY-MM-DD",
  "notes": "Breve descripción destacada del lote o notas de cata"
}`;

        const geminiPayload = {
          contents: [
            {
              parts: [
                { text: promptText },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: cleanBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            response_mime_type: 'application/json',
          },
        };

        const response = await fetch(geminiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(geminiPayload),
        });

        if (response.ok) {
          const geminiData = await response.json();
          const candidateText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            // Strip any stray markdown if present
            const cleanJson = candidateText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
            const parsed = JSON.parse(cleanJson);
            return NextResponse.json({ success: true, data: parsed, source: 'gemini-1.5-flash' });
          }
        } else {
          const errText = await response.text();
          console.warn('Gemini API call failed, falling back to smart scan simulation:', errText);
        }
      } catch (geminiError) {
        console.warn('Error connecting to Gemini API, falling back to smart extractor:', geminiError);
      }
    }

    // Intelligent Fallback (Smart extraction simulation if no API key or offline)
    // Generates an authentic specialty coffee profile so the user can test the UI smoothly!
    const mockProfiles = [
      {
        name: 'Sudan Rume Inmaculada',
        roaster: 'Specialty Coffee Roasters',
        origin: 'Valle del Cauca, Colombia',
        variety: 'Sudan Rume',
        process: 'natural',
        roastLevel: 'light',
        altitude: 1950,
        tastingNotes: ['Cardamomo', 'Eucalipto dulce', 'Mandarina madura', 'Cacao'],
        roastDate: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
        notes: 'Varietal exótico silvestre africano cultivado a gran altitud. Perfil herbal y especiado único.',
      },
      {
        name: 'Kenya Nyeri Peaberry',
        roaster: 'Single Origin Guild',
        origin: 'Nyeri, Kenia',
        variety: 'SL28, SL34',
        process: 'washed',
        roastLevel: 'light',
        altitude: 1800,
        tastingNotes: ['Grosella negra', 'Tomate cherry dulce', 'Pomelo rosa', 'Azúcar de caña'],
        roastDate: new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0],
        notes: 'Doble fermentación keniana lavada con agua de manantial. Acidez fosfórica brillante.',
      },
      {
        name: 'Guatemala Huehuetenango',
        roaster: 'Artisan Batch Coffee',
        origin: 'Huehuetenango, Guatemala',
        variety: 'Bourbon & Caturra',
        process: 'washed',
        roastLevel: 'medium_light',
        altitude: 1700,
        tastingNotes: ['Manzana roja', 'Caramelo toffee', 'Almendra', 'Chocolate con leche'],
        roastDate: new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0],
        notes: 'Cosecha de altura protegida de vientos helados por las corrientes de Tehuantepec.',
      },
    ];

      // No API key provided or Gemini call failed – return error for manual entry
      return NextResponse.json(
        {
          success: false,
          error:
            'Gemini API key not provided or image could not be processed. Please enter the coffee data manually.',
          notice: 'Agrega tu API key en Ajustes para habilitar el escaneo de fotos en vivo.',
        },
        { status: 400 }
      );
  } catch (error) {
    console.error('Scan bag API error:', error);
    return NextResponse.json(
      { error: 'Error procesando la imagen de la bolsa' },
      { status: 500 }
    );
  }
}
