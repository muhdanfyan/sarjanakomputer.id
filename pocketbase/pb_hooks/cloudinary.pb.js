// pb_hooks/cloudinary.pb.js
// Event hooks to upload local file field to Cloudinary automatically on save.

const CLOUDINARY_CLOUD_NAME = 'ddhgtgsed';
const CLOUDINARY_PRESET = 'skomindo_preset';

function uploadFileToCloudinary(filePath, filename) {
  let bytes;
  try {
    bytes = $os.readFile(filePath);
  } catch (err) {
    console.log("Error reading file " + filePath + ": " + err);
    return null;
  }

  // Base64 encoding
  const base64Data = base64Encode(bytes);
  
  let mimeType = 'image/jpeg';
  if (filename.toLowerCase().endsWith('.png')) mimeType = 'image/png';
  else if (filename.toLowerCase().endsWith('.webp')) mimeType = 'image/webp';
  else if (filename.toLowerCase().endsWith('.gif')) mimeType = 'image/gif';
  else if (filename.toLowerCase().endsWith('.svg')) mimeType = 'image/svg+xml';

  const dataUri = 'data:' + mimeType + ';base64,' + base64Data;

  try {
    const res = $http.send({
      url: 'https://api.cloudinary.com/v1_1/' + CLOUDINARY_CLOUD_NAME + '/image/upload',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file: dataUri,
        upload_preset: CLOUDINARY_PRESET
      })
    });

    if (res.statusCode !== 200) {
      console.log("Cloudinary upload failed with status " + res.statusCode + ": " + res.raw);
      return null;
    }

    const data = JSON.parse(res.raw);
    return data.secure_url;
  } catch (err) {
    console.log("Error sending request to Cloudinary: " + err);
    return null;
  }
}

// Base64 encoder in pure JS
function base64Encode(bytes) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let i = 0;
  const len = bytes.length;
  
  while (i < len) {
    const b1 = bytes[i++] & 0xff;
    if (i === len) {
      result += chars.charAt(b1 >> 2);
      result += chars.charAt((b1 & 0x3) << 4);
      result += '==';
      break;
    }
    const b2 = bytes[i++] & 0xff;
    if (i === len) {
      result += chars.charAt(b1 >> 2);
      result += chars.charAt(((b1 & 0x3) << 4) | ((b2 & 0xf0) >> 4));
      result += chars.charAt((b2 & 0xf) << 2);
      result += '=';
      break;
    }
    const b3 = bytes[i++] & 0xff;
    result += chars.charAt(b1 >> 2);
    result += chars.charAt(((b1 & 0x3) << 4) | ((b2 & 0xf0) >> 4));
    result += chars.charAt(((b2 & 0xf) << 2) | ((b3 & 0xc0) >> 6));
    result += chars.charAt(b3 & 0x3f);
  }
  return result;
}

function processRecord(record) {
  const imageFile = record.getString('image');
  // If there's a new image file, but imageUrl is not set to a Cloudinary URL for this file
  if (imageFile && !record.getString('imageUrl').startsWith('https://res.cloudinary.com')) {
    const collectionId = record.collection().id;
    const recordId = record.id;
    const filePath = '/pb_data/storage/' + collectionId + '/' + recordId + '/' + imageFile;

    console.log("Processing upload to Cloudinary: " + filePath);
    const cloudinaryUrl = uploadFileToCloudinary(filePath, imageFile);

    if (cloudinaryUrl) {
      console.log("Uploaded successfully to Cloudinary: " + cloudinaryUrl);
      
      // Update fields
      record.set('imageUrl', cloudinaryUrl);
      record.set('image', ''); // Clear the file field to save server disk space
      
      // Save record internally
      $app.save(record);

      // Delete file from local disk storage
      try {
        $os.remove(filePath);
      } catch (err) {
        console.log("Error cleaning up file: " + err);
      }
    }
  }
}

onRecordAfterCreateRequest((e) => {
  processRecord(e.record);
}, 'news', 'courses');

onRecordAfterUpdateRequest((e) => {
  processRecord(e.record);
}, 'news', 'courses');
