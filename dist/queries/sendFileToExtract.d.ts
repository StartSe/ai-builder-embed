import { UploadFile } from '@solid-primitives/upload';
export type IncomingInput = {
    files: UploadFile;
};
export type MessageRequest = {
    extractUrl?: string;
    body: IncomingInput | any;
};
export declare const sendFileToTextExtraction: ({ extractUrl, body }: MessageRequest) => Promise<any>;
//# sourceMappingURL=sendFileToExtract.d.ts.map