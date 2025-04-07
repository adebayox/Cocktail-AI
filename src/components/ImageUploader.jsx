import React, { useState, useRef } from "react";
import { Upload, X, Camera, Loader2 } from "lucide-react";
import { privateFetch } from "../utility/fetchFunction"; // Import your fetch utility

const ImageUploader = ({ onAnalysisComplete, isAnalyzing, setIsAnalyzing }) => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const previewUrl = event.target.result;
        console.log("Preview URL:", previewUrl); // Debug log
        setPreviewUrl(previewUrl);
        analyzeImage(previewUrl); // Pass the preview URL to analyzeImage
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (imageData) => {
    try {
      setIsAnalyzing(true);
  
      const response = await privateFetch.request({
        method: "POST",
        url: "cocktail/analyze-image",
        data: { imageData },
      });
  
      if (response?.data?.code === "00") {
        const analysisData = response.data.analysis;
        console.log("Analysis data with image:", analysisData);
  
        // Pass both the analysis data and the preview URL
        onAnalysisComplete(analysisData, imageData); // Pass imageData (previewUrl) here
      } else {
        throw new Error(response?.data?.message || "Failed to analyze image");
      }
    } catch (error) {
      console.error("Image analysis error:", error);
      alert("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetImage = () => {
    setImage(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mb-6">
      <div className="text-lg font-semibold text-purple-900 mb-2">
        Identify Cocktail from Image
      </div>

      {!previewUrl ? (
        <div
          onClick={() => fileInputRef.current.click()}
          className="border-2 border-dashed border-purple-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-colors"
        >
          <Upload className="w-10 h-10 text-purple-500 mb-2" />
          <p className="text-purple-700 font-medium">
            Click to upload a cocktail image
          </p>
          <p className="text-purple-500 text-sm mt-1">or drag and drop</p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Cocktail preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={resetImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            disabled={isAnalyzing}
          >
            <X className="w-5 h-5" />
          </button>

          {isAnalyzing && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="text-white flex flex-col items-center">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p>Analyzing cocktail...</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
