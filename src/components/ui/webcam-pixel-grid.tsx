"use client";

import { useEffect, useRef, useState } from "react";

interface WebcamPixelGridProps {
  gridCols?: number;
  gridRows?: number;
  maxElevation?: number;
  motionSensitivity?: number;
  elevationSmoothing?: number;
  colorMode?: "webcam" | "grayscale" | "thermal";
  backgroundColor?: string;
  mirror?: boolean;
  gapRatio?: number;
  invertColors?: boolean;
  darken?: number;
  borderColor?: string;
  borderOpacity?: number;
  className?: string;
  onWebcamReady?: () => void;
  onWebcamError?: (error: Error) => void;
}

export function WebcamPixelGrid({
  gridCols = 60,
  gridRows = 40,
  maxElevation = 50,
  motionSensitivity = 0.25,
  elevationSmoothing = 0.2,
  colorMode = "webcam",
  backgroundColor = "#030303",
  mirror = true,
  gapRatio = 0.05,
  invertColors = false,
  darken = 0.6,
  borderColor = "#ffffff",
  borderOpacity = 0.06,
  className = "",
  onWebcamReady,
  onWebcamError,
}: WebcamPixelGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationRef = useRef<number>();
  const [hasPermission, setHasPermission] = useState(false);
  const previousFrameRef = useRef<ImageData | null>(null);
  const elevationsRef = useRef<number[][]>([]);

  useEffect(() => {
    // Initialize elevation grid
    elevationsRef.current = Array(gridRows)
      .fill(0)
      .map(() => Array(gridCols).fill(0));

    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // Wait for video to be ready before playing
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play().catch((err) => {
                console.error("Video play error:", err);
              });
            }
          };

          setHasPermission(true);
          onWebcamReady?.();
        }
      } catch (error) {
        console.error("Webcam access denied:", error);
        onWebcamError?.(error as Error);
      }
    };

    startWebcam();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasPermission || !canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const video = videoRef.current;

    if (!ctx) return;

    const draw = () => {
      if (!video.videoWidth || !video.videoHeight) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const cellWidth = canvas.width / gridCols;
      const cellHeight = canvas.height / gridRows;

      // Draw background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create temporary canvas for video sampling
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = gridCols;
      tempCanvas.height = gridRows;
      const tempCtx = tempCanvas.getContext("2d", { willReadFrequently: true });

      if (!tempCtx) return;

      // Draw video scaled down
      if (mirror) {
        tempCtx.save();
        tempCtx.scale(-1, 1);
        tempCtx.drawImage(video, -gridCols, 0, gridCols, gridRows);
        tempCtx.restore();
      } else {
        tempCtx.drawImage(video, 0, 0, gridCols, gridRows);
      }

      const imageData = tempCtx.getImageData(0, 0, gridCols, gridRows);
      const pixels = imageData.data;

      // Calculate motion if we have a previous frame
      let motionData: number[][] = Array(gridRows)
        .fill(0)
        .map(() => Array(gridCols).fill(0));

      if (previousFrameRef.current) {
        const prevPixels = previousFrameRef.current.data;
        for (let row = 0; row < gridRows; row++) {
          for (let col = 0; col < gridCols; col++) {
            const i = (row * gridCols + col) * 4;
            const rDiff = Math.abs(pixels[i] - prevPixels[i]);
            const gDiff = Math.abs(pixels[i + 1] - prevPixels[i + 1]);
            const bDiff = Math.abs(pixels[i + 2] - prevPixels[i + 2]);
            motionData[row][col] = (rDiff + gDiff + bDiff) / 3 / 255;
          }
        }
      }

      previousFrameRef.current = imageData;

      // Draw grid cells
      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
          const i = (row * gridCols + col) * 4;
          let r = pixels[i];
          let g = pixels[i + 1];
          let b = pixels[i + 2];

          // Apply darken
          r = Math.floor(r * (1 - darken));
          g = Math.floor(g * (1 - darken));
          b = Math.floor(b * (1 - darken));

          // Apply color mode
          if (colorMode === "grayscale") {
            const gray = Math.floor(0.299 * r + 0.587 * g + 0.114 * b);
            r = g = b = gray;
          }

          // Invert colors
          if (invertColors) {
            r = 255 - r;
            g = 255 - g;
            b = 255 - b;
          }

          // Update elevation with smoothing
          const targetElevation = motionData[row][col] * maxElevation * motionSensitivity;
          elevationsRef.current[row][col] +=
            (targetElevation - elevationsRef.current[row][col]) * elevationSmoothing;

          const elevation = elevationsRef.current[row][col];

          // Calculate position
          const x = col * cellWidth + elevation * 0.5;
          const y = row * cellHeight + elevation * 0.5;
          const size = Math.max(cellWidth, cellHeight) * (1 - gapRatio);

          // Draw cell
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(x, y, size, size);

          // Draw border
          if (borderOpacity > 0) {
            ctx.strokeStyle = `${borderColor}${Math.floor(borderOpacity * 255)
              .toString(16)
              .padStart(2, "0")}`;
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, size, size);
          }
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    hasPermission,
    gridCols,
    gridRows,
    maxElevation,
    motionSensitivity,
    elevationSmoothing,
    colorMode,
    backgroundColor,
    mirror,
    gapRatio,
    invertColors,
    darken,
    borderColor,
    borderOpacity,
  ]);

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        className="hidden"
        playsInline
        muted
        autoPlay={false}
      />
      <canvas ref={canvasRef} className="w-full h-full" />
      {!hasPermission && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white text-sm backdrop-blur-sm">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">📷</div>
            <p className="mb-2">请允许访问摄像头</p>
            <p className="text-xs text-white/60">启用摄像头像素网格背景效果</p>
          </div>
        </div>
      )}
    </div>
  );
}
