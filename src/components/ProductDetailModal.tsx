import { useState } from "react";
import { X, Cpu, Star, ShieldCheck, Box, Info } from "lucide-react";
import { motion } from "motion/react";
import { Product, ColorVariant } from "../types";

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, color: ColorVariant) => void;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [selectedColor, setSelectedColor] = useState<ColorVariant>(product.colors[0]);
  const [activeTab, setActiveTab] = useState<"crafts" | "blueprint" | "volume">("blueprint");
  const [addConfirmed, setAddConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleBagAdd = () => {
    onAddToCart(product, selectedColor);
    setAddConfirmed(true);
    setTimeout(() => setAddConfirmed(false), 2000);
  };

  return (
    <div id="product-modal-root" className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <motion.div
        id="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Core modal window frame */}
      <motion.div
        id="modal-window"
        initial={{ scale: 0.92, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 30 }}
        className="bg-[#0b0b0b] border border-white/[0.05] rounded-[32px] w-full max-w-[1100px] shadow-[0_30px_100px_rgba(0,0,0,0.95)] overflow-hidden relative z-10"
      >
        {/* Dynamic scan line filter representing blueprint style */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-30" />

        <div className="grid grid-cols-1 md:grid-cols-12 md:divide-x md:divide-white/[0.05]">
          
          {/* Left Media rotating stage column */}
          <div id="modal-stage-col" className="md:col-span-6 p-8 flex flex-col justify-between items-center relative min-h-[400px] md:min-h-[550px]">
            {/* Stage heading indicators */}
            <div className="w-full flex items-center justify-between z-10 select-none">
              <span className="text-[10px] font-mono text-[#777777] uppercase tracking-[0.2em]">
                SUMMER STAGE VIEW
              </span>
              <span className="text-[10px] font-mono text-white tracking-[0.1em] px-2.5 py-1 bg-[#1f1f1f] rounded-md">
                TONE: {selectedColor.name.toUpperCase()}
              </span>
            </div>

            {/* Stage Primary rotating image container */}
            <div id="modal-product-stage" className="relative flex-1 flex items-center justify-center my-6 py-6 w-full">
              {/* Technical structural layout circles */}
              <div className="absolute w-[280px] h-[280px] border border-dashed border-[#df7b34]/15 rounded-full animate-[spin_80s_linear_infinite]" />
              <div className="absolute w-[180px] h-[180px] border border-dashed border-white/[0.03] rounded-full" />
              
              {/* Floating micro indicators */}
              <div className="absolute top-10 left-[10%] w-1 bg-[#df7b34] h-6" />
              <div className="absolute top-10 left-[10%] w-6 bg-[#df7b34] h-0.5" />
              
              <motion.img
                key={selectedColor.hex}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                src={product.imageUrl}
                alt={product.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const match = product.id.match(/(\d+)/);
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
                className="w-[85%] h-[85%] object-cover relative z-10 rounded-2xl brightness-[0.95] contrast-[1.05]"
              />
              
              {/* Soft warm orange lighting reflection */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[220px] h-[40px] bg-[#df7b34]/20 rounded-full filter blur-xl shadow-[0_20px_60px_#df7b34]" />
            </div>

            {/* Foot note info */}
            <div className="w-full flex justify-between text-[#777777] text-[9px] font-mono tracking-widest uppercase z-10">
              <span>SUMMER BREEZE CLASS I</span>
              <span>ORGANIC TEXTURE</span>
            </div>
          </div>

          {/* Right Product configurations and specifications column */}
          <div id="modal-specs-col" className="md:col-span-6 p-10 flex flex-col justify-between text-left relative bg-[#090909]/95">
            {/* Close Button absolute positioning */}
            <button
              id="dismiss-detail-modal"
              onClick={onClose}
              className="absolute top-8 right-8 p-2 text-[#777777] hover:text-[#df7b34] border border-white/5 hover:border-[#df7b34]/30 rounded-full transition-all cursor-pointer bg-white/[0.01]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Core Header section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 bg-[#df7b34]/15 text-[#df7b34] tracking-[0.2em] font-mono text-[9px] uppercase rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center gap-1.5 font-mono text-xs text-[#f4a056]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating}</span>
                </div>
              </div>

              <h1 className="font-heading text-5xl text-white tracking-widest uppercase leading-none mb-1">
                {product.name}
              </h1>
              <p className="font-mono text-[#df7b34] text-xl font-semibold mb-6">
                ₹{product.price}
              </p>

              <p className="text-[#b5b5b5] text-sm font-light leading-relaxed mb-8 border-b border-white/[0.05] pb-6">
                {product.description}
              </p>

              {/* Color variant selectors */}
              <div id="modal-variants" className="mb-8">
                <span className="text-[10px] font-mono text-[#777777] uppercase tracking-widest block mb-3">
                  CHOOSE YOUR SUMMER EMBERS
                </span>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => (
                    <button
                      id={`color-preset-${color.name.toLowerCase().replace(" ", "-")}`}
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`h-11 px-4 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                        selectedColor.name === color.name
                          ? "bg-white/[0.03] border-[#df7b34] text-white"
                          : "bg-transparent border-white/[0.05] text-[#777777] hover:text-[#b5b5b5]"
                      }`}
                    >
                      <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: color.hex }} />
                      <span className="text-[10px] uppercase font-mono tracking-widest font-semibold">
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic tabs specifications */}
              <div id="modal-tabs" className="mb-8">
                <div className="flex bg-[#111111] border border-white/[0.05] rounded-xl p-1 mb-5">
                  <button
                    key="blueprint"
                    onClick={() => setActiveTab("blueprint")}
                    className={`flex-1 text-[10px] font-mono tracking-widest py-2.5 rounded-lg transition-all cursor-pointer ${
                      activeTab === "blueprint"
                        ? "bg-[#df7b34] text-white"
                        : "text-[#777777] hover:text-[#b5b5b5]"
                    }`}
                  >
                    SUN-READY MATERIAL
                  </button>
                  <button
                    key="crafts"
                    onClick={() => setActiveTab("crafts")}
                    className={`flex-1 text-[10px] font-mono tracking-widest py-2.5 rounded-lg transition-all cursor-pointer ${
                      activeTab === "crafts"
                        ? "bg-[#df7b34] text-white"
                        : "text-[#777777] hover:text-[#b5b5b5]"
                    }`}
                  >
                    DESIGN & DRAPE
                  </button>
                </div>

                <div className="min-h-[140px] p-5 bg-white/[0.01] border border-white/[0.04] rounded-2xl relative">
                  {activeTab === "blueprint" ? (
                    <div id="blueprint-content" className="flex flex-col gap-4">
                      <div className="flex items-start gap-3">
                        <Cpu className="w-4.5 h-4.5 text-[#df7b34] mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[10px] font-mono text-white tracking-widest block uppercase">
                            BREATHABLE FIBERS
                          </span>
                          <p className="text-xs text-[#b5b5b5] mt-1 leading-relaxed">
                            Interlocked with premium materials: {product.materials.join(", ")}.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Box className="w-4.5 h-4.5 text-[#df7b34] mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[10px] font-mono text-white tracking-widest block uppercase">
                            SUNHEAT PERFORMANCE
                          </span>
                          <p className="text-xs text-[#b5b5b5] mt-1 leading-relaxed">
                            {product.details.insulation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div id="crafts-content" className="flex flex-col gap-4">
                      <div className="flex items-start gap-3">
                        <Info className="w-4.5 h-4.5 text-[#f4a056] mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[10px] font-mono text-white tracking-widest block uppercase">
                            SUMMER FEELING
                          </span>
                          <p className="text-xs text-[#b5b5b5] mt-1 leading-relaxed">
                            {product.details.craftsmanship}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="w-4.5 h-4.5 text-[#f4a056] mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[10px] font-mono text-white tracking-widest block uppercase">
                            SILHOUETTE & FIT
                          </span>
                          <p className="text-xs text-[#b5b5b5] mt-1 leading-relaxed">
                            {product.details.fitting}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Add to Bag core action buttons */}
            <div id="action-bar-bottom" className="pt-6 border-t border-white/[0.05] flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-[#777777] uppercase tracking-wider">YOUR PRICE</span>
                <span className="text-lg font-mono text-white font-medium">₹{product.price}</span>
              </div>
              <button
                id="modal-add-to-cart"
                onClick={handleBagAdd}
                className="flex-1 max-w-[280px] py-4 rounded-full bg-[#df7b34] hover:bg-[#c76622] text-white text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_4px_20px_rgba(223,123,52,0.3)] hover:shadow-[0_4px_28px_rgba(223,123,52,0.5)] cursor-pointer text-center"
              >
                {addConfirmed ? "ADDED TO BAG" : "ADD TO SUMMER BAG"}
              </button>
            </div>

          </div>

        </div>
      </motion.div>
    </div>
  );
}
