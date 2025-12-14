import React, { useState, useRef } from "react";
import { Upload, X, Camera } from "lucide-react";
import { privateFetch } from "../utility/fetchFunction";

const ImageUploader = ({ onAnalysisComplete, isAnalyzing, setIsAnalyzing }) => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        const previewUrl = event.target.result;
        console.log("Preview URL:", previewUrl);
        setPreviewUrl(previewUrl);
        analyzeImage(previewUrl);
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
        onAnalysisComplete(analysisData, imageData);
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
    <div>
      <label className="block text-xs font-bold uppercase tracking-wide mb-3 text-black">
        Identify from Image
      </label>

      {!previewUrl ? (
        <div
          onClick={() => fileInputRef.current.click()}
          className="border-4 border-dashed border-black p-8 flex flex-col items-center justify-center cursor-pointer hover:border-brutal-accent hover:bg-brutal-accent/5 transition-all group"
        >
          <div className="w-16 h-16 bg-black flex items-center justify-center mb-4 group-hover:bg-brutal-accent transition-colors">
            <Upload className="w-8 h-8 text-brutal-accent group-hover:text-black transition-colors" strokeWidth={2.5} />
          </div>
          <p className="font-display font-bold uppercase text-black text-center mb-1">
            Upload Cocktail Image
          </p>
          <p className="font-mono text-xs text-brutal-disabled uppercase">
            Click or drag & drop
          </p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />
        </div>
      ) : (
        <div className="relative border-4 border-black">
          <img
            src={previewUrl}
            alt="Cocktail preview"
            className="w-full h-48 object-cover"
          />
          <button
            onClick={resetImage}
            disabled={isAnalyzing}
            className="absolute top-2 right-2 bg-brutal-error text-white p-2 border-2 border-black hover:bg-black hover:text-brutal-error transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" strokeWidth={3} />
          </button>

          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-brutal-accent border-t-transparent animate-spin mb-4" />
              <p className="font-display font-bold uppercase text-brutal-accent text-lg">
                Analyzing...
              </p>
              <p className="font-mono text-xs text-brutal-white/60 uppercase mt-1">
                Identifying cocktail
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
