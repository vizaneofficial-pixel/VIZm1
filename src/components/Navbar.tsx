import { useState, useEffect } from "react";
import { ShoppingBag, Search, Sparkles, X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CartItem } from "../types";

interface NavbarProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenStylist: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
}

export default function Navbar({
  cart,
  onOpenCart,
  onOpenStylist,
  activeSection,
  onNavigate,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let scrolled = false;
    const handleScroll = () => {
      const isCurrentlyScrolled = window.scrollY > 50;
      if (isCurrentlyScrolled !== scrolled) {
        scrolled = isCurrentlyScrolled;
        setIsScrolled(isCurrentlyScrolled);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { label: "SUMMER DROP", id: "showcase" },
    { label: "BLUEPRINTS", id: "blueprint" },
    { label: "HEATWAVE", id: "hero" },
    { label: "SUN SHELLS", id: "blueprint" },
    { label: "EMBER TEES", id: "showcase" },
  ];

  return (
    <motion.header
      id="main-header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[1400px] transition-all duration-700 ease-out-cubic ${
        isScrolled
          ? "py-3 px-6 bg-[#090909]/80 border-white/[0.08] backdrop-blur-2xl rounded-full shadow-[0_24px_80px_rgba(0,0,0,0.8)]"
          : "py-6 px-4 bg-transparent border-transparent rounded-none"
      } border-b`}
    >
      <div id="navbar-container" className="flex items-center justify-between">
        {/* Futuristic Brand Logo */}
        <div
          id="brand-logo"
          onClick={() => onNavigate("hero")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <motion.div
            animate={{ rotate: isScrolled ? 180 : 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-5 h-5 border border-white flex items-center justify-center p-0.5"
          >
            <div className="w-full h-full bg-[#df7b34] opacity-80 group-hover:bg-[#f4a056] transition-all duration-500" />
          </motion.div>
          <span className="font-heading text-3xl tracking-[0.2em] font-black text-white group-hover:text-[#df7b34] transition-colors">
            Vizm1<span className="text-[#df7b34] font-sans text-[10px] align-super tracking-normal font-normal ml-0.5">®</span>
          </span>
        </div>

        {/* Mid-Navigation Links */}
        <nav id="desktop-nav" className="hidden md:flex items-center gap-10">
          {navLinks.map((link, index) => (
            <button
              id={`nav-link-${link.id}-${index}`}
              key={link.label}
              onClick={() => onNavigate(link.id)}
              className="relative text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-500 hover:text-white py-1 cursor-pointer text-[#b5b5b5]"
            >
              {link.label}
              {activeSection === link.id && (
                <motion.span
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#df7b34] shadow-[0_0_12px_#df7b34]"
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div id="nav-actions" className="flex items-center gap-4">
          {/* Intelligent Stylist Icon Trigger */}
          <button
            id="nav-trigger-stylist"
            onClick={onOpenStylist}
            className="relative p-2 text-[#b5b5b5] hover:text-white transition-all duration-300 group rounded-full hover:bg-white/[0.05]"
            title="Intelligent Stylist"
          >
            <Sparkles className="w-4 h-4 text-[#f4a056] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#df7b34] rounded-full animate-ping" />
          </button>

          {/* Cart Icon Trigger */}
          <button
            id="nav-trigger-cart"
            onClick={onOpenCart}
            className="p-2 text-[#b5b5b5] hover:text-[#df7b34] transition-all duration-300 relative group rounded-full hover:bg-white/[0.05]"
          >
            <ShoppingBag className="w-4 h-4 transition-transform duration-500 group-hover:scale-110" />
            <AnimatePresence>
              {totalCartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-[#df7b34] text-white font-sans text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#090909] shadow-[0_2px_8px_rgba(223,123,52,0.6)]"
                >
                  {totalCartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Search Trigger */}
          <button
            id="nav-trigger-search"
            onClick={onOpenStylist}
            className="p-2 text-[#b5b5b5] hover:text-white transition-colors duration-300 rounded-full hover:bg-white/[0.05]"
          >
            <Search className="w-4 h-4 hover:shadow-[0_0_8px_#fff]" />
          </button>

          {/* Mobile Menu Icon */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#b5b5b5] hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden mt-4 pt-4 border-t border-white/[0.05]"
          >
            <div id="mobile-links" className="flex flex-col gap-4 pb-2">
              {navLinks.map((link) => (
                <button
                  id={`mobile-nav-link-${link.id}`}
                  key={link.label}
                  onClick={() => {
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 font-heading text-lg tracking-widest text-white hover:text-[#df7b34] transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <hr className="border-white/[0.05] my-1" />
              <button
                id="mobile-nav-stylist"
                onClick={() => {
                  onOpenStylist();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-[#f4a056] py-2 font-semibold text-xs tracking-wider uppercase"
              >
                <Sparkles className="w-3.5 h-3.5" /> AI STYLIST SYSTEM
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
