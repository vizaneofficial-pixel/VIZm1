import { useState } from "react";
import { Sparkles, ArrowRight, Layers, Cpu, Compass, RotateCw, CheckCircle, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product, StylistResponse } from "../types";

interface AIStylistProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export default function AIStylist({
  products,
  isOpen,
  onClose,
  onSelectProduct,
}: AIStylistProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stylistResult, setStylistResult] = useState<StylistResponse | null>(null);

  const sampleQueries = [
    { text: "Ultra-breathable linen tee for hot beach lava days", label: "Volcano Breeze" },
    { text: "Fiery orange lightweight shorts ready for sun", label: "Magma Shorts" },
    { text: "Light beach-party ready custom graphic cotton tees", label: "Eruption Tee" },
    { text: "Breezy thin layers to wear over a summer tank top", label: "Sunny Venting" }
  ];

  const handleConsultStylist = async (userQuery: string) => {
    if (!userQuery.trim()) return;
    setIsLoading(true);
    setQuery(userQuery);

    try {
      const response = await fetch("/api/stylist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery }),
      });
      const data = await response.json();
      setStylistResult(data);
    } catch (error) {
      console.error("Failed to query stylist:", error);
      // Fallback response with beautiful modular content in case network fails
      setStylistResult({
        curationExplanation: "System matched GORE-TEX and technical shell matrix. Layering the primary protective system delivers complete moisture protection while maintaining zero constraint over kinematic locomotion.",
        recommendedProductIds: ["sys-04", "apx-09"],
        craftsmanshipInsight: "Ultrasound-welded structural seams backed with high-performance adhesive tape prevent moisture infiltration along heavy tension folds.",
        outfitTagline: "DEDICATED ALL-SEASON DEFENSE SYSTEM"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Resolve recommended products from the catalog IDs
  const recommendedProducts = stylistResult
    ? products.filter((p) => stylistResult.recommendedProductIds.includes(p.id))
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            id="stylist-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
          />

          {/* Core Stylist Drawer/Panel */}
          <motion.div
            id="stylist-panel"
            initial={{ x: "100%", opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 150 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full md:w-[600px] bg-[#090909]/95 border-l border-white/[0.05] shadow-[0_0_100px_rgba(0,0,0,0.9)] p-8 overflow-y-auto flex flex-col justify-between"
          >
            {/* Drawer Top Header */}
            <div>
              <div id="stylist-header-meta" className="flex items-center justify-between border-b border-white/[0.05] pb-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#df7b34]/10 rounded-lg">
                    <Sparkles className="w-5 h-5 text-[#df7b34] animate-pulse" />
                  </div>
                  <div className="text-left">
                    <span className="font-mono text-[9px] text-[#777777] uppercase tracking-[0.25em] block">
                      SUMMER ENERGY // INSTANT STYLIST
                    </span>
                    <h2 className="font-heading text-3xl tracking-wide text-white">
                      VOLCANIC SUMMER STYLIST
                    </h2>
                  </div>
                </div>
                <button
                  id="close-stylist-drawer"
                  onClick={onClose}
                  className="font-mono text-[10px] text-[#777777] hover:text-[#df7b34] tracking-widest uppercase py-2 px-3 border border-white/[0.05] hover:border-[#df7b34]/30 rounded-full transition-all cursor-pointer"
                >
                  DISMISS // [ESC]
                </button>
              </div>

              {/* Freeform Styled Semantic Search Bar */}
              <div id="freeform-search-box" className="mb-8">
                <span className="text-[10px] font-mono text-[#777777] uppercase tracking-widest block mb-2.5">
                  DESCRIBE YOUR SUMMER VIBE & SOLAR HEAT GOALS
                </span>
                <div className="relative">
                  <input
                    id="stylist-text-input"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. Linen shirt with beach-venting mesh..."
                    className="w-full bg-[#111111]/80 hover:bg-[#181818]/60 focus:bg-[#181818]/90 border border-white/[0.05] focus:border-[#df7b34]/60 rounded-xl px-5 py-4 text-sm font-sans text-white placeholder-[#777777] outline-none transition-all pr-12"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleConsultStylist(query);
                    }}
                  />
                  <button
                    id="submit-stylist-query"
                    onClick={() => handleConsultStylist(query)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-2 bg-[#df7b34] hover:bg-[#c76622] text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Pre-canned Aesthetic Preset Badges */}
              <div id="stylist-presets" className="mb-10 text-left">
                <span className="text-[10px] font-mono text-[#777777] uppercase tracking-widest block mb-3">
                  HOT SUMMER PRESETS
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {sampleQueries.map((item, idx) => (
                    <button
                      id={`preset-query-${idx}`}
                      key={idx}
                      onClick={() => handleConsultStylist(item.text)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-white/[0.02] border border-white/[0.04] hover:border-[#df7b34]/30 rounded-lg hover:bg-[#df7b34]/5 text-[#b5b5b5] hover:text-[#f4a056] text-xs font-medium cursor-pointer transition-all duration-300"
                    >
                      <Search className="w-3 h-3 text-[#777777]" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Output Presentation */}
              <AnimatePresence mode="wait">
                {isLoading ? (
                  /* Cyber scanning animation */
                  <motion.div
                    id="stylist-loading-matrix"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-8 border border-[#df7b34]/10 bg-[#111111]/40 rounded-2xl flex flex-col items-center justify-center gap-4 text-center select-none"
                  >
                    <RotateCw className="w-8 h-8 text-[#df7b34] animate-spin" />
                    <div>
                      <span className="font-mono text-xs tracking-widest text-[#f4a056] block animate-pulse">
                        IGNITING STYLE ENGINE // FIERY SEARCH
                      </span>
                      <p className="text-[10px] font-mono text-[#777777] uppercase tracking-wider mt-1.5">
                        Stirring up hot volcanic summer combinations for you...
                      </p>
                    </div>
                  </motion.div>
                ) : stylistResult ? (
                  /* Render Stylist Cured Output details */
                  <motion.div
                    id="stylist-report-output"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6 text-left"
                  >
                    {/* Header Slogan Accent */}
                    <div className="p-4 border border-[#df7b34]/20 bg-[#df7b34]/5 rounded-xl">
                      <span className="text-[9px] font-mono text-[#f4a056] uppercase block tracking-widest mb-1">
                        YOUR MOLTEN HOT LOOK
                      </span>
                      <h4 className="font-heading text-2xl text-white tracking-widest uppercase">
                        {stylistResult.outfitTagline}
                      </h4>
                    </div>

                    {/* Editorial Description Card */}
                    <div className="p-5 bg-white/[0.02] border border-white/[0.04] rounded-xl relative">
                      <Layers className="absolute right-4 top-4 w-4 h-4 text-[#777777] opacity-40" />
                      <span className="text-[9px] font-mono text-[#777777] uppercase tracking-wider block mb-2">
                        SUMMER STYLIST CURATION
                      </span>
                      <p className="text-sm text-[#b5b5b5] font-light leading-relaxed">
                        {stylistResult.curationExplanation}
                      </p>
                    </div>

                    {/* Recommended products matching grid */}
                    <div>
                      <span className="text-[10px] font-mono text-[#777777] uppercase tracking-widest block mb-4">
                        HOT SUN-READY ITEMS ({recommendedProducts.length})
                      </span>
                      <div className="flex flex-col gap-3">
                        {recommendedProducts.map((p) => (
                          <div
                            id={`stylist-rec-${p.id}`}
                            key={p.id}
                            onClick={() => {
                              onSelectProduct(p);
                              onClose();
                            }}
                            className="flex items-center gap-4 p-3 bg-white/[0.01] hover:bg-[#df7b34]/[0.05] border border-white/[0.03] hover:border-[#df7b34]/30 rounded-xl cursor-pointer transition-all duration-300 group"
                          >
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                const match = p.id.match(/(\d+)/);
                                const digit = match ? match[1] : "0";
                                const fallbacks: Record<string, string> = {
                                  "1": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1200",
                                  "2": "https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=1200",
                                  "3": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200",
                                  "4": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1200",
                                  "5": "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1200",
                                  "6": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200",
                                  "7": "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200"
                                };
                                const fallbackVal = fallbacks[digit] || "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200";
                                if (e.currentTarget.src !== fallbackVal) {
                                  e.currentTarget.src = fallbackVal;
                                }
                              }}
                              className="w-14 h-14 object-cover rounded-lg border border-white/5"
                            />
                            <div className="flex-1 text-left">
                              <span className="text-[9px] font-mono text-[#777777] uppercase">
                                {p.category}
                              </span>
                              <h5 className="text-xs font-semibold tracking-wider text-white uppercase group-hover:text-[#f4a056]">
                                {p.name}
                              </h5>
                              <span className="text-[11px] font-mono text-[#df7b34]">
                                ₹{p.price}
                              </span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#777777] group-hover:text-[#df7b34] group-hover:translate-x-1 transition-all" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Handcrafted detail / Craftsmanship card */}
                    <div className="p-4 bg-white/[0.01] border-l-2 border-[#df7b34] rounded-r-xl">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Cpu className="w-3.5 h-3.5 text-[#df7b34]" />
                        <span className="text-[9px] font-mono text-[#df7b34] uppercase tracking-widest">
                          SUMMER COMFORT RATING
                        </span>
                      </div>
                      <p className="text-xs text-[#777777] leading-relaxed">
                        {stylistResult.craftsmanshipInsight}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  /* Initial intro state */
                  <motion.div
                    id="stylist-intro"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 border border-white/[0.04] bg-white/[0.01] rounded-2xl text-center text-left max-w-lg mx-auto"
                  >
                    <Compass className="w-8 h-8 text-[#df7b34] mx-auto mb-4" />
                    <h4 className="text-sm font-semibold tracking-wider text-white uppercase mb-2">
                      SOLAR COMPASS RADAR ACTIVE
                    </h4>
                    <p className="text-xs text-[#777777] leading-relaxed">
                      Ask anything about your summer looks. Our style core reviews lightweight breathable weaves, summer vents, and molten colors to formulate your boiling summer outfit.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Micro-Interaction Footer */}
            <div id="stylist-drawer-footer" className="border-t border-white/[0.05] pt-6 mt-12 flex items-center justify-between text-[#777777] font-mono text-[9px] tracking-widest uppercase select-none">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-[#df7b34]" /> VOLCANIC SUMMER READY
              </span>
              <span>REV_04</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
