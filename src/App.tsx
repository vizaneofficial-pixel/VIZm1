import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Product, CartItem, ColorVariant } from "./types";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductShowcase from "./components/ProductShowcase";
import KineticBlueprint from "./components/KineticBlueprint";
import ProductDetailModal from "./components/ProductDetailModal";
import AIStylist from "./components/AIStylist";
import CartDrawer from "./components/CartDrawer";
import CustomCursor from "./components/CustomCursor";
import Footer from "./components/Footer";
import AshChatbot from "./components/AshChatbot";
import SoundControl from "./components/SoundControl";

// Complete Local Fallback Catalog matching description to avoid any empty frames
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "fuego-01",
    name: "EMBER SUMMER TEE",
    price: 3999,
    category: "Outerwear",
    tagline: "Super-breezy organic cotton tee featuring volcanic heatwave graphics and extreme breathability.",
    rating: 4.9,
    materials: ["100% Breathable Organic Cotton", "Air-Flow Open Vent Mesh", "Volcanic Ash Dye Finish"],
    colors: [
      { name: "Solfatara Beige", hex: "#e5dec9" },
      { name: "Volcanic Ash Grey", hex: "#c3bfb5" }
    ],
    features: ["Ultra-lightweight heatwave cooling", "Molten ember wash artwork", "Relaxed coastal flow hem"],
    description: "An ultra-light, summer-ready short sleeve tee in our signature soft volcanic wash. Built to let the body breathe in sweltering midday heat, with relaxed shoulders and a raw-edge finish.",
    imageUrl: "https://labs.google/fx/api/og-image/shared/29ddf9e7-7e0d-4a23-a49e-35089831ea52",
    details: {
      craftsmanship: "Crafted with dynamic seamless shoulders and hand-dyed to capture the organic, fiery shades of cooling volcanic magma.",
      insulation: "Maximum cooling. Engineered with extra-ventilated open-knit cotton fibers to let any breeze straight through.",
      fitting: "Breezy relaxed drop-shoulder cut that gently drapes without hugging the body."
    }
  },
  {
    id: "fuego-02",
    name: "CALDERA AIRFLOW SHIRT",
    price: 4999,
    category: "Outerwear",
    tagline: "Featherlight sun-spun linen shirt with open collar vents for effortless summer drapes.",
    rating: 5.0,
    materials: ["100% Pure Italian Flax Linen", "Mother-of-Pearl Burning Buttons", "Sun-reflecting weave"],
    colors: [
      { name: "Basalt Grey", hex: "#8c8275" }
    ],
    features: ["Open active crater collar", "Featherweight sun protection", "Quick-wick breathable construction"],
    description: "Our classic lightweight linen button-down, colored from organic beach sands and warm pumice. Perfect for hot sun-exposed beaches and tropical summer evenings alike.",
    imageUrl: "https://labs.google/fx/api/og-image/shared/ac6a0d42-070d-4132-819f-e3c25370c757",
    details: {
      craftsmanship: "Stitched with high-strength lightweight thread to prevent pulling during tropical beach adventures.",
      insulation: "Complete breathability. Perfect for layered styles under hot boiling sunshine.",
      fitting: "Flowing casual fit designed with a slightly longer back hem for beachside ease."
    }
  },
  {
    id: "fuego-03",
    name: "BASALT MESH TANK",
    price: 2999,
    category: "Mid-Layer",
    tagline: "Super-cooling dual-mesh active tank top built to survive sizzling heat waves.",
    rating: 4.8,
    materials: ["Recycled Ocean Poly-Mesh", "Moisture-evaporating bamboo-silk blend"],
    colors: [
      { name: "Volcanic Ash", hex: "#e0ded9" },
      { name: "Pyre Orange Accent", hex: "#df7b34" }
    ],
    features: ["Asymmetric hot-cut hem", "Crater-grain cooling panels", "Contrast hot orange detailing"],
    description: "An absolute summer essential. Built with raw-cut edges and ultra-light micro-perforated mesh panels to keep you looking cool while the mercury rises.",
    imageUrl: "https://labs.google/fx/api/og-image/shared/b135334c-0817-45e1-8cca-2a33d03cf6bf",
    details: {
      craftsmanship: "Flatlock cooling seams prevent friction under active sun movement, finished with real lava-ochre accents.",
      insulation: "Zero insulation. Actively releases hot core steam for instant temperature relief.",
      fitting: "Standard athletic scoop neck with drop-tail ventilation slits."
    }
  },
  {
    id: "fuego-04",
    name: "SCORIA LIGHT PULLOVER",
    price: 5999,
    category: "Mid-Layer",
    tagline: "Ultra-thin sun-shielding beach hood with continuous light knit and rapid-dry tech.",
    rating: 4.9,
    materials: ["Featherweight Mercerized Cotton", "Eruption Soft-Knit Poly-Silk"],
    colors: [
      { name: "Caldera Off-White", hex: "#eae7de" }
    ],
    features: ["High sunwrap hood protection", "Underarm aero-vent cooling grids", "Double-layered sun pocket"],
    description: "Designed for when the evening breeze rolls over hot sand dunes. Premium summer-knit jersey structure feels cool on bare skin and shields you from the sun.",
    imageUrl: "https://labs.google/fx/api/og-image/shared/c06d01a2-f6fc-4f1b-9aa6-ce8a4f4c7e75",
    details: {
      craftsmanship: "Densely knit yet incredibly paper-thin, featuring active performance breathability and shape retention.",
      insulation: "Soft, gentle evening layer. Provides minimal cozy cover-up without heat trap.",
      fitting: "Slightly oversized loose-knit pullover draping elegantly over swim trunks or shorts."
    }
  },
  {
    id: "fuego-05",
    name: "PYRE LIGHTWEIGHT SHORTS",
    price: 3499,
    category: "Outerwear",
    tagline: "Breezy ripstop beach utility shorts with open-sided cooling pockets and drawcord waist.",
    rating: 4.8,
    materials: ["Quick-dry Stretch Micro-Ripstop", "Pumice-softened cotton interior"],
    colors: [
      { name: "Solfatara Tan", hex: "#cecbbe" }
    ],
    features: ["Deep side cargo vent expansions", "Laser-cut pocket ventilation", "Contrast magma-orange cords"],
    description: "Your final answer to high summer exploration. Breathable, durable, and highly adaptive nylon cargo shorts color-treated with natural volcanic clay pigments.",
    imageUrl: "https://labs.google/fx/api/og-image/shared/1bc71bcd-d05d-4074-ac10-2da953dd0eb7",
    details: {
      craftsmanship: "Bar-tacked stress zones for high-activity beach volleyball and sun hiking. Lightweight cord lock system.",
      insulation: "High airflow cooling. Maximum heat dispersion via side mesh ventilation slots.",
      fitting: "Modern mid-rise fit ending slightly above the knee with wider leg openings."
    }
  },
  {
    id: "fuego-06",
    name: "IGNIS SUN POLO",
    price: 4299,
    category: "Outerwear",
    tagline: "Lightweight mercerized polo featuring wavy molten magma line designs.",
    rating: 5.0,
    materials: ["Premium Mercerized Beach Cotton", "Lava-dye organic knits"],
    colors: [
      { name: "Solfatara Wave Collage", hex: "#cfcbc3" }
    ],
    features: ["Wavy earth-tone body panels", "Open-loop buttonless collar", "Seamless cool cuffs"],
    description: "Celebrate the eruption of summer style with our gorgeous organic wavy polo. High-retention cool cotton fibers naturally wick away sweat while keeping you dapper under the blazing sun.",
    imageUrl: "https://labs.google/fx/api/og-image/shared/ffd23870-78fb-4f78-b410-e3080151cfd2",
    details: {
      craftsmanship: "Double curved flat seams individually steamed for perfectly smooth skin-contact feeling.",
      insulation: "Cool-to-the-touch finish. Naturally drops skin temperature surface feeling.",
      fitting: "Tailored standard fit with comfortable short sleeves for premium summer lounging."
    }
  },
  {
    id: "fuego-07",
    name: "CINDER LIGHT VEST",
    price: 4799,
    category: "Outerwear",
    tagline: "Multi-pocket summer utility vest in volcanic tan with fully ventilated mesh backing.",
    rating: 5.0,
    materials: ["Water-repellent thin cotton canvas", "Aerated mesh back webbing"],
    colors: [
      { name: "Cinder Tan / Ochre", hex: "#b4ab9d" }
    ],
    features: ["Double cargo front chest expansion", "Completely open back breeze panels", "Contrast hot terracotta flaps"],
    description: "An asymmetrical lightweight cargo vest built to upgrade any basic tee into an iconic streetwear fit. Loaded with ventilated mesh to guarantee you stay chilled.",
    imageUrl: "https://labs.google/fx/api/og-image/shared/24802d27-9e15-40e5-9de6-a61487f3e1d3",
    details: {
      craftsmanship: "Double-needle stitching on quick-snap pocket flaps, with contrast leatherette sun rings.",
      insulation: "Minimalist skeleton layout. Entirely designed for summer layering on top of tees.",
      fitting: "Cropped loose layer designed to sit casually over a tee or tank."
    }
  },
  {
    id: "fuego-08",
    name: "MAGMA BEACH ANORAK",
    price: 6999,
    category: "Outerwear",
    tagline: "Paper-thin windbreaker with extreme back ventilation gills and volcanic glowing accents.",
    rating: 4.9,
    materials: ["Recycled featherlight windstop nylon", "Full breathable dry-vent lining"],
    colors: [
      { name: "Volcanic Charcoal", hex: "#1c1c1c" }
    ],
    features: ["Volcano-glow zippers", "Extended rear cooling gill system", "Packable self-storing capability"],
    description: "An incredibly light, packable protective outerlayer for sudden warm rain showers and windy coastal boardwalk runs. Packs down into a tiny pocket.",
    imageUrl: "https://labs.google/fx/api/og-image/shared/01f96fac-7f3e-43f9-b832-14ebed38f208",
    details: {
      craftsmanship: "Ultra-high stitch count on micro-thin tear-resistant nylon body, featuring molten-orange zip detailing.",
      insulation: "Ultra-thin protective wind barrier without thermal layers. Keeps wind off, lets sweat out.",
      fitting: "Relaxed casual drape with adjustable waist toggles for a customized summer look."
    }
  }
];

