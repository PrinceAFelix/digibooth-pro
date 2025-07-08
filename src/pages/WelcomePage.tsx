// pages/WelcomePage.tsx
import { useNavigate } from "react-router-dom";
import Button from "../components/button/button";
import icon from "../assets/camera-video.svg";
import heart from "../assets/heart.svg";
import camera from "../assets/camera.svg";
import Icon from "../components/icon/Icon";

export default function WelcomePage() {
  const navigate = useNavigate();

  const handleBegin = () => {
    navigate("/frames");
  };

  return (
    <section id="main" className="z-10">
      <div
        className={`min-h-[100dvh] w-full flex flex-col items-center justify-center text-center gap-y-10 mb-25 transition-all duration-700 ease-in-out transform opacity-100 translate-y-0`}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-[#FFA9D2] w-7" />
          <Icon src={heart} className="w-5 h-5 text-[#FFA9D2]" />
          <div className="h-px bg-[#FFA9D2] w-7" />
        </div>

        <h1 className="text-2xl font-light text-black mb-2">
          Welcome to <br />
          <span className="text-5xl font-bold text-black">
            Nicole & Arghel’s
          </span>
          <br />
          <span className="font-light text-black">Wedding!</span>
        </h1>

        <h2 className="text-lg font-normal text-black mb-6">
          Capture beautiful memories with our photobooth
        </h2>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-[#FFA9D2] w-16" />
          <Icon src={camera} className="w-5 h-5 text-[#FFA9D2]" />
          <div className="h-px bg-[#FFA9D2] w-16" />
        </div>

        <div>
          <Button
            properties={{ isActive: true, width: "200px" }}
            icon={icon}
            text="Let's Begin!"
            onClick={handleBegin}
          />
          <h2 className="text-lg font-light mt-4 text-black">
            Tap to start taking photos
          </h2>
        </div>
      </div>
    </section>
  );
}
