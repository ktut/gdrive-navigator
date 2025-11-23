import { File } from '../types/files';

export function getMockData(): File[] {
    const length = Math.floor(Math.random() * 10) + 5; // Random length between 5-14
    const files: File[] = [];
    
    for (let i = 0; i < length; i++) {
        const fileType: "file" | "folder" = Math.random() > 0.5 ? 'file' : 'folder',
            minId = 1,
            maxId = 10000;
            // a real db would have a unique id for each file/folder, this will do for a demo
        files.push({
            id: Math.floor(Math.random() * (maxId - minId + 1)) + minId,
            filename: fileType === 'file' ? `file${i + 1}.txt` : `folder${i + 1}`,
            type: fileType,
            contents: null,
        });
    }
    
    return files;
}

