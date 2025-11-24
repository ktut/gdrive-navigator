// Google Drive-like schema: { id, name, mimeType }
export interface DriveFileLike {
    id: string;
    name: string;
    mimeType: string;
}

// Absolute overkill for generating a random string for unique IDs
function generateRandomId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export function getMockData(): DriveFileLike[] {
    const length = 6; // Like the provided test data, this is a fixed length
    const files: DriveFileLike[] = [];
    
    for (let i = 0; i < length; i++) {
        const id = generateRandomId();
        const isFolder = i >= 4;
        files.push({
            id: id,
            name: isFolder ? `folder${i - 3}` : `file${i + 1}.txt`, // 4 files, 2 folders
            mimeType: isFolder ? 'application/vnd.google-apps.folder' : 'text/plain',
        });
    }
    
    return files;
}

