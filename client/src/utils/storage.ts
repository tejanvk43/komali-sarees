const API_BASE = "/api/storage";

export interface UploadProgress {
    progress: number;
    downloadURL?: string;
    error?: string;
    state: 'running' | 'paused' | 'success' | 'error' | 'canceled';
}

export const uploadFileWithProgress = (
    file: File,
    path: string,
    onProgress: (status: UploadProgress) => void
) => {
    // Note: Fetch doesn't natively support progress tracking like XHR or Firebase SDK
    // For a simple migration, we'll simulate progress or just trigger on success
    onProgress({ progress: 10, state: 'running' });

    fetch(`${API_BASE}?path=${encodeURIComponent(path)}`, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file
    })
        .then(async (res) => {
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            onProgress({ progress: 100, downloadURL: data.url, state: 'success' });
        })
        .catch((err) => {
            onProgress({ progress: 0, error: err.message, state: 'error' });
        });

    return { cancel: () => { } }; // Dummy task for compatibility
};

export const deleteFileFromUrl = async (url: string) => {
    let path = "";
    if (url.includes("?path=")) {
        const urlObj = new URL(url, window.location.origin);
        path = urlObj.searchParams.get("path") || "";
    } else {
        // Fallback for old URL formats if any
        path = url.split('/').pop() || "";
        if (!path.startsWith("products/")) path = `products/${path}`;
    }

    if (!path) throw new Error("Could not extract path from URL");

    const response = await fetch(`${API_BASE}?path=${encodeURIComponent(path)}`, {
        method: "DELETE"
    });
    if (!response.ok) throw new Error("Failed to delete file");
};
