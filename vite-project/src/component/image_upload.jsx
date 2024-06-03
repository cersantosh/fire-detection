import React, { useState } from "react";
import axios from "axios";

const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  const handleUpload = async (event) => {
    try {
      event.preventDefault();
      if (!selectedFile) {
        setError("Please select a file first");
        return;
      }

      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setIsLoading(false);
      setPrediction(response.data);
    } catch (error) {
      setIsLoading(false);
      setError("Error while uploading");
      console.log("Error while uploading", error);
    }
  };

  return (
    <div className="image-uploader-container">
      <h1>Image Uploader</h1>
      <div className="upload-section">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="prediction-container">
        {!isLoading ? (
          prediction && (
            <div>
              <h2>Prediction</h2>
              <p>Class: {prediction.predicted_class}</p>
              <p>Confidence: {prediction.confidence}</p>
            </div>
          )
        ) : (
          <p>Loading ..</p>
        )}
      </div>
      <div className="image-container">
        {imageUrl && (
          <img src={imageUrl} alt="Uploaded" className="uploaded-image" />
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
