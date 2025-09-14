import { useState } from "react";
import { Link, ChevronDown } from "lucide-react";
import { getCopyLink,  shareWithPeople } from "../../services/FileService";

const ShareModal = ({ file, onClose }) => {
  const [step, setStep] = useState("main");
  const [email, setEmail] = useState("");
  const [access, setAccess] = useState("can edit");

  if (!file) return null;

  const handleAddPeople = async () => {
    if (!email) return alert("Enter email");

    try {
      await shareWithPeople(file._id, email, access === "can edit" ? "write" : "read");
      alert("Collaborator added!");
      setEmail("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add collaborator");
    }
  };

  const handleCopyLink = async () => {
    try {
      const copyLink = await getCopyLink(file._id);
      if (copyLink) {
        navigator.clipboard.writeText(copyLink);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to get copy link");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-xl shadow-xl w-[420px] p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white font-semibold text-lg">
            {step === "main" ? `Share ${file.fileName}` : "Add people"}
          </h3>
          <button className="text-gray-400 hover:text-white" onClick={onClose}>
            ✕
          </button>
        </div>

        {step === "main" && (
          <>
            <p className="text-gray-400 text-sm mb-3">
              Size: {(file.size / 1024).toFixed(2)} KB
            </p>

            <button
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 text-left"
              onClick={() => setStep("add-people")}
            >
              ➕ Add people
            </button>

            <button
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700"
              onClick={handleCopyLink}
            >
              <Link size={18} /> Copy link
            </button>
          </>
        )}

        {step === "add-people" && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Anyone with this link:</p>
              <button
                className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg w-full text-gray-200 hover:bg-gray-700"
                onClick={() =>
                  setAccess(access === "can edit" ? "can view" : "can edit")
                }
              >
                {access} <ChevronDown size={16} />
              </button>
            </div>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600"
                onClick={() => setStep("main")}
              >
                Back
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
                onClick={handleAddPeople}
              >
                Share file
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareModal;
