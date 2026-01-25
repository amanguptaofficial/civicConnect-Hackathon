import { useState, useRef } from 'react';
import { IoCloudUploadOutline, IoClose, IoImageOutline } from 'react-icons/io5';
import { uploadService } from '../../services/upload.service';
import LoadingSpinner from './LoadingSpinner';

const ImageUpload = ({ onUploadComplete, maxFiles = 5, existingImages = [], folder = 'proposals' }) => {
  const [images, setImages] = useState(existingImages || []);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > maxFiles) {
      alert(`Maximum ${maxFiles} images allowed`);
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);

    try {
      setUploading(true);
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });
      formData.append('folder', folder);

      const response = await uploadService.uploadMultiple(formData);
      const newImages = response.data.urls.map((item) => item.url);
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      setPreviews([]);
      if (onUploadComplete) {
        onUploadComplete(updatedImages);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images');
      setPreviews([]);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    if (onUploadComplete) {
      onUploadComplete(updatedImages);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`Upload ${index + 1}`}
              className="w-24 h-24 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <IoClose className="w-4 h-4" />
            </button>
          </div>
        ))}
        {images.length < maxFiles && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
          >
            {uploading ? (
              <LoadingSpinner size="small" />
            ) : (
              <>
                <IoCloudUploadOutline className="w-8 h-8 text-gray-400" />
                <span className="text-xs text-gray-500 mt-1">Upload</span>
              </>
            )}
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <p className="text-xs text-gray-500">
        {images.length}/{maxFiles} images uploaded
      </p>
    </div>
  );
};

export default ImageUpload;
