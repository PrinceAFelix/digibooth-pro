import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CollageCanvas from "../components/collage/Collage.tsx";
import frame from "../assets/template-01.png"; // imported PNG frame asset

interface LocationState {
  photos: string[];
}

const FinalResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const [finalImage, setFinalImage] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if no photos are present
    if (!state?.photos || state.photos.length === 0) {
      navigate("/capture");
    }
  }, [state, navigate]);

  const handleDownload = (): void => {
    if (!finalImage) return;

    const link = document.createElement("a");
    link.download = "wedding-photo.png";
    link.href = finalImage;
    link.click();
  };

  const handleReturnHome = (): void => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-blue-200 p-6">
      <h1 className="text-3xl font-cursive mb-6">Your photo is ready!</h1>

      {finalImage ? (
        <img
          src={finalImage}
          alt="Final collage"
          className="max-w-xs border-1 border-black mb-6 w-38"
        />
      ) : (
        <p className="text-gray-500 mb-6">Processing your photo...</p>
      )}

      <CollageCanvas
        photos={state.photos}
        frame={frame}
        onReady={(imageDataUrl: string) => setFinalImage(imageDataUrl)}
      />

      <button
        onClick={handleDownload}
        disabled={!finalImage}
        className="bg-green-400 text-white text-xl font-cursive px-10 py-3 rounded-full shadow-md hover:bg-green-500 transition mb-4 disabled:opacity-50"
      >
        Save Image
      </button>

      <button
        onClick={handleReturnHome}
        className="border border-black px-10 py-3 rounded-full text-xl font-cursive bg-white shadow hover:bg-gray-100"
      >
        Return home
      </button>
    </div>
  );
};

export default FinalResultsPage;
