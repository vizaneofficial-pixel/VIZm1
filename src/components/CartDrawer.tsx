import { X, Trash2, ShoppingBag, Sparkles, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CartItem, ColorVariant, Product } from "../types";
import { useState } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemoveItem: (productId: string, color: ColorVariant) => void;
  onUpdateQuantity: (productId: string, color: ColorVariant, delta: number) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
}: CartDrawerProps) {
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 250;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    const phoneNumber = "917908203996";
    let message = `Hello Vizm1! I would like to order the following volcanic apparel items:\n\n`;
    
    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   • Color: ${item.selectedColor.name}\n`;
      message += `   • Quantity: ${item.quantity}\n`;
      message += `   • Item Price: ₹${item.product.price}\n`;
      message += `   • Subtotal: ₹${item.product.price * item.quantity}\n\n`;
    });
    
    message += `• *Subtotal:* ₹${subtotal}\n`;
    message += `• *Shipping:* ${shipping === 0 ? "FREE" : `₹${shipping}`}\n`;
    message += `• *SYSTEM TOTAL:* ₹${total}\n\n`;
    message += `Please verify availability and payment instructions. Thank you!`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            id="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/75 backdrop-blur-md"
          />

          {/* Cart Drawer Panel */}
          <motion.div
            id="cart-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 150 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full md:w-[480px] bg-[#090909]/95 border-l border-white/[0.05] shadow-[0_0_80px_rgba(0,0,0,0.9)] p-5 sm:p-8 flex flex-col justify-between overflow-y-auto"
          >
            {/* Drawer Top Header */}
            <div>
              <div id="cart-drawer-header" className="flex items-center justify-between border-b border-white/[0.05] pb-6 mb-8">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-[#df7b34]" />
                  <h2 className="font-heading text-3xl tracking-wide text-white">
                    COMPONENT CART
                  </h2>
                </div>
                <button
                  id="close-cart-drawer"
                  onClick={onClose}
                  className="font-mono text-[9px] text-[#777777] hover:text-[#df7b34] tracking-widest uppercase py-2 px-3 border border-white/[0.05] hover:border-[#df7b34]/30 rounded-full transition-all cursor-pointer"
                >
                  CLOSE // [ESC]
                </button>
              </div>

              {cart.length === 0 ? (
                /* Empty state */
                <div id="cart-drawer-empty" className="py-24 text-center select-none">
                  <ShoppingBag className="w-10 h-10 text-white/10 mx-auto mb-4" />
                  <p className="font-heading text-lg tracking-wider text-[#777777] uppercase">
                    CARRIER CART IS EMPTY
                  </p>
                  <p className="text-xs text-[#777777] mt-1 uppercase tracking-widest">
                    Select a core hardware module to proceed
                  </p>
                </div>
              ) : (
                /* Cart Items List Grid */
                <div id="cart-drawer-list" className="flex flex-col gap-4">
                  {cart.map((item) => (
                    <div
                      id={`cart-item-${item.product.id}`}
                      key={`${item.product.id}-${item.selectedColor.name}`}
                      className="flex items-center gap-4 p-4 bg-white/[0.01] border border-white/[0.03] rounded-2xl relative"
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const match = item.product.id.match(/(\d+)/);
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
                        className="w-16 h-16 object-cover rounded-xl border border-white/5"
                      />
                      <div className="flex-1 text-left">
                        <span className="text-[9px] font-mono text-[#777777] uppercase tracking-wider block">
                          {item.product.category}
                        </span>
                        <h4 className="text-xs font-semibold tracking-wider text-white uppercase truncate max-w-[180px]">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: item.selectedColor.hex }} />
                          <span className="text-[9px] font-mono text-[#777777] uppercase">
                            {item.selectedColor.name}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 text-right">
                        <span className="text-xs font-mono font-medium text-white">
                          ₹{item.product.price * item.quantity}
                        </span>

                        {/* Quantity Counter Control Blocks */}
                        <div className="flex items-center bg-[#111111] border border-white/[0.05] rounded-md">
                          <button
                            id="quantity-decrease"
                            onClick={() => onUpdateQuantity(item.product.id, item.selectedColor, -1)}
                            className="px-2.5 py-1 text-[#777777] hover:text-white font-mono text-xs transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 font-mono text-xs text-white">
                            {item.quantity}
                          </span>
                          <button
                            id="quantity-increase"
                            onClick={() => onUpdateQuantity(item.product.id, item.selectedColor, 1)}
                            className="px-2.5 py-1 text-[#777777] hover:text-white font-mono text-xs transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        id="remove-item-bag"
                        onClick={() => onRemoveItem(item.product.id, item.selectedColor)}
                        className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#111111] border border-white/[0.05] hover:border-[#df7b34] flex items-center justify-center transition-colors text-[#777777] hover:text-[#df7b34] cursor-pointer"
                        title="Remove component"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* General Checkout Summary section placed at bottom */}
            {cart.length > 0 && (
              <div id="cart-drawer-checkout-summary" className="border-t border-white/[0.05] pt-6 mt-12">
                <div className="flex flex-col gap-2.5 font-mono text-xs mb-6 select-none">
                  <div className="flex items-center justify-between text-[#777777]">
                    <span>SUBTOTAL</span>
                    <span className="text-white">₹{subtotal}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#777777]">
                    <span>SECURE LOGISTICS</span>
                    <span className="text-white">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                  </div>
                  <div className="border-t border-dashed border-white/[0.05] my-1" />
                  <div className="flex items-center justify-between text-sm font-semibold tracking-wider">
                    <span className="text-[#df7b34]">SYSTEM TOTAL</span>
                    <span className="text-white">₹{total}</span>
                  </div>
                </div>

                <button
                  id="checkout-bag-components"
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-full bg-[#df7b34] hover:bg-[#c76622] text-white text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_4px_20px_rgba(223,123,52,0.3)] hover:shadow-[0_4px_28px_rgba(223,123,52,0.5)] cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-white" /> CONTACT ON WHATSAPP
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Customized loading micro-spinner component referencing rotate cw square
function RotateCwSquare(p: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={p.className}
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}
