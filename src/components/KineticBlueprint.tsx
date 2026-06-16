import { motion } from "motion/react";
import { ArrowUpRight, Shield, Thermometer, Wind, Eye } from "lucide-react";

export default function KineticBlueprint() {
  const stats = [
    {
      value: "220g",
      label: "Featherlight Core Weight",
    },
    {
      value: "98%",
      label: "Active Airflow Rating",
    },
    {
      value: "86%",
      label: "Volcanic Ash Dye Resin",
    },
  ];

  const partners = [
    {
      id: 1,
      name: "GORE-TEX®",
      subtitle: "WEATHER LABS",
      icon: <Wind className="w-5 h-5 text-[#df7b34]" />,
      url: "https://www.gore-tex.com/",
    },
    {
      id: 2,
      name: "CORDURA®",
      subtitle: "RIPSTOP TECH",
      icon: <Shield className="w-5 h-5 text-[#df7b34]" />,
      url: "https://www.cordura.com/",
    },
    {
      id: 3,
      name: "BASALT™",
      subtitle: "GEOMESH NYLON",
      icon: <Thermometer className="w-5 h-5 text-[#df7b34]" />,
      url: "https://en.wikipedia.org/wiki/Basalt_fiber",
    },
    {
      id: 4,
      name: "SOLFATARA",
      subtitle: "MINERAL DYES",
      icon: <Eye className="w-5 h-5 text-[#df7b34]" />,
      url: "https://en.wikipedia.org/wiki/Solfatara_(crater)",
    },
  ];

  return (
    <section
      id="blueprint"
      className="relative w-full bg-transparent pt-28 px-[6vw] pb-36 overflow-hidden select-none"
    >
      {/* Background soft fiery gradient radial glow to tie in with environmental landscape */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-r from-[#df7b34]/[0.03] to-transparent filter blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-[1200px] mx-auto flex flex-col gap-24">
        
        {/* ================= TOP SECTION: HIGH-TECH STATS PANEL ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 bg-[rgba(20,20,20,0.15)] backdrop-blur-md border border-white/[0.04] rounded-[28px] p-8 md:p-12 shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="flex flex-col text-left group"
            >
              {/* Digital Monospace Stat Value */}
              <span className="font-mono text-5xl md:text-6xl xl:text-7xl font-semibold text-white tracking-tighter leading-none transition-all duration-300 group-hover:text-[#df7b34]">
                {stat.value}
              </span>
              
              {/* Minimalist Technical Underline indicator block */}
              <div className="h-[2px] bg-white/[0.06] mt-4 mb-4 relative overflow-hidden w-full">
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#df7b34] to-[#f4a056] group-hover:w-full transition-all duration-500 rounded-full" />
              </div>

              {/* Stat label prefixed with glowing orange bullet point */}
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-sm bg-[#df7b34] shadow-[0_0_8px_rgba(223,123,52,0.8)]" />
                <span className="font-mono text-[10px] md:text-xs text-white/50 tracking-wider uppercase font-medium">
                  {stat.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ================= BOTTOM SECTION: TRUST & BRAND VALUE / PARTNERS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 items-center">
          
          {/* Left Column: Over 12 Years Editorial statement */}
          <div className="lg:col-span-5 flex flex-col items-start text-left lg:border-r lg:border-white/[0.08] lg:pr-16 relative">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-6 w-full"
            >
              <div className="flex flex-col">
                <span className="font-mono text-[11px] text-[#df7b34] uppercase tracking-[0.3em] font-semibold mb-3 block">
                  BRAND SPECIFICATIONS
                </span>
                <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-white leading-none">
                  Over <span className="font-medium text-[#df7b34]">12</span>
                  <br />
                  <span className="text-white">years</span>
                </h2>
                <span className="font-mono text-[10px] text-white/35 uppercase tracking-[0.25em] mt-4">
                  of geothermal tailoring
                </span>
              </div>

              <p className="text-white/40 text-xs md:text-sm font-light leading-relaxed max-w-sm">
                Developing advanced loose-knit summer garments, ash-infused pigment layers, and micro-perforated cooling panels. We collaborate with high-performance technical mills to craft apparel that breathes inside extreme summer environments.
              </p>

              {/* Visit site CTA Capsule with custom diagnostic arrow symbol */}
              <motion.a
                href="https://www.gore-tex.com/"
                target="_blank"
                rel="noopener noreferrer"
                id="blueprint-cta-visit"
                whileHover={{ scale: 1.03, backgroundColor: "rgba(223,123,52,0.08)", borderColor: "rgba(223,123,52,0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 flex items-center gap-3 px-6 py-3 bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-full text-white/80 font-mono text-xs uppercase tracking-widest cursor-pointer transition-all duration-300 w-fit select-none"
              >
                <ArrowUpRight className="w-4 h-4 text-[#df7b34]" />
                <span>EXPLORE TECHNICAL CATALOG</span>
              </motion.a>
            </motion.div>
          </div>

          {/* Right Column: Symmetric Non-Overlapping Partners Grid */}
          <div className="lg:col-span-7 flex justify-center items-center py-12 relative">
            {/* Ambient orange aura behind the cluster */}
            <div className="absolute w-[220px] h-[220px] bg-[#df7b34]/8 rounded-full filter blur-[70px] pointer-events-none" />

            <div className="grid grid-cols-2 gap-4 sm:gap-8 md:gap-12 relative z-10">
              {partners.map((p) => (
                <motion.a
                  key={p.id}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: p.id * 0.08 }}
                  whileHover={{ 
                    scale: 1.08, 
                    boxShadow: "0 0 35px rgba(223,123,52,0.3)",
                    borderColor: "rgba(223,123,52,0.5)",
                  }}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-[rgba(32,21,15,0.70)] backdrop-blur-md border border-white/[0.05] flex flex-col items-center justify-center p-4 transition-all duration-300 cursor-pointer shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                >
                  <div className="mb-2 shrink-0">{p.icon}</div>
                  <span className="font-mono text-[10px] md:text-xs font-bold text-white tracking-widest uppercase">
                    {p.name}
                  </span>
                  <span className="font-mono text-[7px] md:text-[8px] text-white/45 tracking-widest uppercase mt-0.5">
                    {p.subtitle}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
