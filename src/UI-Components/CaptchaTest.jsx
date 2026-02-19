import { useEffect } from "react";
import { HiArrowPath } from "react-icons/hi2";

const CustomCaptcha = ({
  canvasRef,
  captchaText,
  generateCaptchaText,
  drawCaptcha,
}) => {
  useEffect(() => {
    generateCaptchaText();
  }, []);

  useEffect(() => {
    drawCaptcha();
  }, [captchaText]);

  return (
    <div className="flex gap-4 items-center">
      <canvas ref={canvasRef} className="rounded-lg " />
      <HiArrowPath
        size={18}
        tabIndex={0}
        className="cursor-pointer"
        onClick={generateCaptchaText}
      />
    </div>
  );
};

export default CustomCaptcha;
