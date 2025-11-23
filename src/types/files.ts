export interface File {
    id: number,
    filename: string,
    type: "file" | "folder",
    contents: File[] | null,
}