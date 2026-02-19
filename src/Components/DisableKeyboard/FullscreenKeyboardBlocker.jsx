import { useEffect } from "react";

const FullscreenKeyboardBlocker = () => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if we're in fullscreen mode
      if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      ) {
        // Prevent all key events
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    window.addEventListener("keydown", handleKeyDown, true); // capture phase

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);

  return null; // This is a headless component
};

export default FullscreenKeyboardBlocker;