export default function App() {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [cartOpen, setCartOpen] = useState(false);
  const [stylistOpen, setStylistOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [backgroundVideoLoaded, setBackgroundVideoLoaded] = useState(false);
  const [explosionFlash, setExplosionFlash] = useState(false);
  const [screenShake, setScreenShake] = useState(false);

  const handleExplosionEffects = () => {
    setExplosionFlash(true);
    setScreenShake(true);
    // Flash fades out quickly for high performance
    setTimeout(() => {
      setExplosionFlash(false);
    }, 800);
    // Camera shake continues vibrating slightly longer
    setTimeout(() => {
      setScreenShake(false);
    }, 1200);
  };

  // Fetch true catalog directly from Express and load
  useEffect(() => {
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Catalog load fail");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch((err) => {
        console.warn("Bootstrap products using fallback dataset:", err);
      });
  }, []);

  // Sync scroll positioning to coordinate Navigation Highlights with native IntersectionObserver
  useEffect(() => {
    const sections = ["hero", "showcase", "blueprint"];
    const observerOptions = {
      root: null,
      rootMargin: "-45% 0px -45% 0px", // Trigger when the section occupies the center of the screen
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Utility triggers to direct navigation
  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  const handleAddToCart = (product: Product, color: ColorVariant) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedColor.name === color.name
      );

      if (existingIdx > -1) {
        const newCart = [...prevCart];
        newCart[existingIdx].quantity += 1;
        return newCart;
      } else {
        return [...prevCart, { product, selectedColor: color, quantity: 1 }];
      }
    });
  };

  const handleRemoveItem = (productId: string, color: ColorVariant) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.product.id === productId && item.selectedColor.name === color.name)
      )
    );
  };

  const handleUpdateQuantity = (productId: string, color: ColorVariant, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId && item.selectedColor.name === color.name) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  return (
    <div 
      id="applet-viewport" 
      className={`relative min-h-screen bg-black overflow-hidden selection:bg-[#df7b34] selection:text-white transition-all duration-300 ${
        screenShake ? "volcano-shaking-viewport" : ""
      }`}
    >
      {/* Cinematic Caldera Explosion Flash Overlay */}
      <AnimatePresence>
        {explosionFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed inset-0 bg-gradient-to-tr from-[#df7b34]/35 via-red-950/40 to-transparent z-[35] pointer-events-none mix-blend-color-dodge will-change-transform"
          />
        )}
      </AnimatePresence>

      {/* Absolute Film Grain Background texture overlay */}
      <div className="concrete-noise" />

      {/* ================ SHARED FIXED VOLCANIC LANDSCAPE CINEMATIC BACKGROUND ================ */}
      <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none select-none bg-black">
        
        {/* Ambient Pulsing Volcano placeholder - fast loading on initial mount using premium compressed high-res image */}
        <div 
          className={`absolute inset-0 z-[1] transition-opacity duration-1000 ease-out pointer-events-none bg-black ${
            backgroundVideoLoaded ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Extremely fast-loading, highly-compressed premium volcanic image (sub-80KB) */}
          <img
            src="https://images.unsplash.com/photo-1619266465172-02a857c3556d?auto=format&fit=crop&w=1920&q=45"
            alt="Lava background placeholder"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-[0.55] contrast-[1.15] blur-[3px]"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#1b0a02]/90 via-[#050505]/80 to-black z-[2]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(223,123,52,0.12)_0%,transparent_60%)] animate-pulse z-[3] mix-blend-screen" />
        </div>

        {/* Layer 1: Blurred Animated Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onCanPlay={() => setBackgroundVideoLoaded(true)}
          className={`w-full h-full object-cover scale-108 filter blur-[4px] brightness-[0.80] contrast-[0.90] saturate-[0.80] select-none pointer-events-none transition-opacity duration-1000 ease-out ${
            backgroundVideoLoaded ? "opacity-[0.60]" : "opacity-0"
          }`}
        >
          <source src="https://labs.google/fx/api/og-video/shared/85258e17-122d-42aa-a45b-a3c7c9710abe" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/preview/mixkit-lava-eruption-from-a-volcano-in-chile-43306-large.mp4" type="video/mp4" />
          <source 
            src="https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c022718cf39cc03310fed93708e12cb1&profile_id=139&oauth2_token_id=57447761" 
            type="video/mp4" 
          />
        </video>

        {/* Layer 2: Semi-transparent premium cinematic gradient overlay */}
        <div 
          className="absolute inset-0 z-[1]"
          style={{
            background: `linear-gradient(
              180deg,
              rgba(0,0,0,0.35) 0%,
              rgba(5,5,5,0.22) 20%,
              rgba(10,10,10,0.12) 50%,
              rgba(5,5,5,0.22) 80%,
              rgba(0,0,0,0.35) 100%
            )`
          }}
        />

        {/* Pulsing Orange Light Flicker */}
        <motion.div
          animate={{ opacity: [0.15, 0.22, 0.17, 0.25, 0.15] }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-radial-gradient from-[#df7b34]/15 via-transparent to-transparent z-[2] mix-blend-screen"
        />

        {/* Atmosphere/Environmental Particles Layer */}
        <div className="absolute inset-0 z-[3]">
          {[
            { id: "ap1", type: "ash", left: "12%", top: "25%", size: 3, duration: 22, delay: 0 },
            { id: "ap2", type: "ember", left: "40%", top: "75%", size: 4, duration: 15, delay: 2, color: "#df7b34" },
            { id: "ap3", type: "ash", left: "68%", top: "15%", size: 2.5, duration: 25, delay: 4 },
            { id: "ap4", type: "spark", left: "28%", top: "85%", size: 5, duration: 9, delay: 1, color: "#f4a056" },
            { id: "ap5", type: "ash", left: "55%", top: "50%", size: 3.5, duration: 18, delay: 3 },
            { id: "ap6", type: "ember", left: "80%", top: "60%", size: 3, duration: 17, delay: 6, color: "#df7b34" },
            { id: "ap7", type: "spark", left: "15%", top: "70%", size: 4.5, duration: 11, delay: 5, color: "#f4a056" },
            { id: "ap8", type: "ash", left: "88%", top: "30%", size: 3, duration: 24, delay: 2 },
          ].map((p) => (
            <motion.div
              key={p.id}
              initial={{ y: 200, opacity: 0, x: 0 }}
              animate={{
                y: -150,
                x: [0, p.type === "ash" ? 25 : 15, -15, 0],
                opacity: [0, p.type === "ash" ? 0.35 : 0.7, p.type === "ash" ? 0.25 : 0.5, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute rounded-full"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                backgroundColor: p.color || "#8c8275",
                boxShadow: p.type !== "ash" ? `0 0 10px ${p.color}` : "none",
                filter: p.type === "ash" ? "blur(0.5px)" : "none",
              }}
            />
          ))}
        </div>

        {/* Heat Haze Distortion Overlay near bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-radial-gradient from-[#df7b34]/4 to-transparent blur-2xl opacity-45 z-[3] animate-pulse duration-[4000ms]" />

        {/* Moving Cloud/Fog Layers */}
        <div className="absolute inset-x-0 bottom-12 h-64 bg-gradient-to-b from-transparent via-white/[0.015] to-transparent blur-3xl rounded-full scale-110 pointer-events-none select-none z-[2] animate-pulse duration-[8000ms]" />
      </div>

      {/* Floating physical Glowing Cursor Follower */}
      <CustomCursor />

      {/* Layer 3: All website content - styled transparently above background */}
      <div className="relative z-10 w-full min-h-screen bg-transparent">
        {/* Glass navigation header bar */}
        <Navbar
          cart={cart}
          onOpenCart={() => setCartOpen(true)}
          onOpenStylist={() => setStylistOpen(true)}
          activeSection={activeSection}
          onNavigate={handleNavigate}
        />

        {/* Core Body sections block with slow entrance transition */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Unforgettable cinematic hero header rotating segment */}
          <Hero
            products={products}
            onSelectProduct={setSelectedProduct}
            onOpenStylist={() => setStylistOpen(true)}
            onAddToCart={handleAddToCart}
          />

          {/* Modular showcase catalog displaying products like museum fragments */}
          <ProductShowcase
            products={products}
            onSelectProduct={setSelectedProduct}
            onAddToCart={handleAddToCart}
          />

          {/* Dynamic Construction blueprint layout segments */}
          <KineticBlueprint />
        </motion.main>

        {/* Standard branding footer block */}
        <Footer
          onNavigate={handleNavigate}
          onOpenStylist={() => setStylistOpen(true)}
        />
      </div>

      {/* Slide-out carrier cart drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
      />

      {/* Ash AI Floating Chatbot */}
      <AshChatbot cart={cart} />

      {/* Premium Volcanic Ambience BGM & Seismic Trigger Panel */}
      <SoundControl onExplosionTriggered={handleExplosionEffects} />

      {/* Sleek industrial float watermark signature matching volcanic aesthetics */}
      <div className="fixed bottom-10 right-24 z-30 pointer-events-none select-none hidden sm:flex items-center gap-2">
        <span className="h-[1.2px] w-6 bg-gradient-to-r from-transparent to-[#df7b34]/40" />
        <span className="font-mono text-[9px] text-[#777777] uppercase tracking-[0.3em]">
          MADE BY <span className="text-white font-medium">VIZ</span>
        </span>
      </div>

      {/* Slide-out intelligent style styling portal */}
      <AIStylist
        products={products}
        isOpen={stylistOpen}
        onClose={() => setStylistOpen(false)}
        onSelectProduct={setSelectedProduct}
      />

      {/* Detailed popover inspection overlay window */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            isOpen={selectedProduct !== null}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
