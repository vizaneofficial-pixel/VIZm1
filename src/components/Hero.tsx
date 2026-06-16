import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Coffee, Cpu, Disc, Plus, Sparkles, Sliders, Play, Volume2, Shield } from "lucide-react";
import { Product, ColorVariant } from "../types";
import specialProductImage from "../assets/images/regenerated_image_1781589152877.png";

interface HeroProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenStylist: () => void;
  onAddToCart?: (product: Product, color: ColorVariant) => void;
}

// Custom React hook for high-performance automatic background removal (BFS flood fill)
function useAutomaticBackgroundExtractedImage(rawUrl: string, enabled: boolean = true) {
  const [processedUrl, setProcessedUrl] = useState<string>(rawUrl);
  const [isProcessing, setIsProcessing] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setProcessedUrl(rawUrl);
      return;
    }

    let isMounted = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.referrerPolicy = "no-referrer";
    if (rawUrl.startsWith("/api/") || rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
      img.src = `/api/proxy-image?url=${encodeURIComponent(rawUrl)}`;
    } else {
      img.src = rawUrl;
    }

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          if (isMounted) setProcessedUrl(rawUrl);
          return;
        }

        // Downscale slightly for performance while maintaining exceptional resolution
        const maxDim = 800;
        let w = img.naturalWidth || img.width;
        let h = img.naturalHeight || img.height;
        if (w > maxDim || h > maxDim) {
          const ratio = Math.min(maxDim / w, maxDim / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }

        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);

        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // Auto-detect uniform or solid background color by checking corners
        const corners = [
          { r: data[0], g: data[1], b: data[2] }, // Top-left
          { r: data[(w - 1) * 4], g: data[(w - 1) * 4 + 1], b: data[(w - 1) * 4 + 2] }, // Top-right
          { r: data[(h - 1) * w * 4], g: data[(h - 1) * w * 4 + 1], b: data[(h - 1) * w * 4 + 2] }, // Bottom-left
          { r: data[(h - 1) * w * 4 + (w - 1) * 4], g: data[(h - 1) * w * 4 + (w - 1) * 4 + 1], b: data[(h - 1) * w * 4 + (w - 1) * 4 + 2] } // Bottom-right
        ];

        const avgBg = {
          r: Math.round(corners.reduce((sum, c) => sum + c.r, 0) / 4),
          g: Math.round(corners.reduce((sum, c) => sum + c.g, 0) / 4),
          b: Math.round(corners.reduce((sum, c) => sum + c.b, 0) / 4)
        };

        const isBg = new Uint8Array(w * h);
        const queue: number[] = [];
        const visited = new Uint8Array(w * h);

        // Euclidean color distance threshold
        const tolerance = 48;

        const checkColorMatch = (idx: number) => {
          const r = data[idx * 4];
          const g = data[idx * 4 + 1];
          const b = data[idx * 4 + 2];
          const dist = Math.sqrt((r - avgBg.r) ** 2 + (g - avgBg.g) ** 2 + (b - avgBg.b) ** 2);
          return dist < tolerance;
        };

        // Add all edge pixels to seed BFS
        for (let x = 0; x < w; x++) {
          const topIdx = x;
          const botIdx = (h - 1) * w + x;
          if (checkColorMatch(topIdx)) {
            queue.push(topIdx);
            visited[topIdx] = 1;
            isBg[topIdx] = 1;
          }
          if (checkColorMatch(botIdx)) {
            queue.push(botIdx);
            visited[botIdx] = 1;
            isBg[botIdx] = 1;
          }
        }
        for (let y = 0; y < h; y++) {
          const leftIdx = y * w;
          const rightIdx = y * w + (w - 1);
          if (checkColorMatch(leftIdx)) {
            queue.push(leftIdx);
            visited[leftIdx] = 1;
            isBg[leftIdx] = 1;
          }
          if (checkColorMatch(rightIdx)) {
            queue.push(rightIdx);
            visited[rightIdx] = 1;
            isBg[rightIdx] = 1;
          }
        }

        // Traverse background clusters outward to find accurate contours
        let head = 0;
        while (head < queue.length) {
          const idx = queue[head++];
          const cx = idx % w;
          const cy = Math.floor(idx / w);

          const neighbors = [
            { x: cx - 1, y: cy },
            { x: cx + 1, y: cy },
            { x: cx, y: cy - 1 },
            { x: cx, y: cy + 1 }
          ];

          for (const n of neighbors) {
            if (n.x >= 0 && n.x < w && n.y >= 0 && n.y < h) {
              const nIdx = n.y * w + n.x;
              if (visited[nIdx] === 0) {
                visited[nIdx] = 1;
                if (checkColorMatch(nIdx)) {
                  isBg[nIdx] = 1;
                  queue.push(nIdx);
                }
              }
            }
          }
        }

        // Apply alpha masking and feathering edges beautifully
        for (let idx = 0; idx < w * h; idx++) {
          if (isBg[idx] === 1) {
            data[idx * 4 + 3] = 0;
          } else {
            const cx = idx % w;
            const cy = Math.floor(idx / w);
            let bgNeighbors = 0;
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                const nx = cx + dx;
                const ny = cy + dy;
                if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                  const nIdx = ny * w + nx;
                  if (isBg[nIdx] === 1) {
                    bgNeighbors++;
                  }
                }
              }
            }
            if (bgNeighbors > 0) {
              const factor = (9 - bgNeighbors) / 9;
              data[idx * 4 + 3] = Math.round(data[idx * 4 + 3] * factor);
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        if (isMounted) {
          setProcessedUrl(canvas.toDataURL("image/png"));
          setIsProcessing(false);
        }
      } catch (err) {
        console.error("Self-segmentation fallback to direct image:", err);
        if (isMounted) {
          setProcessedUrl(rawUrl);
          setIsProcessing(false);
        }
      }
    };

    img.onerror = () => {
      if (isMounted) {
        setProcessedUrl(rawUrl);
        setIsProcessing(false);
      }
    };

    return () => {
      isMounted = false;
    };
  }, [rawUrl, enabled]);

  return { processedUrl, isProcessing };
}

