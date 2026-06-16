import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Sparkles, ShoppingBag, Terminal } from "lucide-react";
import { CartItem } from "../types";

interface AshChatbotProps {
  cart: CartItem[];
}

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function AshChatbot({ cart }: AshChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Welcome, seeker. I am **Ash**, Vizm1's elite virtual curator. I guide travelers through our volcanic summer activewear line—engineered to endure severe solfatara heat, basalt gravels, and intense coastal climates.\n\nAsk me about our crater-dyed slub linens, cooling dual-meshes, free shipping (on orders above ₹5000), or type **'checkout'** to let me compile your cart selection into a custom WhatsApp link. How shall we calibrate your activewear today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { role: "user", text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Package full conversation history
      const historyPayload = [...messages, userMessage].map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        text: msg.text,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: historyPayload,
          cart: cart,
        }),
      });

      if (!response.ok) {
        throw new Error("Core thermal connection interrupted");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.text }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "My thermal link is offline. Please check your network or try again soon. For urgent inquiries, you can message our team directly on WhatsApp (+91 7908203996).",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectSuggestedFAQ = (question: string) => {
    handleSendMessage(question);
  };

  // Simple, highly robust paragraph and markdown parser
  const formatMessageText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      const trimmed = line.trim();
      const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ");
      const cleanLine = isBullet ? trimmed.substring(2) : line;

      // Render links: [Title](Url)
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = linkRegex.exec(cleanLine)) !== null) {
        if (match.index > lastIndex) {
          parts.push(cleanLine.substring(lastIndex, match.index));
        }
        parts.push(
          <a
            key={`lk-${match.index}`}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#df7b34] underline hover:text-[#f4a056] font-semibold transition-colors break-all"
          >
            {match[1]}
          </a>
        );
        lastIndex = linkRegex.lastIndex;
      }
      if (lastIndex < cleanLine.length) {
        parts.push(cleanLine.substring(lastIndex));
      }

      // Format bold texts (**text**)
      const formattedParts = parts.flatMap((part, idx) => {
        if (typeof part !== "string") return part;
        const boldRegex = /\*\*([^*]+)\*\*/g;
        const subParts = [];
        let subLastIndex = 0;
        let subMatch;
        while ((subMatch = boldRegex.exec(part)) !== null) {
          if (subMatch.index > subLastIndex) {
            subParts.push(part.substring(subLastIndex, subMatch.index));
          }
          subParts.push(
            <strong key={`b-${subMatch.index}`} className="font-bold text-[#df7b34]">
              {subMatch[1]}
            </strong>
          );
          subLastIndex = boldRegex.lastIndex;
        }
        if (subLastIndex < part.length) {
          subParts.push(part.substring(subLastIndex));
        }
        return subParts;
      });

      if (isBullet) {
        return (
          <li key={`line-${lineIdx}`} className="ml-4 list-disc text-white/95 text-xs my-1 leading-relaxed">
            {formattedParts}
          </li>
        );
      }
      return (
        <p key={`line-${lineIdx}`} className="text-white/95 text-xs my-1.5 min-h-[0.5rem] leading-relaxed">
          {formattedParts}
        </p>
      );
    });
  };

  const getCartSummaryText = () => {
    if (cart.length === 0) {
      return "Your shopping bag is empty. Explore our volcanic summer activewear and click 'Add to Cart' to test my order summary flow!";
    }
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const shipping = subtotal > 5000 ? 0 : 250;
    const total = subtotal + shipping;
    let desc = `🛒 *Cart Summary (${cart.length} items)*:\n`;
    cart.forEach((item, index) => {
      desc += `${index + 1}. ${item.product.name} (${item.selectedColor.name}) x${item.quantity} - ₹${item.product.price * item.quantity}\n`;
    });
    desc += `Subtotal: ₹${subtotal} | Logistics: ${shipping === 0 ? "FREE" : `₹${shipping}`}\nTotal: ₹${total}\n\nShall we compile this for a WhatsApp order?`;
    return desc;
  };

  return (
    <>
      {/* Floating Sparking Chat Bubble button bottom right */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          id="ash-chatbot-trigger"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-center w-14 h-14 bg-black border-2 border-[#df7b34] text-[#df7b34] rounded-full shadow-[0_0_25px_rgba(223,123,52,0.4)] hover:shadow-[0_0_35px_rgba(223,123,52,0.7)] transition-shadow cursor-pointer duration-300"
          title="Consult Ash AI"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#df7b34] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#f4a056]"></span>
              </span>
            </>
          )}
        </motion.button>
      </div>

      {/* Expanded Chat Applet Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ash-chat-window"
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 35, scale: 0.92 }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="fixed bottom-24 right-6 z-40 w-[380px] max-w-[calc(100vw-2rem)] h-[540px] bg-[#090909]/95 border border-[#df7b34]/30 rounded-2xl shadow-[0_15px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header branding info */}
            <div className="bg-black border-b border-white/[0.05] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#df7b34] to-[#f4a056] flex items-center justify-center text-black font-semibold text-sm">
                  A
                </div>
                <div>
                  <h3 className="font-heading text-sm text-white tracking-wider flex items-center gap-1">
                    CRAFT ASSISTANT: ASH <span className="text-[#df7b34] text-[9px] font-mono tracking-widest border border-[#df7b34]/30 px-1 py-0.2 rounded bg-[#df7b34]/5">AI</span>
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-[#777777] uppercase tracking-wider">LAVACORE v3.5-ONLINE</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#777777] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Scrollable messages dialogue */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col max-w-[85%] ${
                    msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <span className="font-mono text-[9px] text-[#777777] uppercase tracking-wider mb-1">
                    {msg.role === "user" ? "Traveler" : "Ash // Curator"}
                  </span>
                  <div
                    className={`p-3.5 rounded-2xl text-[12px] leading-relaxed border ${
                      msg.role === "user"
                        ? "bg-[#df7b34]/10 border-[#df7b34]/40 text-white rounded-br-none"
                        : "bg-white/[0.02] border-white/[0.05] text-white/95 rounded-bl-none"
                    }`}
                  >
                    {formatMessageText(msg.text)}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex flex-col items-start max-w-[85%] mr-auto">
                  <span className="font-mono text-[9px] text-[#777777] uppercase tracking-wider mb-1">
                    Ash // Analysing...
                  </span>
                  <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-2xl rounded-bl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#df7b34] rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-[#df7b34] rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-[#df7b34] rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* In-app Context Quick FAQ chips */}
            <div className="px-4 py-2 border-t border-white/[0.03] bg-black/30">
              <span className="font-mono text-[9px] text-[#777777] uppercase tracking-wider block mb-1.5">FAQ CONSOLE:</span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none scroll-smooth">
                <button
                  onClick={() => selectSuggestedFAQ("What premium fabrics are used in Vizm1 clothes?")}
                  className="flex-shrink-0 text-[10px] font-mono px-2.5 py-1 text-white/70 bg-white/[0.03] hover:bg-[#df7b34]/10 border border-white/[0.05] hover:border-[#df7b34]/30 rounded-full transition-all cursor-pointer"
                >
                  🌾 Textiles & Materials
                </button>
                <button
                  onClick={() => selectSuggestedFAQ("Tell me about secure shipping costs and rates.")}
                  className="flex-shrink-0 text-[10px] font-mono px-2.5 py-1 text-white/70 bg-white/[0.03] hover:bg-[#df7b34]/10 border border-white/[0.05] hover:border-[#df7b34]/30 rounded-full transition-all cursor-pointer"
                >
                  📦 Logistics & Rates
                </button>
                <button
                  onClick={() => selectSuggestedFAQ("How do I complete my purchase via WhatsApp?")}
                  className="flex-shrink-0 text-[10px] font-mono px-2.5 py-1 text-white/70 bg-white/[0.03] hover:bg-[#df7b34]/10 border border-white/[0.05] hover:border-[#df7b34]/30 rounded-full transition-all cursor-pointer"
                >
                  💬 Ordering Process
                </button>
                <button
                  onClick={() => {
                    if (cart.length === 0) {
                      setMessages((prev) => [
                        ...prev,
                        { role: "user", text: "Summarize my active cart" },
                        { role: "assistant", text: getCartSummaryText() }
                      ]);
                    } else {
                      handleSendMessage("Can you please summarize my active cart items and format my WhatsApp order?");
                    }
                  }}
                  className="flex-shrink-0 text-[10px] font-mono px-2.5 py-1 text-white hover:text-black bg-[#df7b34] hover:bg-[#f4a056] border border-[#df7b34]/30 rounded-full transition-all cursor-pointer flex items-center gap-1"
                >
                  <ShoppingBag className="w-2.5 h-2.5" /> Summary Cart
                </button>
              </div>
            </div>

            {/* Input field area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="border-t border-white/[0.05] bg-black p-3.5 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                placeholder="Message Ash AI..."
                className="flex-1 bg-white/[0.03] text-white text-xs px-4 py-3 border border-white/[0.05] focus:border-[#df7b34]/50 focus:outline-none rounded-xl transition-all font-mono"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="w-10 h-10 bg-[#df7b34] hover:bg-[#c76622] disabled:bg-neutral-800 text-white flex items-center justify-center rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(223,123,52,0.2)] disabled:shadow-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
