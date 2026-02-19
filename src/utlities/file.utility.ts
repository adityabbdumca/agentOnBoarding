export const formatFileSize = (sizeInBytes: number): string => {
  if (!sizeInBytes) return "Unknown size";
  const KB = sizeInBytes / 1024;
  const MB = KB / 1024;
  return MB >= 1 ? `${MB.toFixed(1)} MB` : `${KB.toFixed(1)} KB`;
};
