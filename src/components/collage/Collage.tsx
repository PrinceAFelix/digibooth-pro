import React, { useRef, useEffect } from "react";

type Slot = {
  x: number;
  y: number;
  w: number;
  h: number;
};

interface CollageCanvasProps {
  photos: string[]; // Array of captured photo URLs
  frame: string; // PNG frame image URL
  onReady: (imageDataUrl: string) => void; // Called with final merged image
}

const CollageCanvas: React.FC<CollageCanvasProps> = ({
  photos,
  frame,
  onReady
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameImg = new Image();
    frameImg.crossOrigin = "anonymous";
    frameImg.src = frame;

    frameImg.onload = () => {
      canvas.width = frameImg.width;
      canvas.height = frameImg.height;

      // Define the slot positions for the photos in the collage frame
      const slots: Slot[] = [
        { x: 125, y: 245, w: 1400, h: 1060 },
        { x: 125, y: 1355, w: 1430, h: 1090 },
        { x: 125, y: 2495, w: 1430, h: 1090 }
        // Add more slots as needed
      ];

      const photoPromises = photos.slice(0, slots.length).map((src, i) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = src;

          img.onload = () => {
            const slot = slots[i];
            const slotAspect = slot.w / slot.h;
            const imgAspect = img.width / img.height;

            let sx = 0;
            let sy = 0;
            let sw = img.width;
            let sh = img.height;

            // Crop the image to match the slot's aspect ratio
            if (imgAspect > slotAspect) {
              // Image is wider — crop the sides
              sw = img.height * slotAspect;
              sx = (img.width - sw) / 2;
            } else {
              // Image is taller — crop the top and bottom
              sh = img.width / slotAspect;
              sy = (img.height - sh) / 2;
            }

            // Draw cropped + scaled image into the slot
            ctx.drawImage(
              img,
              sx,
              sy,
              sw,
              sh, // source: cropped rectangle from the original image
              slot.x,
              slot.y, // target: slot position
              slot.w,
              slot.h // target: fill the slot fully
            );
            resolve();
          };

          img.onerror = () => {
            console.error(`Failed to load image: ${src}`);
            resolve(); // Skip this image but continue
          };
        });
      });

      Promise.all(photoPromises).then(() => {
        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
        const finalImageDataUrl = canvas.toDataURL("image/png");
        onReady(finalImageDataUrl);
      });
    };
  }, [photos, frame, onReady]);

  return <canvas ref={canvasRef} className="hidden" />;
};

export default CollageCanvas;
