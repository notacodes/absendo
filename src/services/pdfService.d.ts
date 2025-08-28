interface formData {
    date: string,
    reason:string,
    fileName: string,
    is_excused: boolean,
    isFullNameEnabled: boolean,
    isFullSubjectEnabled: boolean,
    isDoNotSaveEnabled: boolean,
}
export declare function generatePdf(userData, formData: formData): Promise<Blob>;
