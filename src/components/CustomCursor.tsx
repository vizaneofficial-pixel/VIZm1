import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CustomCursor() {
  const [cursorType, setCursorType] = useState<"default" | "hover" | "image" | "hidden">("default");
  
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 220, mass: 0.6 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Hide native cursor only for desktop devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      setCursorType("hidden");
      return;
    }

    document.body.style.cursor = "none";

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Check for hover types
      const isInteractive = 
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.closest("button") || 
        target.closest("a") ||
        target.classList.contains("cursor-pointer") ||
        target.closest(".cursor-pointer");

      const isImage = target.tagName === "IMG" || target.closest(".image-hover-target");

      if (isImage) {
        setCursorType("image");
      } else if (isInteractive) {
        setCursorType("hover");
      } else {
        setCursorType("default");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (cursorType === "hidden") return null;

  return (
    <>
      {/* Laser point center core */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          pointerEvents: "none",
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: cursorType === "hover" ? 0.4 : cursorType === "image" ? 2.5 : 1,
          backgroundColor: cursorType === "hover" ? "#ffffff" : "#df7b34",
        }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="fixed top-0 left-0 w-4 h-4 rounded-full z-[99999] mix-blend-difference will-change-transform"
      />

      {/* Outer ambient energy tracking circle */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          pointerEvents: "none",
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: cursorType === "hover" ? 1.6 : cursorType === "image" ? 2.4 : 1,
          borderColor: cursorType === "hover" ? "#ffffff" : "#df7b34",
          opacity: cursorType === "image" ? 0.4 : 0.8,
        }}
        transition={{ type: "spring", stiffness: 220, damping: 25 }}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#df7b34] z-[99998] shadow-[0_0_12px_rgba(223,123,52,0.3)] pointer-events-none will-change-transform"
      />
    </>
  );
}
