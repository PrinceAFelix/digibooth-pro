// App.tsx
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes";
import groom from "./assets/groom.webp";
import bride from "./assets/bride.webp";
import styles from "./App.module.css";
import { useEffect, useState } from "react";

function AnimatedImages() {
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Trigger slide-out first
    setIsAnimating(true);

    const timeout = setTimeout(() => {
      // Then after delay update to new step
      if (location.pathname === "/") setStep(0);
      else if (location.pathname === "/frames") setStep(1);
      else setStep(-1); // other routes hide images

      // Allow image to pop back in
      setIsAnimating(false);
    }, 500); // match with transition duration

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  const getGroomTransform = () => {
    if (isAnimating) return "translateX(-200%)";
    switch (step) {
      case 0:
        return "translateY(-96%) rotate(90deg)";
      case 1:
        return "translate(-25%, -55%) rotate(60deg)";
      default:
        return "translateX(-200%)";
    }
  };

  const getBrideTransform = () => {
    if (isAnimating) return "translateX(200%)";
    switch (step) {
      case 0:
        return "translateY(45%) rotate(-90deg)";
      case 1:
        return "translate(25%, -55%) rotate(-65deg)";
      default:
        return "translateX(200%)";
    }
  };

  return (
    <>
      <img
        src={groom}
        className="absolute z-0 left-0 w-48 h-auto object-cover rounded-md transition-transform duration-700 ease-in-out"
        style={{ transform: getGroomTransform() }}
      />
      <img
        src={bride}
        className="absolute z-0 right-0 w-45 h-auto object-cover rounded-md transition-transform duration-700 ease-in-out"
        style={{ transform: getBrideTransform() }}
      />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div
        className={`${styles.App} min-h-screen w-full flex items-center justify-center px-4 flex-col relative`}
      >
        <AnimatedImages />
        <div className="relative z-10 w-full">
          <AppRoutes />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
