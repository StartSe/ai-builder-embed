import { UploadFile } from '@solid-primitives/upload';

export type IncomingInput = {
  files: UploadFile;
};

export type MessageRequest = {
  extractUrl?: string;
  body: IncomingInput | any;
};

export const sendFileToTextExtraction = async ({ extractUrl = 'http://localhost:3000', body }: MessageRequest) => {
  const formData = new FormData();
  formData.append('files', body.files.file, body.files.name);
  formData.append('question', '');
  const response = await fetch(extractUrl, {
    method: 'POST',
    body: formData,
  });
  return response.json();
};
