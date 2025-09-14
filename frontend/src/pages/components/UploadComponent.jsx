import { useRef, useState } from "react";
import { uploadFile } from "../../services/FileService";
import { Upload } from "lucide-react";

const UploadComponent = ({ onSuccess }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploadedFile = await uploadFile(file, setProgress);

      if (onSuccess) onSuccess(uploadedFile); // refresh parent
    } catch (err) {
      alert("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        onClick={() => fileInputRef.current.click()}
        disabled={uploading}
        className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition shadow-md"
      >
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 mb-2 text-blue-400">
          <Upload />
        </div>
        <span className="text-sm text-gray-200 font-medium">
          {uploading ? `Uploading ${progress}%` : "Upload"}
        </span>
      </button>
    </div>
  );
};

export default UploadComponent;
