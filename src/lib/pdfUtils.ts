export function forceDownloadBase64Pdf(urlOrData: string, filename: string) {
  if (!urlOrData) return;

  const safeFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

  if (urlOrData.startsWith('data:') || urlOrData.includes('base64')) {
    try {
      const arr = urlOrData.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
      const bstr = atob(arr[1] || '');
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = safeFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
      return;
    } catch (e) {
      console.warn('Blob base64 download fallback triggered:', e);
    }
  }

  // Standard or fallback URL download
  const a = document.createElement('a');
  a.href = urlOrData;
  a.download = safeFilename;
  if (!urlOrData.startsWith('data:') && !urlOrData.startsWith('blob:')) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
