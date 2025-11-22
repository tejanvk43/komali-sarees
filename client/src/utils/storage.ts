import { storage } from "@/firebase/client";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

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
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress({ progress, state: snapshot.state });
        },
        (error) => {
            onProgress({ progress: 0, error: error.message, state: 'error' });
        },
        async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            onProgress({ progress: 100, downloadURL, state: 'success' });
        }
    );

    return uploadTask; // Returns task to allow canceling
};

export const deleteFileFromUrl = async (url: string) => {
    try {
        const storageRef = ref(storage, url);
        await deleteObject(storageRef);
    } catch (error) {
        console.error("Error deleting file:", error);
        throw error;
    }
};
