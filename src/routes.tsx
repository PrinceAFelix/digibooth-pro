// AppRoutes.tsx
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import WelcomePage from "./pages/WelcomePage";
import FrameSelectionPage from "./pages/FrameSelectionPage";
import PhotoCapturePage from "./pages/PhotoCapturePage";
import FinalResultPage from "./pages/FinalResultPage";

export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <FadeWrapper>
              <WelcomePage />
            </FadeWrapper>
          }
        />
        <Route
          path="/frames"
          element={
            <FadeWrapper>
              <FrameSelectionPage />
            </FadeWrapper>
          }
        />
        <Route path="/capture" element={<PhotoCapturePage />} />
        <Route path="/final" element={<FinalResultPage />} />
      </Routes>
    </AnimatePresence>
  );
}

const variants = {
  initial: { y: "100%", opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: "-50%", opacity: 0 }
};

function FadeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
