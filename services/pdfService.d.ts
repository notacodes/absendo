interface formData {
    date: string,
    reason:string,
    fileName: string,
    is_excused: boolean,
    isFullNameEnabled: boolean,
    isFullSubjectEnabled: boolean,
}
export declare function generatePdf(userId: string, formData: formData): Promise<Blob>;
