// pages/FrameSelectionPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/button/button";
import frameone from "../assets/Frame1.webp";
import frametwo from "../assets/Frame2.webp";
import styles from "../App.module.css";

export default function FrameSelectionPage() {
  const [selectedFrame, setSelectedFrame] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedFrame != null) {
      navigate("/capture");
    }
  };

  return (
    <section id="second" className="z-10">
      <div
        className={`min-h-[100dvh] w-full flex flex-col items-center justify-center text-center gap-y-10 mb-25 transition-all duration-700 ease-in-out transform opacity-100 translate-y-0`}
      >
        <h1 className="font-[Merienda_One,cursive] text-3xl sm:text-6xl font-normal text-black break-words">
          Choose your Frame
        </h1>

        <div className="flex flex-col gap-y-5 transition-opacity duration-700 ease-in-out">
          {[frameone, frametwo].map((src, index) => (
            <div
              key={index}
              onClick={() => setSelectedFrame(index)}
              className="w-screen h-auto flex items-center justify-center"
            >
              <img
                src={src}
                alt={`Frame ${index + 1}`}
                className={`${selectedFrame === index ? styles.selected : ""} ${
                  index === 0 ? "w-24" : "w-80"
                } h-auto`}
              />
            </div>
          ))}
        </div>

        <div>
          <Button
            properties={{
              width: "200px",
              isActive: selectedFrame != null
            }}
            text="Continue"
            onClick={handleContinue}
          />
          <h2 className="text-lg font-light mt-4 text-black">
            Tap one of the frame
          </h2>
        </div>
      </div>
    </section>
  );
}
