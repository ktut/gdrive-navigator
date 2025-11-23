import { File } from '../types/files';

export function getMockData(): File[] {
    const length = 6; // Like the provided test data, this is a fixed length
    const files: File[] = [];
    
    for (let i = 0; i < length; i++) {
        const minId = 1,
            maxId = 10000;
            // a real db would have a unique id for each file/folder, this will do for a demo
        files.push({
            id: Math.floor(Math.random() * (maxId - minId + 1)) + minId,
            filename: i < 4 ? `file${i + 1}.txt` : `folder${i - 3}`, // 5 files, 6 folders
            type: i < 4 ? 'file' : 'folder',
            contents: null,
        });
    }
    
    return files;
}

