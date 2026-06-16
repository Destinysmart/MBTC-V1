import { useEffect } from "react";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { 
  Heart, 
  ExternalLink,
  Sparkles,
  Check
} from "lucide-react";
import { motion } from "motion/react";

export function DonatePage() {
  useEffect(() => {
    // 1. Check if script is already present
    let script = document.getElementById("blink-donation-script") as HTMLScriptElement | null;
    
    const initWidget = () => {
      const BlinkPayButton = (window as any).BlinkPayButton;
      if (typeof BlinkPayButton !== 'undefined') {
        try {
          BlinkPayButton.init({
            username: 'jabulanijakes',
            containerId: 'blink-pay-button-container',
            themeMode: 'light',
            language: 'en',
            defaultAmount: 1000,
            supportedCurrencies: [
              {
                "code": "sats",
                "name": "sats",
                "isCrypto": true
              },
              {
                "code": "USD",
                "name": "USD",
                "isCrypto": false
              }
            ],
            debug: false
          });
        } catch (e) {
          console.error("Error initializing BlinkPayButton:", e);
        }
      } else {
        setTimeout(initWidget, 100);
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = "blink-donation-script";
      script.src = "https://blinkbitcoin.github.io/donation-button.blink.sv/js/blink-pay-button.js";
      script.async = true;
      script.onload = () => {
        initWidget();
      };
      script.onerror = (err) => {
        console.error("Failed to load Blink Pay button script:", err);
      };
      document.body.appendChild(script);
    } else {
      // If script is already there, retry initialization directly (covers navigation back and forth)
      initWidget();
    }

    return () => {
      // Clear container on unmount to prevent duplicate renders
      const container = document.getElementById("blink-pay-button-container");
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FCFAF7] text-gray-900 font-sans selection:bg-brand-500 selection:text-white">
      <SEO 
        title="Donate - Support Molo BTC" 
        description="Support our open-source Bitcoin educational tools and interactive exercises. Donate with on-chain Bitcoin or over Lightning."
      />
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1 text-xs font-semibold text-brand-700 mb-5 tracking-wide uppercase"
          >
            <Heart className="h-3.5 w-3.5 text-brand-500 fill-brand-500" />
            <span>Open Source Initiative</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="heading-display text-4xl font-extrabold text-gray-950 tracking-tight mb-4"
          >
            Support Molo BTC
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-gray-600 leading-relaxed"
          >
            Molo BTC is entirely free and user-supported. We don't host trackers, sell student analytics, or block knowledge behind paywalls. Every contribution goes toward servers, database costs, and keeping our interactive homework helper active.
          </motion.p>
        </div>

        {/* Central Simple Donation Card */}
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-xl relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-brand-400 to-brand-600" />
            
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="heading-display text-lg font-bold text-gray-950 flex items-center gap-2">
                  <span>Bitcoin Donation</span>
                  <Sparkles className="h-4 w-4 text-brand-500 animate-pulse" />
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Send satoshis directly via Lightning or On-Chain
                </p>
              </div>

              {/* Blink Pay Button Widget Container */}
              <div className="min-h-[220px] flex flex-col justify-center items-center py-4 bg-gray-50/40 rounded-2xl border border-gray-100">
                <div id="blink-pay-button-container" className="w-full flex justify-center"></div>
              </div>

              {/* Functional Notification Banner */}
              <div className="p-3 bg-[#FCF8F2] border border-brand-200/50 rounded-xl flex items-start gap-2.5">
                <Sparkles className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-gray-650 leading-relaxed">
                  <strong>Functional Donation Widget:</strong> Supporting our Bitcoin education efforts is now fully live! Powered by <strong>Blink Bitcoin</strong>, you can contribute any custom amount directly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Humble FAQ Section */}
        <div className="mt-16 border-t border-gray-150 pt-10">
          <div className="grid md:grid-cols-2 gap-8 text-xs leading-relaxed max-w-3xl mx-auto">
            <div className="space-y-1.5">
              <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-brand-500" />
                Is this payment fully functional?
              </h3>
              <p className="text-gray-550">
                Yes! This widget is fully live and integrated with Blink Bitcoin. Any donations made here directly support moloBTC's hosting, servers, and ongoing development of educational tools.
              </p>
            </div>
            
            <div className="space-y-1.5">
              <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-brand-500" />
                How can I actively support Molo BTC?
              </h3>
              <p className="text-gray-550">
                Beyond Bitcoin donations, organic sharing is incredibly powerful! Star or contribute directly on our official <a href="https://github.com/molobtc" target="_blank" rel="noreferrer" className="text-brand-600 font-bold hover:underline inline-flex items-center gap-0.5 inline">GitHub profile <ExternalLink className="h-3 w-3 inline" /></a>, or share our research and guides with students.
              </p>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
