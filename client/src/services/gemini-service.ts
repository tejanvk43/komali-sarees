/**
 * Service to handle Gemini AI Try-On logic
 * Refactored to use models/gemini-pro with API version v1 for guaranteed compatibility
 */

// Configuration - Refactored into constants to avoid hardcoding
const GEMINI_CONFIG = {
    API_KEY: import.meta.env.VITE_GEMINI_API_KEY || "",
    API_VERSION: "v1",
    MODEL_NAME: import.meta.env.VITE_GEMINI_MODEL || "gemini-3-pro-image",
    BASE_URL: "https://generativelanguage.googleapis.com"
};

/**
 * Generates an AI Virtual Try-On result using the Gemini API.
 * 
 * @param userImageBase64 - The full-body photo of the person in base64.
 * @param sareeImageUrl - The URL of the selected saree image.
 * @param palluBase64 - The detailed photo of the saree's pallu in base64.
 * @returns A string containing the AI's response.
 */
export async function generateAITryOn(
    userImageBase64: string,
    sareeImageUrl: string,
    palluBase64: string
): Promise<string> {
    const { API_KEY, API_VERSION, MODEL_NAME, BASE_URL } = GEMINI_CONFIG;

    if (!API_KEY) {
        throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env.local file.");
    }

    // Construct valid API endpoint
    const API_URL = `${BASE_URL}/${API_VERSION}/models/${MODEL_NAME}:generateContent`;

    // Remove base64 header prefixes if present
    const cleanBase64 = (base64: string): string => base64.split(',')[1] || base64;

    const payload = {
        contents: [{
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
                        data: cleanBase64(palluBase64)
                    }
                }
            ]
        }]
    };

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMsg = errorData.error?.message || "Unknown API Error";

            // Defensive Logging: logs status, model, and version
            console.error(`[Gemini API Error]
                HTTP Status: ${response.status}
                Model: ${MODEL_NAME}
                API Version: ${API_VERSION}
                Message: ${errorMsg}`);

            throw new Error(`Gemini API Error (${response.status}): ${errorMsg}`);
        }

        const data = await response.json();
        const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!resultText) {
            throw new Error("Gemini returned an empty response candidate.");
        }

        return resultText;
    } catch (error: any) {
        // Log runtime failure with model/version context
        console.error(`[Gemini AI Runtime Failure]
            Target Model: ${MODEL_NAME}
            Target API Version: ${API_VERSION}
            Error: ${error.message}`);
        throw error;
    }
}
