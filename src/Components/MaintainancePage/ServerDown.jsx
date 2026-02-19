import { useEffect, useState, useRef } from "react";
import {
  HiDatabase,
  HiDesktopComputer,
  HiGlobe,
  HiInformationCircle,
  HiServer,
  HiWifi,
} from "react-icons/hi";
import CircleTimer from "./CircleTimer";

export default function ServerUnavailable() {
  const [isOnline, setIsOnline] = useState(true);
  const canvasRef = useRef(null);

  // Check if user is online
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    // Create particles
    const particles = [];
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 20));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        radius: Math.random() * 2 + 1,
        color: `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
      });
    }

    // Animation loop
    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.offsetWidth) {
          particle.speedX *= -1;
        }
        if (particle.y < 0 || particle.y > canvas.offsetHeight) {
          particle.speedY *= -1;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      // Draw connections between nearby particles
      particles.forEach((particle, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particle.x - particles[j].x;
          const dy = particle.y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${
              0.1 * (1 - distance / 100)
            })`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background canvas animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Content container */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-2">
        {/* Status badge */}
        <div className="mb-6 sm:mb-8 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-full px-4 py-2 flex items-center animate-pulse">
          <HiInformationCircle className="w-4 h-4 mr-2 text-red-400" />
          <span className="text-red-200 text-sm font-medium">
            Server Unavailable
          </span>
        </div>

        {/* Main card */}
        <div className="w-full max-w-3xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-white/30">
          {/* Card header */}
          <div className="relative bg-gradient-to-r from-red-500/80 to-red-600/80 p-6 sm:p-8">
            <div className="absolute top-0 right-0 p-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-300" />
                <div className="w-3 h-3 rounded-full bg-yellow-300" />
                <div className="w-3 h-3 rounded-full bg-green-300" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <HiServer className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-sm sm:text-3xl md:text-2xl font-bold mb-2 animate-fade-in">
                  We&apos;re experiencing technical difficulties
                </h2>
                <p className="text-white/80 max-w-lg animate-fade-in delay-100">
                  Our server is currently down for maintenance. Our team is
                  working to get everything back online as soon as possible.
                </p>
              </div>
            </div>
          </div>

          {/* Card body */}
          <div className="p-6 sm:p-8">
            {/* Network status */}
            <div className="mb-8 flex items-center justify-center">
              <div
                className={`flex items-center px-4 py-2 rounded-full ${
                  isOnline
                    ? "bg-green-500/20 text-green-300"
                    : "bg-red-500/20 text-red-300"
                }`}
              >
                {isOnline ? (
                  <HiWifi className="w-4 h-4 mr-2" />
                ) : (
                  <HiWifi className="w-4 h-4 mr-2" />
                )}
                <span className="text-sm font-medium">
                  {isOnline
                    ? "Your internet connection is active"
                    : "You are currently offline"}
                </span>
              </div>
            </div>

            {/* Reconnection status */}
            <div className="flex flex-col items-center mb-8 animate-fade-in delay-400">
              <CircleTimer />
            </div>

            {/* System status */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-center text-white/90">
                System Status
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatusIndicator
                  label="API"
                  status="error"
                  icon={<HiServer className="w-4 h-4" />}
                />
                <StatusIndicator
                  label="Database"
                  status="error"
                  icon={<HiDatabase className="w-4 h-4" />}
                />
                <StatusIndicator
                  label="Cache"
                  status="warning"
                  icon={<HiDesktopComputer className="w-4 h-4" />}
                />
                <StatusIndicator
                  label="CDN"
                  status="success"
                  icon={<HiGlobe className="w-4 h-4" />}
                />
              </div>
            </div>

            {/* Support info */}
            <div className="text-center text-white/60 text-xs sm:text-sm border-t border-white/10 pt-6 animate-fade-in delay-500">
              <p>If this issue persists, please contact support.</p>
              <a
                href="mailto:support@example.com"
                className="text-blue-400 hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 rounded"
              >
                support@example.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Types for canvas animation

function StatusIndicator({ label, status, icon }) {
  const colors = {
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  };

  const bgColors = {
    success: "bg-green-500/10",
    warning: "bg-yellow-500/10",
    error: "bg-red-500/10",
  };

  const borderColors = {
    success: "border-green-500/20",
    warning: "border-yellow-500/20",
    error: "border-red-500/20",
  };

  const textColors = {
    success: "text-green-300",
    warning: "text-yellow-300",
    error: "text-red-300",
  };

  return (
    <div
      className={`${bgColors[status]} ${borderColors[status]} border rounded-lg p-3 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-white/5 group`}
    >
      <div
        className={`w-8 h-8 ${colors[status]} rounded-full flex items-center justify-center mb-2 animate-pulse group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <span className={`text-xs font-medium ${textColors[status]}`}>
        {label}
      </span>
    </div>
  );
}
