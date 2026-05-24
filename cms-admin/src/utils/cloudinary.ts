export const uploadToCloudinary = async (files: File[]) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dzhtvwxx1'; // placeholder fallback if missing
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset'; // placeholder fallback
  
  if (!cloudName || !uploadPreset) {
    alert('Cloudinary credentials are not configured.');
    return [];
  }

  const urls = [];
  for (const file of files) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        urls.push(data.secure_url);
      } else {
        alert('Upload failed: ' + (data.error?.message || 'Unknown error'));
      }
    } catch (e) {
      console.error('Cloudinary upload error', e);
      alert('Network error uploading to Cloudinary');
    }
  }
  return urls;
};