const SPECIAL_HERO_PRODUCT: Product = {
  id: "fuego-exclusive",
  name: "KINETIC LAVA SHELL",
  price: 7999,
  category: "Outerwear",
  tagline: "Exclusive hyper-performance volcanic storm-gills layer designed for luxury active protection.",
  rating: 5.0,
  materials: ["3-Layer Lava-Sealed Gore-Tex®", "Basalt Reinforced Pocket Gills"],
  colors: [
    { name: "Magma Core Orange", hex: "#df7b34" },
    { name: "Obsidian Black", hex: "#111111" }
  ],
  features: ["Premium volcanic-shield protection", "Thermal dynamic breathability columns", "Adjustable magnetic cuff straps"],
  description: "Crafted exclusively for our limited-release Volcano Drop. A masterwork of luxury technical fashion featuring heavy storm defense, heat-sculpted details, and lightweight atmospheric layers.",
  imageUrl: specialProductImage,
  details: {
    craftsmanship: "Ultrasound-welded structural seams backed with high-performance adhesive tape prevent moisture infiltration along heavy tension folds.",
    insulation: "Exceptional wind-barrier. Multi-layered membrane ensures extreme comfort while remaining remarkably zero-sweat.",
    fitting: "Structured ergonomic silhouette with customizable active cords for beautiful drapery."
  }
};

