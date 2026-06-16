import { ArrowUpRight, ShieldAlert, FileText, Send } from "lucide-react";

interface FooterProps {
  onNavigate: (section: string) => void;
  onOpenStylist: () => void;
}

export default function Footer({ onNavigate, onOpenStylist }: FooterProps) {
  
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="main-footer"
      className="relative bg-transparent py-12 border-t border-white/[0.03] select-none"
    >
      {/* Texture Layer */}
      <div className="absolute inset-0 bg-vignette opacity-70 pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* Footer bottom metadata credits */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-mono text-[#777777] tracking-widest uppercase">
          <div className="text-left">
            © 2026 NEO_ARCHIVES INC. ALL SYSTEM INTEL SECURED.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer transition-colors" onClick={handleScrollTop}>
              RETURN TO APEX ↑
            </span>
            <span className="text-white/20">|</span>
            <span>SPEC BUILD V3.9</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
