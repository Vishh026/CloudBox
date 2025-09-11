import axios from "../../axiosConfig/axios"; // your axios instance
import { uploadFileRequest, uploadFileSuccess, uploadFileFail } from "../reducers/FileSlice";

export const uploadFile = (file) => async (dispatch) => {
  dispatch(uploadFileRequest());

  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("/file/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.status !== 201) throw new Error(res.data.message || "Upload failed");

    dispatch(uploadFileSuccess(res.data.data));
  } catch (error) {
    dispatch(uploadFileFail(error.message));
  }
};
