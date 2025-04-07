import React, { useState } from "react";
import { useImageAnalysis } from "../hooks/useImageAnalysis";
import { Upload, Check, X, Loader } from "lucide-react";

const CocktailImageAnalyzer = ({ onAnalysisComplete }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { analyzeImage, isAnalyzing } = useImageAnalysis();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onloadend = async () => {
        const base64data = reader.result;
        // Remove data:image/jpeg;base64, part if needed
        const imageData = base64data.includes("base64,")
          ? base64data.split("base64,")[1]
          : base64data;

        const analysis = await analyzeImage(imageData);
        if (analysis) {
          onAnalysisComplete(analysis);
        }
      };
    } catch (error) {
      console.error("Error analyzing image:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 mb-8">
      <h3 className="text-xl font-bold text-purple-900 mb-4">
        Analyze Cocktail Image
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-purple-700 mb-2">
          Upload Cocktail Image
        </label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-purple-300 border-dashed rounded-lg cursor-pointer bg-purple-50 hover:bg-purple-100">
            {imagePreview ? (
              <div className="relative w-full h-full">
                <img
                  src={imagePreview}
                  alt="Cocktail preview"
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 text-purple-500 mb-3" />
                <p className="mb-2 text-sm text-purple-700">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-purple-500">
                  PNG, JPG or JPEG (MAX. 5MB)
                </p>
              </div>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={!selectedImage || isAnalyzing}
        className={`w-full py-2 px-4 ${
          !selectedImage || isAnalyzing
            ? "bg-purple-300 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700"
        } text-white font-medium rounded-lg text-sm flex items-center justify-center`}
      >
        {isAnalyzing ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Check className="w-4 h-4 mr-2" />
            Analyze Cocktail
          </>
        )}
      </button>
    </div>
  );
};

export default CocktailImageAnalyzer;
