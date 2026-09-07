import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Maximize2, Minimize2, RotateCw, Sparkles, Loader2 } from 'lucide-react';

const Product360Viewer = ({ images = [], productName = 'Product' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);
  const startXRef = useRef(0);
  const startIndexRef = useRef(0);
  const animationFrameRef = useRef(null);

  // Normalize image list
  const frameUrls = images.length > 0
    ? images.map((img) => (typeof img === 'string' ? img : img.url || img.imageUrl))
    : [];

  const totalFrames = frameUrls.length;

  // Preload all frames progressively
  useEffect(() => {
    if (totalFrames === 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadProgress(0);
    let loadedCount = 0;

    const preloadedImages = [];

    frameUrls.forEach((src, idx) => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / totalFrames) * 100));
        if (loadedCount >= totalFrames) {
          setIsLoading(false);
        }
      };
      preloadedImages.push(img);
    });

    return () => {
      preloadedImages.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [totalFrames]);

  // Autoplay spin loop
  useEffect(() => {
    let intervalId;
    if (isPlaying && totalFrames > 0) {
      intervalId = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalFrames);
      }, 70); // Smooth spin rate
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, totalFrames]);

  // Mouse Drag handlers
  const handleMouseDown = (e) => {
    if (totalFrames <= 1) return;
    setIsDragging(true);
    setIsPlaying(false);
    startXRef.current = e.clientX;
    startIndexRef.current = currentIndex;
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || totalFrames <= 1) return;
      const deltaX = e.clientX - startXRef.current;
      // 8px of drag movement changes 1 frame
      const framesDiff = Math.floor(deltaX / 8);
      const newIndex = (startIndexRef.current - framesDiff) % totalFrames;
      setCurrentIndex(newIndex < 0 ? newIndex + totalFrames : newIndex);
    },
    [isDragging, totalFrames]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Swipe handlers for mobile
  const handleTouchStart = (e) => {
    if (totalFrames <= 1) return;
    setIsDragging(true);
    setIsPlaying(false);
    startXRef.current = e.touches[0].clientX;
    startIndexRef.current = currentIndex;
  };

  const handleTouchMove = (e) => {
    if (!isDragging || totalFrames <= 1) return;
    const deltaX = e.touches[0].clientX - startXRef.current;
    const framesDiff = Math.floor(deltaX / 7);
    const newIndex = (startIndexRef.current - framesDiff) % totalFrames;
    setCurrentIndex(newIndex < 0 ? newIndex + totalFrames : newIndex);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const currentAngle = totalFrames > 0 ? Math.round((currentIndex / totalFrames) * 360) : 0;

  if (totalFrames === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-slate-200 rounded-3xl text-slate-400">
        <RotateCw className="w-12 h-12 mb-3 text-slate-300 animate-spin" />
        <p className="font-medium text-sm">360° interactive view is being rendered for this product.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-3xl bg-gradient-to-b from-slate-50 to-emerald-50/30 border border-slate-200/80 shadow-inner group transition-all duration-300 ${
        isFullscreen ? 'w-screen h-screen flex flex-col items-center justify-center bg-white p-8' : 'w-full aspect-[4/5] max-h-[560px]'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 360 Badge & Rotation Info */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2">
        <div className="px-3 py-1.5 bg-slate-900/80 backdrop-blur-md text-white rounded-full text-xs font-semibold tracking-wide flex items-center space-x-1.5 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive 360°</span>
        </div>
        <div className="px-2.5 py-1 bg-white/85 backdrop-blur-md text-slate-700 rounded-full text-xs font-bold border border-slate-200/60 shadow-sm">
          {currentAngle}°
        </div>
      </div>

      {/* Fullscreen Button */}
      <button
        onClick={toggleFullscreen}
        aria-label="Toggle Fullscreen"
        className="absolute top-4 right-4 z-20 p-2.5 bg-white/85 hover:bg-white text-slate-700 rounded-full shadow-md backdrop-blur-md transition-all hover:scale-105 active:scale-95"
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>

      {/* Frame Viewer Container */}
      <div className={`relative w-full h-full flex items-center justify-center p-6 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
        {isLoading ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
            <Loader2 className="w-10 h-10 text-dairy-600 animate-spin mb-3" />
            <p className="text-sm font-semibold text-slate-700">Loading 360° Frames ({loadProgress}%)</p>
            <div className="w-44 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-dairy-600 transition-all duration-150"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
          </div>
        ) : null}

        {/* Current Active Image Frame */}
        <img
          src={frameUrls[currentIndex]}
          alt={`${productName} - 360 Frame ${currentIndex + 1}`}
          draggable={false}
          className="max-h-full max-w-full object-contain pointer-events-none drop-shadow-2xl transition-transform duration-75 ease-out"
        />

        {/* Hint banner visible before first interaction */}
        {!isDragging && !isPlaying && (
          <div className="absolute bottom-16 pointer-events-none px-4 py-1.5 bg-slate-900/75 backdrop-blur-md text-white/90 text-xs font-medium rounded-full shadow-lg opacity-80 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
            <RotateCw className="w-3.5 h-3.5 text-dairy-400 animate-spin" />
            <span>Drag or swipe horizontally to rotate</span>
          </div>
        )}
      </div>

      {/* Bottom Floating Controls Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200/80 shadow-lg">
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
            isPlaying
              ? 'bg-dairy-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Spin</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Auto Spin</span>
            </>
          )}
        </button>

        {/* Scrubbing timeline */}
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="0"
            max={totalFrames - 1}
            value={currentIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentIndex(parseInt(e.target.value, 10));
            }}
            className="w-24 sm:w-32 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-dairy-600"
          />
          <span className="text-[11px] font-mono font-medium text-slate-500 w-10 text-right">
            {currentIndex + 1}/{totalFrames}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Product360Viewer;
