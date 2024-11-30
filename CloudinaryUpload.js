import React, { useState } from "react";
import axios from "axios";

const CloudinaryUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "foodtalk"); // Replace with your upload preset

    try {
      const response = await api.post(
        `https://api.cloudinary.com/v1_1/dre3daq6i/image/upload`, // Replace with your cloud name
        formData
      );

      console.log("Upload response:", response.data);
      setUploadedUrl(response.data.secure_url); // Get the URL of the uploaded file
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <h1>Upload to Cloudinary</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      {uploadedUrl && (
        <div>
          <p>Uploaded Image:</p>
          <img src={uploadedUrl} alt="Uploaded" style={{ maxWidth: "300px" }} />
        </div>
      )}
    </div>
  );
};

export default CloudinaryUpload;
