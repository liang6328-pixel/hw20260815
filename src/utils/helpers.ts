export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function cn(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(c => typeof c === 'string').join(' ');
}

export function truncate(text: string, length: number): string {
  return text.length > length ? text.substring(0, length) + '...' : text;
}

export function getCurrentDateTime(): string {
  return new Date().toLocaleString();
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function isImageFile(file: File): boolean {
  const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return imageTypes.includes(file.type);
}

export function isPDFFile(file: File): boolean {
  return file.type === 'application/pdf';
}

export function base64ToBlob(base64: string, type: string = 'image/jpeg'): Blob {
  const binaryString = atob(base64.split(',')[1] || base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type });
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
