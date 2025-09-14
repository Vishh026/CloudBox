import axiosConfig from "../axiosConfig/axios";

// --- Upload file ---
export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosConfig.post("/file/upload", formData, { withCredentials: true },{
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (onProgress) {
        onProgress(Math.round((event.loaded * 100) / event.total));
      }
      console.log(res.data.data)
    },
  });

  return res.data.data;
};

// --- Get today's files ---
export const getTodaysFiles = async () => {
  try {
    const {data} = await axiosConfig.get("/file/today"); // endpoint relative to baseURL
    console.log(data)
    return data?.files || [];
  } catch (err) {
    console.error("Error fetching today's files:", err);
    return [];
  }
};

// --- Delete file ---
export const deleteFileById = async (id) => {
  const { data } = await axiosConfig.delete(`/file/my-files/${id}`,{ withCredentials: true });
  return data.data;
};

// --- Rename file ---
export const renameFile = async (file) => {
  try {
    const newName = prompt("Rename file", file.fileName);
    if (!newName || newName.trim() === "" || newName === file.fileName) return;

    await axiosConfig.patch(
      `/file/${file._id}/rename`,
      { newName },{ withCredentials: true }
    );
    return { ...file, fileName: newName };
  } catch (error) {
    console.error("Rename failed", error);
    alert(error.response?.data?.message || "Rename failed");
  }
};

// --- Download file ---
export const downloadFile = async (fileId, fileName) => {
  try {
    const res = await axiosConfig.get(`/file/download/${fileId}`, {
      responseType: "blob", // very important for downloading
    },{ withCredentials: true });

    const url = window.URL.createObjectURL(res.data);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "downloaded-file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download failed", err);
    throw err;
  }
};

// --- Get Copy Link ---
export const getCopyLink = async (fileId) => {
  try {
    const res = await axiosConfig.get(`/file/copy-link/${fileId}`,{ withCredentials: true });
    return res.data.data?.copyLink || res.data.copyLink;
  } catch (err) {
    console.error("Failed to get copy link", err);
    alert("Failed to get copy link");
  }
};

export const shareViaLink =async(fileId) => {
  try {
    const {data} = await axiosConfig.patch(`/file/${fileId}/toggle-public`,{ withCredentials: true })
    if(data.data?.shareLink){
      navigator.clipboard.writeText(data.data.shareLink)
      alert("share link copied to clipboard")
    }else{
      "file is now private"
    }
  } catch (error) {
    console.error("Failed to share file", error);
  }
}

export const fetchPublicFiles = async(shareToken) => {
    try {
      const { data } = await axiosConfig.get(`/file/share/${shareToken}`,{ withCredentials: true })
      console.log("Public file data:", data.data);
    } catch (error) {
      console.error("Cannot fetch public file", error);
    }
  }

export const shareWithPeople = async(fileId,email,role= "read") => {
  try {
    const { data } = await axiosConfig.post(`/file/${fileId}/add-collaborators`,{ email,role},{ withCredentials: true })
    alert("Collaborator added!");
    console.log(data.data.collaborators);

  } catch (err) {
    console.error("Failed to add collaborator", err);
    alert(err.response?.data?.message || "Error adding collaborator");
  }
}

// Map frontend sort values -> backend sort keys
const mapSort = (sort) => {
  switch (sort) {
    case "newest": return "createdAtDesc";
    case "oldest": return "oldest";
    case "sizeAsc": return "sizeAsc";
    case "sizeDesc": return "sizeDesc";
    default: return "createdAtDesc";
  }
};
// Fetch filtered files
export const getFilteredFiles = async ({ filters = {}, page = 1, limit = 10 }) => {
  try {
    const query = {
      ...filters,
      page,
      limit,
      sort: mapSort(filters.sort),
    };

    const { data } = await axiosConfig.get("/file/filtered", {
      params: query,
      withCredentials: true,
    });

    return data.data; // { page, limit, total, hasMore, files }
  } catch (err) {
    console.error("Error fetching filtered files:", err);
    throw err;
  }
};