export default function Hero({ products, onSelectProduct, onOpenStylist, onAddToCart }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Tactical size & color states matching reference image layout
  const [selectedSize, setSelectedSize] = useState<"S" | "M" | "L" | "XL">("M");
  const [selectedColor, setSelectedColor] = useState<"WHITE" | "SILVER" | "ORANGE" | "BLACK">("WHITE");
  const [activeSlide, setActiveSlide] = useState(0);
  const [addConfirmed, setAddConfirmed] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [heroVideoLoaded, setHeroVideoLoaded] = useState(false);

  // High-fidelity timeline sequence states
  const [animationStage, setAnimationStage] = useState<'hidden' | 'introducing' | 'overshoot' | 'settling' | 'idle'>('hidden');
  const [mouseDistance, setMouseDistance] = useState<number>(9999);
  const [approachOffset, setApproachOffset] = useState({ x: 0, y: 0 });
  const [isDirectHover, setIsDirectHover] = useState(false);

  // Set the primary featured product of the Hero page only to the elite exclusive item
  const heroProduct = SPECIAL_HERO_PRODUCT;

  // Run dynamic background isolation
  const { processedUrl } = useAutomaticBackgroundExtractedImage(heroProduct.imageUrl);

  // Custom target references to compute exact physics distance from mouse cursor to product item
  const productRef = useRef<HTMLDivElement>(null);

  // Volumetric particle coordinate templates
  const backgroundParticles = [
    { id: 1, x: -90, y: 80, size: 5, delay: 0.1, duration: 2.1, color: "#df7b34" },
    { id: 2, x: 100, y: -50, size: 7, delay: 0.3, duration: 1.6, color: "#df7b34" },
    { id: 3, x: -120, y: -100, size: 4, delay: 0.05, duration: 2.4, color: "#8c8275" },
    { id: 4, x: 70, y: 110, size: 6, delay: 0.7, duration: 1.9, color: "#df7b34" }
  ];

  const foregroundParticles = [
    { id: 5, x: -50, y: -130, size: 6, delay: 0.2, duration: 2.0, color: "#df7b34" },
    { id: 6, x: 120, y: 70, size: 5, delay: 0.4, duration: 1.8, color: "#8c8275" },
    { id: 7, x: -80, y: 50, size: 7, delay: 0.15, duration: 2.2, color: "#df7b34" },
    { id: 8, x: 60, y: -70, size: 4, delay: 0.5, duration: 1.5, color: "#8c8275" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Set up precise multi-phase campaign load keyframes sequence
  useEffect(() => {
    const hiddenTimer = setTimeout(() => {
      setAnimationStage('introducing');
    }, 300);

    const overshootTimer = setTimeout(() => {
      setAnimationStage('overshoot');
    }, 2100); // 300ms + 1800ms reveal

    const settlingTimer = setTimeout(() => {
      setAnimationStage('settling');
    }, 2250); // 150ms hold

    const idleTimer = setTimeout(() => {
      setAnimationStage('idle');
    }, 2400); // Transitions completely into luxury idle floating

    return () => {
      clearTimeout(hiddenTimer);
      clearTimeout(overshootTimer);
      clearTimeout(settlingTimer);
      clearTimeout(idleTimer);
    };
  }, []);

  // Compute fluid non-snapping mouse approach & magnetic vectors
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!productRef.current) return;
      const rect = productRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      setMouseDistance(dist);
      if (dist < 250) {
        setApproachOffset({
          x: dx / 250,
          y: dy / 250
        });
      } else {
        setApproachOffset({ x: 0, y: 0 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Programmatic playback helper to bypass aggressive client iframe autoplay policies
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay blocked or video element stalled:", err);
      });
    }
  }, []);

  const handleAcquire = () => {
    setAddConfirmed(true);
    const activeColor = heroProduct.colors[0] || { name: "Default", hex: "#eee" };
    if (onAddToCart) {
      onAddToCart(heroProduct, activeColor);
    }
    setTimeout(() => setAddConfirmed(false), 2000);
  };

  const handleProductClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const showcaseSection = document.getElementById("showcase");
    if (showcaseSection) {
      showcaseSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Parallax calculations targeting exactly 25% slower scroll depth offset
  const translateY = scrollY * 0.25;

  // Compute luxury active approach mathematical constants mapped onto the style layers
  const proximityStrength = Math.max(0, 1 - mouseDistance / 250);
  const tiltX = approachOffset.y * -4;
  const tiltY = approachOffset.x * 4;
  
  let activeScale = 1.0;
  if (isDirectHover) {
    activeScale = 1.05;
  } else if (mouseDistance < 250) {
    activeScale = 1.0 + (proximityStrength * 0.03);
  }

  const translateZ = isDirectHover ? "30px" : "0px";

  const productBlock = (
    <div className="relative flex flex-col items-center w-full max-w-[620px] lg:max-w-[840px] xl:max-w-[920px] mx-auto select-none pointer-events-auto">
      {/* Background radial glowing aura / soft lighting element mimicking the volcano glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial-gradient from-[#df7b34]/15 via-[#df7b34]/2 to-transparent blur-3xl rounded-full scale-125 pointer-events-none select-none z-0 transition-opacity duration-[1000ms]" 
        style={{
          opacity: animationStage === 'hidden' ? 0 : (isDirectHover ? 1 : 0.45 + proximityStrength * 0.3),
        }}
      />
      
      {/* Outer Wrapper 1: Handles scroll parallax slow translation depth */}
      <motion.div
        style={{ y: translateY }}
        className="w-full flex flex-col items-center relative z-10"
      >
        {/* Wrapper 2: Entrance and Settling Sequence Layer */}
        <motion.div
          initial="hidden"
          animate={
            animationStage === 'hidden' 
              ? "hidden" 
              : animationStage === 'introducing' 
              ? "entering" 
              : animationStage === 'overshoot' 
              ? "overshoot" 
              : animationStage === 'settling' 
              ? "settling" 
              : "idle"
          }
          variants={{
            hidden: {
              opacity: 0,
              scale: 0.75,
              y: 120,
              x: 80,
              rotateZ: -8,
              rotateY: 18,
              filter: "blur(18px)",
            },
            entering: {
              opacity: 1,
              scale: 1.02, // overshoot target
              y: 0,
              x: 0,
              rotateZ: -5,
              rotateY: 0,
              filter: "blur(0px)",
            },
            overshoot: {
              scale: 1.02,
              y: 0,
              x: 0,
              rotateZ: -5,
              rotateY: 0,
            },
            settling: {
              scale: 1.00,
              y: 0,
              x: 0,
              rotateZ: -5,
              rotateY: 0,
            },
            idle: {
              opacity: 1,
              scale: 1.00,
              y: 0,
              x: 0,
              rotateZ: -5,
              rotateY: 0,
              filter: "blur(0px)",
            }
          }}
          transition={{
            hidden: { duration: 0 },
            entering: { duration: 1.8, ease: [0.16, 1, 0.3, 1] },
            overshoot: { duration: 0.15, ease: "easeOut" },
            settling: { duration: 0.15, ease: "easeOut" },
            idle: { duration: 0.3, ease: "easeInOut" }
          }}
          className="w-full flex flex-col items-center"
        >
          {/* Wrapper 3: Mouse Proximity, Magnetic Tilt & Direct Hover Layer */}
          <div
            ref={productRef}
            onMouseEnter={() => setIsDirectHover(true)}
            onMouseLeave={() => setIsDirectHover(false)}
            className="w-full flex flex-col items-center cursor-pointer relative"
            style={{
              transformStyle: "preserve-3d",
              transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(-5deg) scale(${activeScale}) translateZ(${translateZ})`,
              transition: animationStage === 'idle' 
                ? "transform 900ms cubic-bezier(0.16, 1, 0.3, 1), filter 900ms cubic-bezier(0.16, 1, 0.3, 1)" 
                : "none",
              willChange: "transform",
            }}
            onClick={handleProductClick}
          >
            {/* Background Volumetric Particle Depth-Planes (Ember / Ash behind item) */}
            <div 
              className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-[2000ms] ease-out"
              style={{
                opacity: (animationStage === 'introducing' || animationStage === 'overshoot' || animationStage === 'settling') ? 1 : 0
              }}
            >
              {backgroundParticles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: p.x, y: p.y + 110, opacity: 0, scale: 0.4 }}
                  animate={{
                    y: p.y - 140,
                    opacity: [0, 0.85, 0],
                    scale: [0.4, 1.25, 0.4],
                    rotate: [0, 180]
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                  className="absolute rounded-full blur-[1px]"
                  style={{
                    width: p.size,
                    height: p.size,
                    backgroundColor: p.color,
                    boxShadow: p.color === "#df7b34" ? "0 0 10px #df7b34" : "none"
                  }}
                />
              ))}
            </div>

            {/* Soft floor-cast shadow layer scaling listlessly with the floating loop */}
            <motion.div
              animate={animationStage === 'idle' ? { 
                scale: [1, 0.94, 1, 0.94, 1],
                opacity: [0.4, 0.25, 0.4, 0.25, 0.4],
                filter: ["blur(14px)", "blur(18px)", "blur(14px)", "blur(18px)", "blur(14px)"]
              } : {}}
              transition={{
                duration: 8.0,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[75%] h-6 bg-black rounded-full pointer-events-none select-none z-0 mix-blend-multiply transition-all duration-300"
            />

            {/* Wrapper 4 (Inner): Infinite luxury floating, drifts and breathing scales */}
            <motion.div
              animate={animationStage === 'idle' ? { 
                y: [0, -6, 0, 6, 0],
                x: [0, 2, 0, -2, 0],
                rotate: [-5, -4.5, -5, -5.5, -5],
                scale: [1, 1.005, 1, 1.005, 1]
              } : {}}
              transition={{
                y: { duration: 8.0, ease: "easeInOut", repeat: Infinity },
                x: { duration: 10.0, ease: "easeInOut", repeat: Infinity },
                rotate: { duration: 9.0, ease: "easeInOut", repeat: Infinity },
                scale: { duration: 6.0, ease: "easeInOut", repeat: Infinity },
              }}
              className="relative w-full flex flex-col items-center"
            >
              {/* Image element with glowing rim lighting styled cleanly */}
              <div className="relative flex justify-center items-center w-full z-10 p-4 lg:p-0 lg:pt-[13px] lg:ml-[100px] lg:mr-[90px] lg:mt-0 lg:mb-[80px] lg:w-[800px] lg:h-[600px]">
                {/* Embedded volumetric back ambient lava reflections */}
                <div 
                  className="absolute inset-0 rounded-full bg-[#df7b34]/6 blur-3xl transition-opacity duration-1000 pointer-events-none" 
                  style={{
                    opacity: isDirectHover ? 1.0 : (mouseDistance < 250 ? 0.6 + proximityStrength * 0.4 : 0.6),
                  }}
                />
                
                {/* Soft glow edge accent overlay on hover */}
                <div 
                  className="absolute inset-12 rounded-full bg-[#df7b34]/10 blur-2xl transition-opacity duration-1000 pointer-events-none" 
                  style={{
                    opacity: isDirectHover ? 1.0 : 0,
                  }}
                />
                
                <img
                  src={processedUrl}
                  alt={heroProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-contain select-none pointer-events-none transition-all duration-500 max-h-[78vh]"
                  style={{
                    filter: animationStage === 'hidden' 
                      ? "none" 
                      : `drop-shadow(0 25px 50px rgba(0,0,0,${isDirectHover ? 0.95 : 0.85 + proximityStrength * 0.1})) drop-shadow(0 0 ${isDirectHover ? 35 : 28}px rgba(223,123,52,${isDirectHover ? 0.8 : 0.45 + proximityStrength * 0.25}))`,
                  }}
                />
              </div>
            </motion.div>

            {/* Foreground Volumetric Particle Depth-Planes (Ember / Ash in front of item) */}
            <div 
              className="absolute inset-0 pointer-events-none z-[20] transition-opacity duration-[2000ms] ease-out"
              style={{
                opacity: (animationStage === 'introducing' || animationStage === 'overshoot' || animationStage === 'settling') ? 1 : 0
              }}
            >
              {foregroundParticles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: p.x, y: p.y + 110, opacity: 0, scale: 0.4 }}
                  animate={{
                    y: p.y - 140,
                    opacity: [0, 0.85, 0],
                    scale: [0.4, 1.25, 0.4],
                    rotate: [0, -180]
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                  className="absolute rounded-full blur-[0.5px]"
                  style={{
                    width: p.size,
                    height: p.size,
                    backgroundColor: p.color,
                    boxShadow: p.color === "#df7b34" ? "0 0 8px #df7b34" : "none"
                  }}
                />
              ))}
            </div>

          </div>
        </motion.div>
      </motion.div>
    </div>
  );

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#000000] flex flex-col justify-between overflow-hidden pt-36 px-[6vw] pb-10"
    >
      {/* 
        ================ BACKGROUND VIDEO ELEMENT ================
        Provides space for a background video loop. Dimmed and configured to play seamlessly.
      */}      <div className="absolute inset-0 z-0 overflow-hidden select-none bg-black">
        {/* Sleek volumetric black gradient layer to maintain high readability and smooth fading */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/40 to-[#000000] z-10 pointer-events-none" />
        {/* Modern blur + dark overlay layer directly above the background video but under text/content */}
        <div className="absolute inset-0 backdrop-blur-[1px] bg-black/20 z-[5] pointer-events-none" />
        
        {/* Pulsing Volcanic Glow Overlay syncing with campaign load sequence */}
        <div 
          className="absolute inset-0 z-[6] pointer-events-none transition-all duration-[1800ms] ease-out"
          style={{
            background: animationStage === 'introducing' 
              ? 'radial-gradient(circle at center, rgba(223,123,52,0.4) 0%, transparent 70%)'
              : 'radial-gradient(circle at center, rgba(223,123,52,0.15) 0%, transparent 60%)',
            mixBlendMode: 'screen'
          }}
        />

        {/* High-quality compressed volcanic placeholder image that cross-fades into the high performance video loop */}
        <div 
          className={`absolute inset-0 z-[2] transition-opacity duration-[1500ms] ease-out pointer-events-none ${
            heroVideoLoaded ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* High-resolution highly-compressed Unsplash volcanic image (Loaded instantly at sub-80KB) */}
          <img
            src="https://images.unsplash.com/photo-1619266465172-02a857c3556d?auto=format&fit=crop&w=1920&q=45"
            alt="Lava flow loader preview"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-[0.70] contrast-[1.15] blur-[2px]"
          />
          {/* Dense, technical ambient black-orange linear and radial gradients matching Vizm1 basalt signature */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#100703]/85 via-black/40 to-black z-[3]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(223,123,52,0.1)_0%,transparent_70%)] animate-pulse z-[4] mix-blend-screen" />
        </div>

        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onCanPlay={() => setHeroVideoLoaded(true)}
          className={`w-full h-full object-cover filter brightness-[0.95] contrast-[1.2] scale-102 z-[1] relative transition-opacity duration-1000 ease-out ${
            heroVideoLoaded ? "opacity-75" : "opacity-0"
          }`}
        >
          {/* High-fidelity slow atmospheric particle flow loop fallback (Highly optimized and preloaded) */}
          <source 
            src="https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c022718cf39cc03310fed93708e12cb1&profile_id=139&oauth2_token_id=57447761" 
            type="video/mp4" 
          />
          {/* Primary high-fidelity active loop from Google Labs Flow shared stream */}
          <source 
            src="https://labs.google/fx/api/og-video/shared/bbf54c40-b51a-4823-99a6-e85d8445b74d" 
            type="video/mp4" 
          />
          {/* Direct high-fidelity active volcano eruption loop backup fallback */}
          <source 
            src="https://assets.mixkit.co/videos/preview/mixkit-lava-eruption-from-a-volcano-in-chile-43306-large.mp4" 
            type="video/mp4" 
          />
        </video>
      </div>

      {/* 
        ================ "BLUR ABOVE" CINEMATIC GRADIENT LAYER ================
        As request: "blur above just like the picture" to filter the top menu area.
      */}
      <div 
        className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-black via-black/40 to-transparent backdrop-blur-[12px] z-10 pointer-events-none border-b border-white/[0.01]" 
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)"
        }}
      />
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/30 to-transparent backdrop-blur-[6px] z-10 pointer-events-none" 
        style={{
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)",
          maskImage: "linear-gradient(to top, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)"
        }}
      />

      {/* Technical coordinate grids overlay */}
      <div className="absolute inset-x-[6vw] top-32 bottom-20 border border-white/[0.03] pointer-events-none z-10 select-none">
        {/* Corner lines and alignment ticks */}
        <span className="absolute top-0 left-0 w-3 h-[1px] bg-[#df7b34]" />
        <span className="absolute top-0 left-0 w-[1px] h-3 bg-[#df7b34]" />
        <span className="absolute top-0 right-0 w-3 h-[1px] bg-[#df7b34]" />
        <span className="absolute top-0 right-0 w-[1px] h-3 bg-[#df7b34]" />
        <span className="absolute bottom-0 left-0 w-3 h-[1px] bg-[#df7b34]" />
        <span className="absolute bottom-0 left-0 w-[1px] h-3 bg-[#df7b34]" />
        <span className="absolute bottom-0 right-0 w-3 h-[1px] bg-[#df7b34]" />
        <span className="absolute bottom-0 right-0 w-[1px] h-3 bg-[#df7b34]" />
      </div>

      {/* 
        ================ CORE HERO CONTROLS SPLIT GRID ================
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-between w-full h-full my-auto z-20 relative">
        
        {/* 
          1. LEFT SIDE: EDITORIAL SIZED TYPOGRAPHY & CHRONO CONTROLS
        */}
        <div id="hero-left-editorial" className="lg:col-span-5 flex flex-col items-start gap-6 select-none text-left pt-6 lg:pt-0">
          
          <div className="relative">
            <h1 className="font-heading text-8xl md:text-9xl tracking-[0.02em] leading-[0.85] text-white uppercase font-black">
              <motion.span 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                COLLECTION
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="block text-white"
              >
                VOLCANO DROP<span className="text-xs font-sans align-top relative top-5 ml-1 select-none text-[#df7b34]">™</span>
              </motion.span>
            </h1>
          </div>

          {/* Mobile / Tablet floating product view (placed beneath the heading but above sizing/CTA controls) */}
          <div className="w-full lg:hidden my-4">
            {productBlock}
          </div>

          {/* Interactive specification select lists */}
          <div className="w-full max-w-[420px] mt-6 flex flex-col gap-5 border-t border-b border-white/[0.08] py-6 mb-4">
            
            {/* Horizontal inline size list */}
            <div className="flex items-center">
              <span className="font-mono text-[16px] text-[#777777] tracking-[0.25em] w-24 uppercase font-semibold pl-[-9px] ml-[7px] text-center leading-[23px]">
                SIZE
              </span>
              <div className="flex items-center gap-7 ml-[40px] text-[23px]">
                {(["S", "M", "L", "XL"] as const).map((size) => (
                  <button
                    id={`hero-size-btn-${size.toLowerCase()}`}
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`font-mono text-xs tracking-[0.15em] transition-all cursor-pointer relative pb-1 min-w-[20px] text-center ${
                      selectedSize === size
                        ? "text-white font-bold"
                        : "text-[#777777] hover:text-[#b5b5b5]"
                    }`}
                  >
                    {size}
                    {selectedSize === size && (
                      <motion.span
                        layoutId="activeHeroSizeBorder"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#df7b34]"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* 
            ================ BOTTOM LEFT ACQUIRE ACTION ================
            Circular thin-line wireframe layout with dynamic arrow and pricing tags.
          */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center gap-10 mt-2"
          >
            <button
               id="hero-add-to-cart-circular"
              onClick={handleAcquire}
              className="flex items-center gap-6 group cursor-pointer text-left py-2"
            >
              {/* Spinning technical vector loop dial */}
              <div className="relative w-16 h-16 rounded-full border border-white/60 hover:border-[#df7b34] flex items-center justify-center transition-all bg-white/[0.02] hover:bg-[#df7b34]/15 shadow-[0_0_15px_rgba(255,255,255,0.01)] group-hover:shadow-[0_0_25px_rgba(223,123,52,0.25)]">
                {/* Embedded dynamic rotation track */}
                <div className="absolute inset-0 rounded-full border border-dashed border-[#df7b34]/0 group-hover:border-[#df7b34]/40 group-hover:animate-[spin_20s_linear_infinite]" />
                
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5 text-white group-hover:text-[#df7b34] transition-colors translate-x-px -translate-y-px"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              
              <div className="flex flex-col select-none">
                <span className="font-mono text-[9px] text-[#777777] block uppercase tracking-[0.25em] mb-1">
                  {addConfirmed ? "ADDED" : "ADD TO BAG"}
                </span>
                <span className="font-sans text-3xl font-black text-white tracking-widest leading-none">
                  {addConfirmed ? "ADDED OK" : `₹${heroProduct.price + (selectedSize === "XL" ? 500 : 0)}`}
                </span>
              </div>
            </button>
          </motion.div>

        </div>

        {/* 
          2. RIGHT SIDE: DETAILED PNG PRODUCT FLOATING (LATEST DROP)
          Occupies approximately 40-50% of the split layout on desktop.
        */}
        <div className="hidden lg:flex lg:col-span-7 justify-center items-center h-full relative z-20">
          {productBlock}
        </div>

      </div>

      {/* Decorative Editorial Bottom Navigation */}
      <div id="hero-editorial-footer" className="w-full flex flex-col md:flex-row items-center justify-between border-t border-white/[0.05] pt-5 mt-4 text-[#777777] text-[9.5px] font-mono tracking-[0.25em] uppercase z-20">
        <div>DESIGNED IN TOKYO</div>
      </div>
    </section>
  );
}
