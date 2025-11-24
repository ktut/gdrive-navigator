export interface File {
    id: string,
    filename: string,
    type: "file" | "folder",
    contents: File[] | null,
}