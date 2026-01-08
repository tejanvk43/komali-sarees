/**
 * Service to handle Gemini AI Try-On logic
 * Using fetch directly to avoid installation issues with the SDK
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function generateAITryOn(userImageBase64: string, sareeImageUrl: string, palluImageBase64: string) {
    if (!GEMINI_API_KEY) {
        throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env.local file.");
    }

    // Remove the data:image/xxx;base64, prefix if present
    const cleanBase64 = (base64: string) => base64.split(',')[1] || base64;

    const payload = {
        contents: [
            {
                parts: [
                    {
                        text: `You are a high-end fashion AI. I am providing three images:
1. A full-body photo of a person.
2. A saree they want to try on (available at ${sareeImageUrl}).
3. A detailed photo of the saree's pallu.

Generate a realistic, high-quality image of this person wearing the selected saree with the pallu draped elegantly over their shoulder. The skin tone, lighting, and body shape should remain consistent with the original photo. The saree's fabric texture and color must accurately match the provided saree and pallu images.

Return ONLY the generated image data in base64 format. If you cannot generate the image directly, describe the result in extreme detail so it can be used for rendering.`
                    },
                    {
                        inline_data: {
                            mime_type: "image/jpeg",
                            data: cleanBase64(userImageBase64)
                        }
                    },
                    {
                        inline_data: {
                            mime_type: "image/jpeg",
                            data: cleanBase64(palluImageBase64)
                        }
                    }
                ]
            }
        ]
    };

    try {
        const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Failed to communicate with Gemini AI");
        }

        const data = await response.json();

        // Note: Standard Gemini 1.5 returns text, not images. 
        // If the user has access to Imagen via Gemini, the response format might differ.
        // For now, we extract the text response.
        const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!resultText) {
            throw new Error("Gemini returned an empty response.");
        }

        return resultText;
    } catch (error: any) {
        console.error("Gemini AI Error:", error);
        throw error;
    }
}
