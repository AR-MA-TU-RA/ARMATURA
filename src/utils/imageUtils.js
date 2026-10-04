/**
 * Utility functions for client-side image compression and processing
 */

export const compressImage = (file, { maxWidth = 600, maxHeight = 600, quality = 0.82 } = {}) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file selected'));
    }

    if (!file.type || !file.type.startsWith('image/')) {
      return reject(new Error('Fișierul selectat nu este o imagine validă (JPG, PNG, WebP).'));
    }

    // Limit input file size to 15MB before processing
    if (file.size > 15 * 1024 * 1024) {
      return reject(new Error('Imaginea este prea mare. Dimensiunea maximă permisă este 15MB.'));
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while preserving aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(event.target.result); // Fallback to raw base64 if canvas is unavailable
        }

        // Draw image smoothly
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to lightweight compressed JPEG Base64
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };

      img.onerror = () => {
        reject(new Error('Eroare la procesarea imaginii. Încercați cu o altă fotografie.'));
      };

      img.src = event.target.result;
    };

    reader.onerror = () => {
      reject(new Error('Eroare la citirea fișierului de pe dispozitiv.'));
    };

    reader.readAsDataURL(file);
  });
};
