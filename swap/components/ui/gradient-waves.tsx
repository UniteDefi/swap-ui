"use client";

import { useEffect, useRef } from "react";

export function GradientWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawHalftoneWave = () => {
      const gridSize = 20;
      const rows = Math.ceil(canvas.height / gridSize);
      const cols = Math.ceil(canvas.width / gridSize);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const centerX = x * gridSize;
          const centerY = y * gridSize;
          const distanceFromCenter = Math.sqrt(
            Math.pow(centerX - canvas.width / 2, 2) + 
            Math.pow(centerY - canvas.height / 2, 2)
          );
          const maxDistance = Math.sqrt(
            Math.pow(canvas.width / 2, 2) + 
            Math.pow(canvas.height / 2, 2)
          );
          const normalizedDistance = distanceFromCenter / maxDistance;
          
          // Create multiple wave patterns
          const waveOffset1 = Math.sin(normalizedDistance * 8 - time) * 0.5 + 0.5;
          const waveOffset2 = Math.cos(normalizedDistance * 6 + time * 0.7) * 0.5 + 0.5;
          const combinedWave = (waveOffset1 + waveOffset2) / 2;
          
          const size = gridSize * combinedWave * 0.8;

          // Create gradient effect with violet and neon colors
          const gradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, size / 2
          );
          
          // Alternate between violet and cyan/purple gradients based on position
          const colorPhase = (x + y) % 3;
          
          if (colorPhase === 0) {
            // Violet gradient
            gradient.addColorStop(0, `rgba(168, 85, 247, ${combinedWave * 0.6})`);
            gradient.addColorStop(1, `rgba(124, 58, 237, ${combinedWave * 0.2})`);
          } else if (colorPhase === 1) {
            // Cyan/neon gradient
            gradient.addColorStop(0, `rgba(6, 182, 212, ${combinedWave * 0.5})`);
            gradient.addColorStop(1, `rgba(59, 130, 246, ${combinedWave * 0.2})`);
          } else {
            // Purple gradient
            gradient.addColorStop(0, `rgba(217, 70, 239, ${combinedWave * 0.5})`);
            gradient.addColorStop(1, `rgba(168, 85, 247, ${combinedWave * 0.2})`);
          }

          ctx.beginPath();
          ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
          
          // Add glow effect for larger dots
          if (size > gridSize * 0.5) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = colorPhase === 0 ? "rgba(168, 85, 247, 0.5)" : 
                             colorPhase === 1 ? "rgba(6, 182, 212, 0.5)" : 
                                              "rgba(217, 70, 239, 0.5)";
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }
    };

    const animate = () => {
      // Clear with semi-transparent black for trail effect
      ctx.fillStyle = "rgba(10, 10, 15, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawHalftoneWave();

      time += 0.03; // Slower animation for smoother effect
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none" 
      style={{ background: "transparent" }}
    />
  );
}