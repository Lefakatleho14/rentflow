import { useRef, useState } from "react";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { uploadPropertyImage, deletePropertyImage } from "../services/propertyService";

export default function ImageUploader({ landlordId, propertyId, images, onImagesChange }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        const uploaded = await uploadPropertyImage(landlordId, propertyId, file);
        onImagesChange([...images, uploaded]);
      }
      toast.success(`${files.length} image(s) uploaded`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = async (image) => {
    try {
      await deletePropertyImage(image.id, image.storage_path);
      onImagesChange(images.filter((img) => img.id !== image.id));
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-900 mb-2">
        Property images
      </label>

      <div className="grid grid-cols-4 gap-3 mb-3">
        {images.map((image) => (
          <div key={image.id} className="relative aspect-square rounded-md overflow-hidden group">
            <img src={image.publicUrl} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(image)}
              className="absolute top-1 right-1 bg-slate-900/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <XMarkIcon className="h-3 w-3" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="aspect-square rounded-md border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-slate-light hover:border-emerald hover:text-emerald transition-colors disabled:opacity-50"
        >
          <PhotoIcon className="h-6 w-6" />
          <span className="text-xs">{uploading ? "Uploading..." : "Add"}</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}