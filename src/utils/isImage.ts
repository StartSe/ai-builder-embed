const imageFormats = ['png', 'jpg', 'jpeg', 'gif'];

export const isImage = (filename: string): boolean => {
  const ext = filename.split('.').reverse()[0];
  return imageFormats.includes(ext);
};
