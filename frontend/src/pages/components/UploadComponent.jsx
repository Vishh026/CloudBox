// components/UploadComponent.jsx
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile } from "../../store/actions/FileActions";

const UploadComponent = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { files, loading, error } = useSelector((state) => state.files);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    if (data.file && data.file[0]) {
      const fileToUpload = data.file[0];
      dispatch(uploadFile(fileToUpload)); // send file to backend
      reset(); // reset form
      if (onSuccess) onSuccess(fileToUpload); 
      if (onClose) onClose(); 
    }
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-md w-80">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Hidden file input */}
        <input type="file" {...register("file")} id="fileInput" className="hidden" />

        {/* Button to open local file manager */}
        <label
          htmlFor="fileInput"
          className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition mb-2"
        >
          Choose File
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <h3 className="mt-4 font-medium">Uploaded Files:</h3>
      <ul className="max-h-40 overflow-y-auto">
        {files.map((file) => (
          <li key={file._id} className="text-gray-700 text-sm">
            {file.fileName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadComponent;
