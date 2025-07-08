import React, { useEffect, useRef, useState } from "react";
import camera from "../assets/camera.svg";
import Icon from "../components/icon/Icon";
import Button from "../components/button/button";
import { useNavigate } from "react-router-dom";

export default function PhotoBoothCapture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]); // Array for 3 captures
  const [error, setError] = useState<string | null>(null);

  // Countdown state and current capture index
  const [countdown, setCountdown] = useState<number | null>(null);
  const [captureIndex, setCaptureIndex] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);

  const [flash, setFlash] = useState(false);

  const navigate = useNavigate();

  async function requestCamera() {
    const constraints: MediaStreamConstraints = {
      audio: false,
      video: {
        facingMode: { ideal: "user" },
        width: { ideal: 1280 },
        height: { ideal: 960 }
      }
    };
    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err1) {
      const webkit = (navigator as any).webkitGetUserMedia;
      if (webkit) {
        stream = await new Promise<MediaStream>((res, rej) =>
          webkit.call(navigator, constraints, res, rej)
        );
      } else {
        console.error("getUserMedia failed:", err1);
        setError("Camera not available or permission denied");
        setHasPermission(false);
        return;
      }
    }

    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
      videoRef.current.autoplay = true;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch(console.warn);
      };
      setHasPermission(true);
    }
  }

  useEffect(() => {
    requestCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((t) => t.stop());
      }
    };
  }, []);

  // Function to capture current video frame to canvas and save to state
  const capturePhoto = () => {
    if (!(videoRef.current && canvasRef.current)) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const originalWidth = video.videoWidth;
    const originalHeight = video.videoHeight;

    // Crop to center square
    const size = Math.min(originalWidth, originalHeight);
    const offsetX = (originalWidth - size) / 2;
    const offsetY = (originalHeight - size) / 2;

    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.save();
      ctx.translate(size, 0); // Mirror horizontally
      ctx.scale(-1, 1);
      ctx.drawImage(video, offsetX, offsetY, size, size, 0, 0, size, size);
      ctx.restore();

      const dataUrl = canvas.toDataURL("image/png");
      setCapturedPhotos((prev) => [...prev, dataUrl]);

      // Flash effect
      setFlash(true);
      setTimeout(() => setFlash(false), 150); // flash lasts 150ms
    }
  };

  // Starts the 3-shot countdown + capture sequence
  const startCountdownAndCapture = () => {
    if (countdown !== null) return; // prevent multiple triggers

    setCapturedPhotos([]); // reset photos
    setCaptureIndex(0); // start from 0
    setCountdown(3);
  };

  // Countdown effect handler
  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      // Continue counting down
      const timerId = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else {
      // countdown === 1, capture photo now
      capturePhoto();

      if (captureIndex < 2) {
        // If less than 3 photos taken (0-based index), prepare for next countdown
        setCaptureIndex(captureIndex + 1);
        setCountdown(3); // reset countdown to 5 again
      } else {
        // Done capturing 3 photos
        setCountdown(null);
        setTimeout(() => {
          setShowResult(true); // show final layout after all 3 photos
        }, 500);
      }
    }
  }, [countdown, captureIndex]);

  if (hasPermission === false) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <p className="text-red-600 mb-4">{error}</p>
        <p>Please allow camera access to use the photobooth.</p>
      </div>
    );
  }

  const resetState = async () => {
    setCapturedPhotos([]);
    setCaptureIndex(0);
    setCountdown(null);
    setShowResult(false);
    setError(null);
    setFlash(false);

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx)
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    await requestCamera();
  };

  const handleFinalResult = (photos: string[]) => {
    navigate("/final", { state: { photos } });
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 p-14 z-0">
      {!showResult && (
        <>
          <div className="relative w-[80vw] max-w-md aspect-[4/3] mb-40 rounded-lg">
            {" "}
            <video
              ref={videoRef}
              className="w-full h-full rounded-lg object-cover transform scale-x-[-1]"
            />
            {/* Flash overlay (same size and position as video) */}
            {flash && (
              <div className="absolute inset-0 bg-white opacity-80 animate-flash rounded-lg pointer-events-none z-20" />
            )}
          </div>

          {/* Overlay UI */}
          <div className="absolute top-1/3 w-full text-center text-white drop-shadow-lg select-none pointer-events-none">
            <div className="flex flex-col items-center gap-2 pointer-events-auto">
              {countdown !== null ? (
                <>
                  <p className="text-white text-9xl font-bold">{countdown}</p>
                  <p className="text-white text-lg font-light mt-2">
                    Capturing photo {captureIndex + 1} of 3
                  </p>
                </>
              ) : (
                <>
                  <Icon src={camera} className="w-5 h-5" />
                  <p className="text-white text-xl font-light">
                    Tap the shutter to capture 3 photos
                  </p>
                </>
              )}
            </div>
          </div>

          <button
            onClick={startCountdownAndCapture}
            className="absolute bottom-40 w-20 h-20 rounded-full bg-[#fce6c8] border-[6px] border-white ring-[6px] ring-[#fce6c8] shadow-md hover:opacity-90 transition"
            aria-label="Capture photo"
          />
        </>
      )}

      {showResult && (
        <div className="h-[100vh] flex flex-col gap-2 sm:gap-15 items-center">
          <h1 className="text-2xl">Your photos are ready!</h1>
          <div className="relative flex flex-col justify-center items-center w-[80vw] max-w-md h-auto">
            {capturedPhotos.map((photo, i) => (
              <img
                key={i}
                src={photo}
                alt={`Captured ${i + 1}`}
                className="z-2 w-38 h-38 object-cover border-10 box-content border-white animate-slide-down"
              />
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              properties={{
                width: "200px",
                isActive: true
              }}
              text="Continue"
              onClick={() => handleFinalResult(capturedPhotos)}
            />
            <Button
              properties={{
                width: "100px",
                isActive: true,
                btnColor: "#64748B"
              }}
              text="Retake"
              onClick={resetState}
            />
          </div>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
