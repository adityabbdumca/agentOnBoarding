import { useState, useRef } from "react";

const useCaptchaHook = (length = 6) => {
  const [generatedCaptcha, setGeneratedCaptcha] = useState("");

  const canvasRef = useRef(null);
  const [captchaText, setCaptchaText] = useState("");

  const generateCaptchaText = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setGeneratedCaptcha(result);
  };

  const drawCaptcha = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = 120;
    const height = 40;

    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = "#e0e0e0";
    ctx.fillRect(0, 0, width, height);

    // Text
    ctx.font = "18px Arial, sans-serif";
    ctx.fillStyle = "#000";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillText(captchaText, width / 2, height / 2);

    // Optional: Add noise lines
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = "rgba(0,0,0,0.4)";
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }
  };

  return {
    refs: {
      canvasRef,
    },
    states: {
      captchaText,
      generatedCaptcha,
    },
    actions: {
      generateCaptchaText,
      drawCaptcha,
      setGeneratedCaptcha,
    },
  };
};

export default useCaptchaHook;
