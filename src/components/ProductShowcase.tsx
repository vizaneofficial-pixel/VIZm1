import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, Layers, ArrowUpRight, ShieldCheck, Star } from "lucide-react";
import { Product } from "../types";

interface ProductShowcaseProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, color: any) => void;
}

export default function ProductShowcase({
  products,
  onSelectProduct,
  onAddToCart,
}: ProductShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [scrollY, setScrollY] = useState(0);
  const [sectionTop, setSectionTop] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showcaseVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      setSectionTop(sectionRef.current.offsetTop);
    }
    const handleResize = () => {
      if (sectionRef.current) {
        setSectionTop(sectionRef.current.offsetTop);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (showcaseVideoRef.current) {
      showcaseVideoRef.current.muted = true;
      showcaseVideoRef.current.play().catch((err) => {
        console.warn("Showcase autoplay blocked:", err);
      });
    }
  }, []);

  const categories = ["ALL", "Outerwear", "Mid-Layer"];

  const filteredProducts =
    activeCategory === "ALL"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const parallaxY = (scrollY - sectionTop) * 0.22;

  const atmosphereParticles = [
    { id: "p1", type: "ash", left: "15%", top: "15%", size: 4, duration: 18, delay: 0 },
    { id: "p2", type: "ember", left: "45%", top: "70%", size: 5, duration: 12, delay: 2, color: "#df7b34" },
    { id: "p3", type: "ash", left: "75%", top: "10%", size: 3, duration: 22, delay: 5 },
    { id: "p4", type: "spark", left: "30%", top: "80%", size: 6, duration: 8, delay: 1, color: "#f4a056" },
    { id: "p5", type: "ash", left: "60%", top: "45%", size: 5, duration: 15, delay: 3 },
    { id: "p6", type: "ember", left: "85%", top: "55%", size: 4, duration: 14, delay: 7, color: "#df7b34" },
    { id: "p7", type: "spark", left: "10%", top: "65%", size: 5, duration: 10, delay: 4, color: "#f4a056" },
    { id: "p8", type: "ash", left: "90%", top: "25%", size: 4, duration: 20, delay: 2 },
  ];

  return (
    <section
      id="showcase"
      ref={sectionRef}
      className="relative w-full bg-transparent pt-28 px-[6vw] pb-36 overflow-hidden"
    >
      {/* Editorial Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[#090909]/15 pointer-events-none z-[10]">
        <div className="absolute top-0 bottom-0 left-[20%] w-[1px] bg-white/[0.02]" />
        <div className="absolute top-0 bottom-0 left-[40%] w-[1px] bg-white/[0.02]" />
        <div className="absolute top-0 bottom-0 left-[60%] w-[1px] bg-white/[0.02]" />
        <div className="absolute top-0 bottom-0 left-[80%] w-[1px] bg-white/[0.02]" />
      </div>

      <div className="relative z-20 max-w-[1400px] mx-auto">
        
        {/* Editorial Subtitle & Title */}
        <div id="showcase-header" className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-20">
          <div className="text-left">
            <h2 className="font-heading text-6xl md:text-7xl xl:text-8xl tracking-tight leading-none text-white uppercase">
              EXPLOSIVE SUMMER <br />
              <span className="text-white/20">VOLCANO ERUPTION</span>
            </h2>
          </div>

          {/* Filtering Tabs */}
          <div id="category-scroller" className="flex flex-wrap gap-2.5 bg-white/[0.02] border border-white/[0.05] p-1.5 rounded-full backdrop-blur-md">
            {categories.map((cat) => (
              <button
                id={`filter-${cat.toLowerCase().replace(" ", "-")}`}
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 text-[10px] uppercase tracking-widest font-semibold rounded-full cursor-pointer transition-all duration-500 ${
                  activeCategory === cat
                    ? "bg-[#df7b34] text-white shadow-[0_4px_16px_rgba(223,123,52,0.4)]"
                    : "text-[#777777] hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid Layout */}
        <div id="products-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((p, index) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 55 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative h-[600px] bg-[rgba(15,15,15,0.15)] hover:bg-[rgba(20,20,20,0.20)] border border-white/[0.05] hover:border-[#df7b34]/30 rounded-[28px] p-6 flex flex-col justify-between overflow-hidden backdrop-blur-md cursor-pointer transition-all duration-[900ms] shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
                onClick={() => onSelectProduct(p)}
              >
                {/* Embedded Volumetric background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-[#df7b34]/0 group-hover:bg-[#df7b34]/[0.02] filter blur-[40px] pointer-events-none transition-all duration-[900ms] ease-out-cubic" />

                {/* Card Top Information */}
                <div id="card-top" className="flex items-start justify-between z-10 select-none">
                  <div>
                    <span className="text-[10px] font-mono text-[#777777] uppercase block tracking-wider">
                      {p.category} // VOLCANIC DROP
                    </span>
                    <h3 className="font-heading text-3xl text-white tracking-widest mt-1 uppercase leading-none">
                      {p.name.split(" ").slice(0, 2).join(" ")} <br />
                      <span className="text-[#df7b34]">{p.name.split(" ").slice(2).join(" ")}</span>
                    </h3>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 font-mono text-xs">
                    <span className="text-white text-base font-medium">₹{p.price}</span>
                    <div className="flex items-center gap-1 text-[#f4a056] scale-90">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{p.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Focused Centered Suspended Image Layout */}
                <div id="card-media" className="relative flex-1 flex justify-center items-center overflow-hidden w-full my-6">
                  {/* Subtle realistic circular background grid outline */}
                  <div className="absolute w-[220px] h-[220px] border border-dashed border-white/[0.03] rounded-full group-hover:border-[#df7b34]/10 transition-colors duration-[900ms] pointer-events-none" />

                  <motion.img
                    src={p.imageUrl}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const match = p.id.match(/(\d+)/);
                      const digit = match ? match[1] : "0";
                      const fallbacks: Record<string, string> = {
                        "1": "https://labs.google/fx/api/og-image/shared/29ddf9e7-7e0d-4a23-a49e-35089831ea52",
                        "2": "https://labs.google/fx/api/og-image/shared/ac6a0d42-070d-4132-819f-e3c25370c757",
                        "3": "https://labs.google/fx/api/og-image/shared/b135334c-0817-45e1-8cca-2a33d03cf6bf",
                        "4": "https://labs.google/fx/api/og-image/shared/c06d01a2-f6fc-4f1b-9aa6-ce8a4f4c7e75",
                        "5": "https://labs.google/fx/api/og-image/shared/1bc71bcd-d05d-4074-ac10-2da953dd0eb7",
                        "6": "https://labs.google/fx/api/og-image/shared/ffd23870-78fb-4f78-b410-e3080151cfd2",
                        "7": "https://labs.google/fx/api/og-image/shared/24802d27-9e15-40e5-9de6-a61487f3e1d3",
                        "8": "https://labs.google/fx/api/og-image/shared/01f96fac-7f3e-43f9-b832-14ebed38f208"
                      };
                      const fallbackVal = fallbacks[digit] || "https://labs.google/fx/api/og-image/shared/29ddf9e7-7e0d-4a23-a49e-35089831ea52";
                      if (e.currentTarget.src !== fallbackVal) {
                        e.currentTarget.src = fallbackVal;
                      }
                    }}
                    className="w-[85%] h-[85%] object-cover brightness-[0.95] contrast-[1.05] group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-1 group-hover:brightness-[1.05] rounded-xl duration-[900ms] z-10 ease-out-cubic transition-all border border-transparent group-hover:border-white/[0.05] shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
                  />
                  
                  {/* Interactive Explore Overlay Text */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-[800ms] flex items-center justify-center rounded-[20px] z-20 backdrop-blur-xs">
                    <div className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full font-semibold font-sans text-[10px] tracking-widest uppercase">
                      <Eye className="w-3.5 h-3.5" /> EXPLORE HOT STYLE
                    </div>
                  </div>
                </div>

                {/* Card Bottom Meta Data */}
                <div id="card-bottom" className="border-t border-white/[0.04] pt-4 flex items-center justify-between z-10">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-mono text-[#777777] uppercase tracking-wider">FABRIC HEAT</span>
                    <span className="text-xs text-[#b5b5b5] uppercase tracking-wider max-w-[180px] truncate">
                      {p.materials[0]}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Tiny visual representation of product options */}
                    <div className="flex gap-1.5">
                      {p.colors.map((color) => (
                        <div
                          key={color.name}
                          className="w-2.5 h-2.5 rounded-full border border-white/20"
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                    </div>

                    <div className="w-8 h-8 rounded-full border border-white/10 group-hover:border-[#df7b34] flex items-center justify-center transition-all duration-[900ms] bg-[#090909]">
                      <ArrowUpRight className="w-4 h-4 text-[#777777] group-hover:text-[#df7b34] group-hover:rotate-45 transition-transform duration-500" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        

      </div>
    </section>
  );
}
