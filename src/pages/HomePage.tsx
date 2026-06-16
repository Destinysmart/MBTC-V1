import { useEffect, useState } from "react";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { 
  ArrowRight, 
  BookOpen, 
  Download, 
  Github, 
  Bitcoin, 
  Sparkles, 
  Send, 
  Clock, 
  ChevronRight, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Coins,
  Search,
  ExternalLink,
  RotateCcw,
  Briefcase,
  Compass,
  Map,
  GraduationCap,
  Hammer,
  HelpCircle,
  Lightbulb,
  DollarSign,
  TrendingUp,
  Globe,
  Shuffle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types for Research Paper
interface ResearchPaper {
  id: string;
  title: string;
  subtitle: string;
  featured_image: string;
  category_id: string;
  status: string;
  abstract: string;
  github_repo: string;
  download_file: string;
  reading_time: string;
  content: string;
  published_at: string;
}

export function HomePage() {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<ResearchPaper[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal & Detail state
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [showDownloadAlert, setShowDownloadAlert] = useState<string | null>(null);

  // Molo AI Chat State
  const [userQuery, setUserQuery] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{role: "user" | "ai"; text: string}>>([
    { role: "ai", text: "Hey! I'm **Molo AI Explorer**, your guide to the African and global Bitcoin ecosystem. I write clear summaries of complex technical updates, developer tools, and lightning models. Ask me anything!" }
  ]);

  // UTXO Live Cash Simulator State
  const [aliceUTXOs, setAliceUTXOs] = useState<number[]>([50000, 20000, 10000]);
  const [merchantReceived, setMerchantReceived] = useState<number[]>([]);
  const [minerFees, setMinerFees] = useState<number>(0);
  const [simLog, setSimLog] = useState<string[]>([
    "Alice initialized her mobile wallet with 3 digital UTXO coins: 50,000 Sats, 20,000 Sats, and 10,000 Sats."
  ]);
  const [purchaseAmt, setPurchaseAmt] = useState<number>(8000);
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastTx, setLastTx] = useState<{
    spentCoins: number[];
    merchantPaid: number;
    fee: number;
    change: number;
    totalInput: number;
  } | null>(null);

  // Active perspective inside custom Orange Lens widget
  const [activePerspective, setActivePerspective] = useState<string>("inflation");

  // Active ecosystem card expanding detailed router options
  const [activeEcosystemTab, setActiveEcosystemTab] = useState<string>("learn");

  // Active African research lens chapter
  const [activeAfricanChapter, setActiveAfricanChapter] = useState<string>("inflation");

  const [perspectives, setPerspectives] = useState<any>({
    inflation: {
      title: "Inflation Guard",
      factLine: "Hedge local currency depreciation",
      stat: "Cedi/Naira/Pula vs BTC limits",
      description: "Unlike fiat systems subject to sudden sovereign supply spikes, Bitcoin strictly caps total supply at 21M, providing an immutable mathematical store of value.",
      highlight: "Nodes: Hard Cap ➔ 21M ➔ Distributed Hash Ledger"
    },
    inclusion: {
      title: "Financial Inclusion",
      factLine: "Open-source global settlement rails",
      stat: "USSD Tipping & Offline Nodes",
      description: "Bypasses geographical banking blockades using peer-to-peer lightning channels and offline USSD interfaces like Machankura, allowing anyone with a generic mobile phone to save and transact value.",
      highlight: "Nodes: USSD Gateway ➔ Lightning Node ➔ Instant Settlement"
    },
    mining: {
      title: "Energy & Mining Monetisation",
      factLine: "Bootstrapping remote mini-grids",
      stat: "Gridless Geothermal / Methane Capture",
      description: "Stranded energy from African waterfalls, gases, and rivers is harvested by flexible modular computing mines who purchase excess load, funding the setup of local mini-grids.",
      highlight: "Nodes: Excess Hydro ➔ Modular Container Miners ➔ Rural Power Grid"
    },
    remittance: {
      title: "Lightning Payments",
      factLine: "Ditching cross-border agency commissions",
      stat: "99% cheaper than legacy wire models",
      description: "Enables instant micro-remittances and trans-African trading over Layer 2 Lightning networks without intermediaries or currency conversion tariffs.",
      highlight: "Nodes: Sender Wallet ➔ Onion Routing Hub ➔ Payee Instantly"
    }
  });

  const [ecosystemTabs, setEcosystemTabs] = useState<any>({
    learn: {
      title: "Learn Bitcoin",
      subtitle: "Find educational pathways & resources",
      curatedPaths: [
        { name: "Saylor Academy - CS120 Bitcoin Course", url: "https://www.saylor.org/courses/cs120/", desc: "Free comprehensive computer science overview of Bitcoin architecture and logic." },
        { name: "Mi Primer Bitcoin (My First Bitcoin)", url: "https://miprimerbitcoin.io/", desc: "Open-source diploma curriculum designed for teaching high schools next-generation money." },
        { name: "Baka Academy", url: "https://github.com/molobtc", desc: "Interactive localized community meetups and digital resource guides across sub-Saharan Africa." }
      ]
    },
    build: {
      title: "Build Bitcoin",
      subtitle: "Developer pathways & open-source tools",
      curatedPaths: [
        { name: "Btrust Developer Fellowship", url: "https://btrust.org/", desc: "Mentorship and resources for African engineers seeking to become Bitcoin Core contributors." },
        { name: "Bitcoin Dev Kit (BDK)", url: "https://bitcoindevkit.org/", desc: "Simplified libraries for crafting multi-platform wallets and transaction scripts with ease." },
        { name: "Lightning Dev Kit (LDK)", url: "https://lightningdevkit.org/", desc: "Integrate lightning invoice routing directly inside custom client-side React apps." }
      ]
    },
    mine: {
      title: "Mine Bitcoin",
      subtitle: "Explore modular mining & energy operators",
      curatedPaths: [
        { name: "Gridless Energy Solutions", url: "https://gridless.com/", desc: "Leading the charge of distributed micro-mining grids using stranded hydro energy in East Africa." },
        { name: "Mining Mechanics Simplified Guide", url: "#research-workspace", desc: "Our downloadable handbook detailing hashing hardware, mining pools, and container setups." }
      ]
    },
    use: {
      title: "Use Bitcoin",
      subtitle: "Wallets, lightning tools & interfaces",
      curatedPaths: [
        { name: "Machankura USSD Wallet", url: "https://8333.mobi/", desc: "Send and receive Lightning satoshis using basic GSM feature phones without active internet." },
        { name: "Phoenix Wallet (Self-Custodial)", url: "https://phoenix.acinq.co/", desc: "Easiest zero-configuration custodial-free wallet handling lightning updates on the fly." },
        { name: "Alby Browser Extension", url: "https://getalby.com/", desc: "Direct web-based Lightning authorization for tipping, apps, and decentralized web interactions." }
      ]
    },
    work: {
      title: "Work in Bitcoin",
      subtitle: "Jobs, grants, fellowships & opportunities",
      curatedPaths: [
        { name: "Bitlance", url: "https://bitlance.work", desc: "A peer-to-peer freelancing and work-and-earn platform for Bitcoin and Lightning bounties." },
        { name: "Bitcoin Jobs Global Board", url: "https://bitcoinjobs.co/", desc: "Aggregated engineering, design, marketing, and editorial placements globally and remote." },
        { name: "Superlative Open Source Directory", url: "https://github.com/molobtc", desc: "Discover active bounties, developer fellowships, and localized community internships." }
      ]
    }
  });

  const [africanLensChapters, setAfricanLensChapters] = useState<any>({
    inflation: {
      header: "Bitcoin & Inflation Realities",
      location: "East & West Africa Core Trends",
      stat: "Average 15-30% currency adjustment",
      thesis: "When monetary councils issue double-digit fiat supplies to plug budget shortfalls, citizen purchasing power bleeds into sovereign reserves. Local developers and traders use Bitcoin's immutable 21 million hardcap as an inflation-impermeable safety net."
    },
    savings: {
      header: "Bitcoin Savings Dynamics",
      location: "Sub-Saharan Long-Term Treasury",
      stat: "24/7 Unstoppable Liquid Asset",
      thesis: "Traditional high-interest bank accounts fail to beat inflation and suffer from withdrawal ceilings. By storing capital in self-custody cold storage wallets, ordinary citizens run their own personal treasury systems with absolute sovereignty."
    },
    lightning: {
      header: "Remittance Over Lightning Networks",
      location: "Diaspora Trade Corridor Mapping",
      stat: "Fees slashed from 12% to under < 0.1%",
      thesis: "Western Union/fiat wire fees drain hundreds of millions annually from regional families. Lightning network routing operates natively across borders 24/7/365, settling instantly for fractions of a single satoshi cent."
    },
    energy: {
      header: "Stranded Energy Harvesting",
      location: "Rift Valley Geothermal & Run-of-River Hydro",
      stat: "Unlocking stranded rural potential",
      thesis: "High infrastructure costs prevent remote African regions from connecting to national power grids. Modular Bitcoin mining farms act as instant buyer-of-last-resort for remote hydro-turbines, subsidizing rural setup costs."
    },
    circular: {
      header: "Circular Satoshi Economies",
      location: "Bitcoin Ekasi (SA) & Local Mini-Markets",
      stat: "Closed-loop closed sovereign payments",
      thesis: "By keeping satoshis localized—enabling children, grocers, and micro-vendors to accept and spend lightning tips directly—local communities completely bypass high transaction taxes and centralized card tariffs."
    },
    momo: {
      header: "Mobile Money vs Bitcoin Interoperability",
      location: "USSD Tectonic Bridges",
      stat: "Bridging 500M+ active Momo accounts",
      thesis: "Mobile money (M-Pesa, MTN Mobile) is incredibly accessible but suffers from closed geographical boundaries. USSD-powered lightning bridges allow local mobile money providers to interact globally with the Bitcoin ledger."
    }
  });

  useEffect(() => {
    // Fetch dynamic content configurations
    fetch("/api/homepage/data")
      .then(r => r.json())
      .then(data => {
        if (data.perspectives && Object.keys(data.perspectives).length > 0) setPerspectives(data.perspectives);
        if (data.ecosystemTabs && Object.keys(data.ecosystemTabs).length > 0) setEcosystemTabs(data.ecosystemTabs);
        if (data.africanLensChapters && Object.keys(data.africanLensChapters).length > 0) setAfricanLensChapters(data.africanLensChapters);
      })
      .catch(console.error);

    // Fetch seeded Molo BTC research papers
    fetch("/api/articles?status=published")
      .then(r => r.json())
      .then(data => {
        setPapers(data);
        setFilteredPapers(data);
      })
      .catch(console.error);

    // Fetch workspace scientific categories
    fetch("/api/categories")
      .then(r => r.json())
      .then(data => setCategories(data))
      .catch(console.error);
  }, []);

  // Filter research papers based on category & search query
  useEffect(() => {
    let result = papers;
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(p => p.category_id === selectedCategory);
    }
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.subtitle.toLowerCase().includes(query) || 
        p.abstract.toLowerCase().includes(query)
      );
    }
    setFilteredPapers(result);
  }, [selectedCategory, searchQuery, papers]);

  // Handle Simulated PDF Download
  const handleDownload = (paper: ResearchPaper) => {
    setShowDownloadAlert(paper.title);
    setTimeout(() => {
      setShowDownloadAlert(null);
    }, 4500);

    // Trigger a system simulated download
    const element = document.createElement("a");
    const fileContent = `MOLO BTC RESEARCH WORKSPACE
============================
Paper: ${paper.title}
Subtitle: ${paper.subtitle}
Category ID: ${paper.category_id}
Published: ${new Date(paper.published_at).toLocaleDateString()}
Molo BTC GitHub Profile: https://github.com/molobtc
Original Source: ${paper.github_repo}

ABSTRACT:
${paper.abstract}

Visit https://github.com/molobtc to explore full open-source codes, LaTeX markups, and active pull requests on this paper!`;
    
    const file = new Blob([fileContent], {type: "text/plain"});
    element.href = URL.createObjectURL(file);
    element.download = paper.download_file.replace(".pdf", ".txt"); // Simple text download fallback
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Chat with Gemini API on Server
  const handleAiChat = async (promptText: string) => {
    if (!promptText.trim()) return;

    // Append user message
    setChatHistory(prev => [...prev, { role: "user", text: promptText }]);
    setUserQuery("");
    setIsAiLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: promptText,
          topic: selectedPaper ? selectedPaper.title : undefined
        }),
      });

      const data = await response.json();
      if (data.error) {
        setChatHistory(prev => [...prev, { 
          role: "ai", 
          text: `⚠️ Molo error: ${data.error}` 
        }]);
      } else {
        setChatHistory(prev => [...prev, { role: "ai", text: data.text }]);
      }
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { 
        role: "ai", 
        text: "🔌 Connection issue. It looks like the Gemini server is bootloading. Please check GEMINI_API_KEY inside the secrets drawer if this persists." 
      }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleUTXOPurchase = () => {
    if (aliceUTXOs.length === 0) return;
    setIsSimulating(true);

    const fee = 1000;
    const targetWithFee = purchaseAmt + fee;

    let selectedIndices: number[] = [];
    let fundAccumulated = 0;

    const sortedWithIndices = aliceUTXOs.map((val, idx) => ({ val, idx })).sort((a,b) => a.val - b.val);
    
    const singleCover = sortedWithIndices.find(item => item.val >= targetWithFee);
    if (singleCover) {
      selectedIndices = [singleCover.idx];
      fundAccumulated = singleCover.val;
    } else {
      for (const item of sortedWithIndices) {
        selectedIndices.push(item.idx);
        fundAccumulated += item.val;
        if (fundAccumulated >= targetWithFee) break;
      }
    }

    if (fundAccumulated < targetWithFee) {
      setSimLog(prev => [
        `❌ Insufficient funds! Alice tried to pay ${purchaseAmt.toLocaleString()} Sats + ${fee.toLocaleString()} Sats fee but her total coins sum to only ${fundAccumulated.toLocaleString()} Sats.`,
        ...prev
      ]);
      setIsSimulating(false);
      return;
    }

    const unselectedUTXOs = aliceUTXOs.filter((_, idx) => !selectedIndices.includes(idx));
    const spentCoins = selectedIndices.map(idx => aliceUTXOs[idx]);
    const spentString = spentCoins.map(val => `${val.toLocaleString()} Sats`).join(" + ");

    setTimeout(() => {
      const change = fundAccumulated - purchaseAmt - fee;
      
      setAliceUTXOs(change > 0 ? [...unselectedUTXOs, change] : unselectedUTXOs);
      setMerchantReceived(prev => [...prev, purchaseAmt]);
      setMinerFees(prev => prev + fee);
      
      setLastTx({
        spentCoins,
        merchantPaid: purchaseAmt,
        fee,
        change,
        totalInput: fundAccumulated
      });
      
      setSimLog(prev => [
        `🎉 Transaction Completed! Spent UTXOs: [${spentString}] (Total Input: ${fundAccumulated.toLocaleString()} Sats).`,
        `👉 Outputs Created: 1 Paid to Merchant (${purchaseAmt.toLocaleString()} Sats), 1 Miner fee paid (${fee.toLocaleString()} Sats), and 1 Change UTXO returned to Alice (${change.toLocaleString()} Sats).`,
        ...prev
      ]);
      setIsSimulating(false);
    }, 850);
  };

  const resetUTXOSimulator = () => {
    setAliceUTXOs([50000, 20000, 10000]);
    setMerchantReceived([]);
    setMinerFees(0);
    setLastTx(null);
    setSimLog(["Alice wallet re-initialized with 3 active digital coins (UTXOs): 50,000 Sats, 20,000 Sats, and 10,000 Sats."]);
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7] text-gray-900 font-sans selection:bg-brand-500 selection:text-white scroll-smooth">
      <SEO 
        title="moloBTC - Africa's Bitcoin Research & Discovery Platform" 
        description="See Bitcoin through the Orange Lens. Discover curated pathways, simplified research, directories and opportunities across the African Bitcoin ecosystem." 
      />
      <Navigation />

      {/* Hero Header */}
      <header className="relative py-16 lg:py-24 overflow-hidden border-b border-gray-100 bg-gradient-to-b from-[#FFFBF7] to-[#FAF6F0]">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-200/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-6 lg:gap-12 items-center">
            
            {/* HERO LEFT: NEW REPOSITIONED HEADING & TEXT */}
            <div className="md:col-span-6 lg:col-span-6 flex flex-col items-start text-left">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1 text-xs font-bold text-brand-700 mb-6 tracking-wide uppercase"
              >
                <Globe className="h-3.5 w-3.5 text-brand-500 animate-pulse" />
                <span className="hidden sm:inline">Africa's Bitcoin Research & Discovery Platform</span>
                <span className="inline sm:hidden">Africa's Bitcoin Hub</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="heading-display text-4xl sm:text-5xl md:text-[32px] lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-[1.1] md:leading-[1.15] lg:leading-[1.1] mb-6 md:mb-4 lg:mb-6"
              >
                See Bitcoin Through <br />
                <span className="text-brand-500 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text">The Orange Lens</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg md:text-sm lg:text-lg text-gray-650 leading-relaxed max-w-xl mb-8 md:mb-5 lg:mb-8"
              >
                moloBTC helps Africans understand, explore, and navigate Bitcoin through research, simplified explanations, and curated pathways into learning, building, mining, and earning.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-4 md:gap-2.5 lg:gap-4 w-full"
              >
                <a 
                  href="#research" 
                  className="rounded-xl bg-gray-950 px-6 py-3.5 md:px-4 md:py-2.5 lg:px-6 lg:py-3.5 text-sm md:text-xs lg:text-sm font-semibold text-white hover:bg-gray-800 transition-all shadow-md inline-flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Explore Research
                </a>
                <a 
                  href="#discover"
                  className="rounded-xl border border-gray-200 bg-white px-6 py-3.5 md:px-4 md:py-2.5 lg:px-6 lg:py-3.5 text-sm md:text-xs lg:text-sm font-semibold text-gray-805 hover:bg-gray-50 transition-all inline-flex items-center gap-2 shadow-sm"
                >
                  <Compass className="w-4 h-4 text-brand-500" />
                  <span>Discover Ecosystem</span>
                </a>
              </motion.div>
            </div>

            {/* HERO RIGHT: THE SPECTACULAR ORANGE LENS IMAGE */}
            <div className="md:col-span-6 lg:col-span-6 w-full relative flex flex-col items-center justify-center mt-8 md:mt-0 lg:mt-0">
              <div className="absolute w-80 h-80 bg-brand-200/35 rounded-full blur-3xl pointer-events-none animate-pulse" />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative z-10 w-full max-w-lg bg-white rounded-3xl p-4 shadow-2xl border border-gray-150 overflow-hidden"
              >
                {/* Image Frame */}
                <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden bg-gray-50 relative border border-gray-100">
                  <img
                    src="/src/assets/images/molo_sunglasses_hero_1781541960376.jpg"
                    alt="moloBTC - See Bitcoin Through The Orange Lens"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle Dark Glow gradient overlays on the image to make text readable */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating badge inside image */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-brand-500/90 text-white font-mono text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-sm shadow-md inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-white" />
                      ORANGE LENS VIEW
                    </span>
                  </div>

                  {/* Fact line at the bottom of the image */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                    <p className="text-[10px] font-mono text-brand-300 uppercase tracking-widest leading-none mb-1">Perspective Focus</p>
                    <p className="font-extrabold text-sm tracking-tight drop-shadow-sm">{perspectives[activePerspective].title} — {perspectives[activePerspective].factLine}</p>
                  </div>
                </div>

                {/* Perspective selector beneath image to maintain active utility */}
                <div className="mt-4 p-3 bg-gray-50 rounded-2xl border border-gray-100 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">Select Lens Perspective</span>
                    <span className="text-[10px] text-brand-600 font-bold font-mono">{perspectives[activePerspective].stat}</span>
                  </div>
                  <p className="text-xs text-gray-650 leading-relaxed mb-3">
                    {perspectives[activePerspective].description}
                  </p>
                  <p className="text-xs font-mono font-bold text-gray-900 mb-3 bg-brand-50 p-2 rounded-xl border border-brand-100">
                    {perspectives[activePerspective].highlight}
                  </p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {Object.keys(perspectives).map((k) => (
                      <button
                        key={k}
                        onClick={() => setActivePerspective(k as any)}
                        className={`py-2 px-1 rounded-xl text-[10px] sm:text-[11px] md:text-[9.5px] lg:text-[11px] font-black uppercase tracking-tight transition-all border outline-none ${
                          activePerspective === k 
                            ? "bg-brand-500 text-white border-brand-500 shadow-sm shadow-brand-500/20" 
                            : "bg-white text-gray-650 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {perspectives[k as keyof typeof perspectives].title.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* DOWNLOAD SUCCESS ALERT */}
        <AnimatePresence>
          {showDownloadAlert && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="fixed bottom-6 right-6 z-[80] max-w-md bg-white rounded-2xl border-l-4 border-brand-500 shadow-2xl p-5 flex items-start gap-4 border border-gray-100"
            >
              <div className="flex-shrink-0 bg-brand-50 text-brand-600 rounded-xl p-2.5">
                <Download className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="flex-grow">
                <span className="font-bold text-gray-950 block text-sm">Download Started!</span>
                <span className="text-xs text-gray-500 mt-1 block leading-relaxed">
                  You have downloaded the summary text file for <strong>"{showDownloadAlert}"</strong>. Visit our physical GitHub repo to check active code drafts.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SECTION: WHY WE EXIST */}
        <section id="about" className="scroll-margin-top mb-24 max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-150/80 shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 h-64 w-64 rounded-full bg-brand-50/30 blur-3xl pointer-events-none" />
            
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-2.5 py-1 rounded-md">Curating the Scattered Ledger</span>
              <h2 className="heading-display text-2xl sm:text-4xl font-extrabold text-gray-950 mt-3">Why We Exist</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              
              {/* Scattered facts list */}
              <div className="space-y-4">
                {[
                  "Bitcoin information is scattered.",
                  "Courses live in one place.",
                  "Builders in another.",
                  "Researchers somewhere else.",
                  "Mining knowledge is difficult to find.",
                  "Opportunities are often hidden."
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-red-50/30 p-2.5 rounded-xl border border-red-50/50">
                    <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                    <p className="text-xs sm:text-sm text-gray-700 font-semibold">{item}</p>
                  </div>
                ))}
              </div>

              {/* Connected Solution Block */}
              <div className="h-full bg-brand-50/20 border border-brand-200 p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-12 -bottom-12 w-32 h-32 text-brand-500/10 rotate-12 pointer-events-none">
                  <Bitcoin className="w-full h-full" />
                </div>

                <div className="space-y-4">
                  <div className="inline-flex gap-2 items-center bg-brand-500/10 border border-brand-500/20 px-3 py-1 rounded-full text-xs font-bold text-brand-700">
                    <Sparkles className="w-3.5 h-3.5" />
                    Connecting the dots
                  </div>
                  <h3 className="heading-display text-xl font-bold text-gray-950">
                    The routing node of the African Bitcoin community
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-650 leading-relaxed">
                    moloBTC exists to connect the dots. We simplify technical or monetary Bitcoin research and help people instantly find the right resources, communities, builders, and active opportunities across the continent.
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-brand-600">
                  <span>How we connect the ecosystem</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-500" />
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION: THREE PILLARS CORES */}
        <section className="mb-24">
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Pillar 1: Research */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm hover:shadow-xl transition-all hover:border-brand-100 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-orange-50 text-brand-500 rounded-2xl flex items-center justify-center border border-brand-100">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="heading-display text-xl sm:text-2xl font-bold text-gray-950">Research</h3>
                <p className="text-gray-550 text-xs sm:text-sm leading-relaxed">
                  Technical Bitcoin concepts simplified into clear, visual, beginner-friendly explanations.
                </p>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {["Proof of Work", "Lightning Network", "Self-Custody", "Monetary Economics"].map((tag) => (
                    <span key={tag} className="bg-gray-50 text-gray-500 font-mono text-[9px] px-2 py-0.5 rounded border border-gray-150">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <a href="#research" className="mt-8 text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1">
                Explore research catalog <ChevronRight className="w-3 h-3" />
              </a>
            </div>

            {/* Pillar 2: Discover */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm hover:shadow-xl transition-all hover:border-brand-100 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-orange-50 text-brand-500 rounded-2xl flex items-center justify-center border border-brand-100">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="heading-display text-xl sm:text-2xl font-bold text-gray-950">Discover</h3>
                <p className="text-gray-550 text-xs sm:text-sm leading-relaxed">
                  Curated Bitcoin tools, wallets, educational resources, projects, and ecosystem directories.
                </p>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {["Wallet specs", "Learning plans", "Mining tech", "Builder directories"].map((tag) => (
                    <span key={tag} className="bg-gray-50 text-gray-500 font-mono text-[9px] px-2 py-0.5 rounded border border-gray-150">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <a href="#discover" className="mt-8 text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1">
                Discover local pathways <ChevronRight className="w-3 h-3" />
              </a>
            </div>

            {/* Pillar 3: Connect */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm hover:shadow-xl transition-all hover:border-brand-100 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-orange-50 text-brand-500 rounded-2xl flex items-center justify-center border border-brand-100">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="heading-display text-xl sm:text-2xl font-bold text-gray-950">Connect</h3>
                <p className="text-gray-550 text-xs sm:text-sm leading-relaxed">
                  Helping people find communities, remote jobs, open source grants, circular networks, and meetups.
                </p>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {["Bitcoin jobs", "Code grants", "Mining channels", "Circular markets"].map((tag) => (
                    <span key={tag} className="bg-gray-50 text-gray-500 font-mono text-[9px] px-2 py-0.5 rounded border border-gray-150">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <a href="#discover" className="mt-8 text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1">
                Browse opportunities <ChevronRight className="w-3 h-3" />
              </a>
            </div>

          </div>
        </section>

        {/* SECTION: NEW RESEARCH THAT MAKES BITCOIN EASY TO UNDERSTAND */}
        <section id="research" className="scroll-margin-top mb-24">
          
          {/* Repositioned Research Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-gray-100 pb-8 gap-6">
            <div className="max-w-2xl">
              <span className="text-[11px] font-bold text-brand-600 uppercase tracking-widest block mb-2">curated archives</span>
              <h2 className="heading-display text-2xl sm:text-4xl font-extrabold text-gray-950">
                Research That Makes Bitcoin Easier To Understand
              </h2>
              <p className="text-gray-650 text-xs sm:text-sm mt-3 leading-relaxed">
                We translate complex Bitcoin topics into practical, beginner-friendly research designed to help Africans understand Bitcoin without requiring a technical background.
              </p>
            </div>

            {/* Quick search */}
            <div className="relative w-full max-w-sm shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 stroke-[2]" />
              <input 
                type="text" 
                placeholder="Search specific summaries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === "all" 
                  ? "bg-gray-950 text-white shadow-md shadow-gray-950/20" 
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              All Articles
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === cat.id 
                    ? "bg-gray-950 text-white shadow-md shadow-gray-950/20" 
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Research Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredPapers.map((paper, idx) => (
                <motion.div
                  key={paper.id}
                  layoutId={`paper-card-${paper.id}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between overflow-hidden hover:shadow-xl hover:border-brand-100 transition-all group cursor-pointer"
                  onClick={() => setSelectedPaper(paper)}
                >
                  <div className="p-6">
                    {/* Header bar */}
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2 text-xs font-mono">
                      <span className="bg-brand-50 font-bold text-brand-700 px-2 py-1 rounded">
                        {categories.find(c => c.id === paper.category_id)?.name || "Protocol"}
                      </span>
                      <span className="text-gray-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {paper.reading_time}
                      </span>
                    </div>

                    <h3 className="heading-display font-extrabold text-lg sm:text-xl text-gray-950 leading-snug group-hover:text-brand-500 transition-colors mb-2 pr-6">
                      {paper.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-gray-500 italic mb-4 leading-relaxed pr-2">
                      "{paper.subtitle}"
                    </p>

                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 bg-[#FCFAF7] p-3 rounded-xl border border-gray-100">
                      <strong>Abstract: </strong>{paper.abstract}
                    </p>
                  </div>

                  {/* Foot panel with action indicators */}
                  <div className="bg-[#FFFDFB] border-t border-gray-50 px-6 py-4 flex items-center justify-between">
                    <span className="text-xs font-semibold text-brand-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5">
                      Open summary breakdown <ArrowRight className="w-4 h-4" />
                    </span>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid opening paper detail modal
                        handleDownload(paper);
                      }}
                      className="p-2 bg-white hover:bg-gray-100 border border-gray-200 hover:border-brand-500 text-gray-650 hover:text-brand-600 rounded-xl transition-all shadow-sm"
                      title="Download text digest version"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredPapers.length === 0 && (
              <div className="col-span-2 text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                <Bitcoin className="w-12 h-12 text-gray-300 mx-auto mb-4 stroke-[1.5]" />
                <p className="font-bold text-gray-600">No matching research cards found</p>
                <p className="text-gray-450 text-xs mt-1">Try resetting the category filter or changing the search query</p>
              </div>
            )}
          </div>
        </section>

        {/* ECOSYSTEM INTEGRATION EXPLORER */}
        <section id="discover" className="scroll-margin-top mb-24">
          <div className="bg-[#120F0D] text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-brand-900/40 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl mb-10">
              <span className="inline-block bg-brand-950/80 text-brand-400 border border-brand-900/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                Bitcoin Ecosystem directory
              </span>
              <h2 className="heading-display text-2xl sm:text-4xl font-extrabold text-white mb-3">
                Discover The Bitcoin Ecosystem
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                We act as a clean informational routing board. Select any ecosystem sector below to find curated, vetted learning pathways, open-source code repositories, wallets, and remote placement hubs.
              </p>
            </div>

            {/* Sectors Grid/Selections */}
            <div className="grid lg:grid-cols-12 gap-8 items-start relative z-10">
              
              <div className="lg:col-span-4 flex flex-col gap-2">
                {[
                  { key: "learn", title: "Learn Bitcoin", desc: "Courses, academies & curriculum structures." },
                  { key: "build", title: "Build Bitcoin", desc: "Developer tools & Btrust programming paths." },
                  { key: "mine", title: "Mine Bitcoin", desc: "Modular hydro grids, containers & models." },
                  { key: "use", title: "Use Bitcoin", desc: "Vetted Lightning wallets, browser expansions & hubs." },
                  { key: "work", title: "Work In Bitcoin", desc: "Remote placements, open grants & Geyser hubs." }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveEcosystemTab(item.key)}
                    className={`text-left p-4 rounded-2xl transition-all border outline-none ${
                      activeEcosystemTab === item.key
                        ? "bg-brand-500 border-brand-500 text-white shadow-lg"
                        : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm sm:text-base">{item.title}</span>
                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${activeEcosystemTab === item.key ? "translate-x-1 text-white" : "text-gray-500"}`} />
                    </div>
                    <p className={`text-[11px] leading-snug ${activeEcosystemTab === item.key ? "text-white/80" : "text-gray-400"}`}>{item.desc}</p>
                  </button>
                ))}
              </div>

              {/* Curated routes panel */}
              <div className="lg:col-span-8 bg-white/5 border border-white/10 p-6 rounded-3xl min-h-[380px] flex flex-col justify-between">
                <div>
                  <div className="border-b border-white/10 pb-4 mb-6">
                    <h3 className="heading-display text-xl font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-brand-400" />
                      <span>{ecosystemTabs[activeEcosystemTab].title}</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">{ecosystemTabs[activeEcosystemTab].subtitle}</p>
                  </div>

                  <div className="space-y-4">
                    {ecosystemTabs[activeEcosystemTab].curatedPaths.map((path, idx) => (
                      <div 
                        key={idx}
                        className="bg-white/[0.02] border border-white/5 hover:border-brand-500/30 p-4 rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-brand-300">{path.name}</span>
                          <p className="text-[11px] text-gray-400 leading-normal">{path.desc}</p>
                        </div>
                        {path.url && path.url !== "#research-workspace" ? (
                          <a
                            href={path.url}
                            target="_blank"
                            rel="noreferrer"
                            className="shrink-0 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-center inline-flex items-center gap-1 self-start sm:self-center"
                          >
                            <span>Visit Site</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <a
                            href="#research-workspace"
                            className="shrink-0 bg-brand-500/20 text-brand-300 border border-brand-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-center self-start sm:self-center"
                          >
                            View Manual
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 text-center sm:text-left">
                  <p className="text-[11px] text-gray-400">
                    Are you building an open-source African Bitcoin project? 
                    <a href="https://github.com/molobtc" target="_blank" rel="noreferrer" className="text-brand-400 font-bold hover:underline inline-flex items-center gap-0.5 ml-1">
                      Submit a pull-request to our directory <ExternalLink className="w-2.5 h-2.5 inline" />
                    </a>
                  </p>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* SECTION: NEW FEATURED AFRICAN RESEARCH CHAPTERS */}
        <section className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-2.5 py-1 rounded-md">African Geopolitics & Adoption</span>
            <h2 className="heading-display text-2xl sm:text-4xl font-extrabold text-gray-950 mt-3 mb-4">Research Through An African Lens</h2>
            <p className="text-xs sm:text-sm text-gray-650 leading-relaxed">
              We focus on how Bitcoin interacts with the economic realities of the African continent—from local currency inflation and cross-border remittance costs to off-grid rural power generation.
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-start">
            
            {/* Chapters navigation */}
            <div className="md:col-span-4 flex flex-col gap-2">
              {[
                { k: "inflation", label: "Bitcoin & Inflation" },
                { k: "savings", label: "Savings & Vaults" },
                { k: "lightning", label: "Lightning Remittance" },
                { k: "energy", label: "Energy & Mining" },
                { k: "circular", label: "Circular Markets" },
                { k: "momo", label: "Mobile Money & L2 Bridge" }
              ].map((chap) => (
                <button
                  key={chap.k}
                  onClick={() => setActiveAfricanChapter(chap.k)}
                  className={`text-left p-3.5 rounded-xl border font-bold text-xs sm:text-sm transition-all focus:outline-none flex justify-between items-center ${
                    activeAfricanChapter === chap.k 
                      ? "bg-brand-50 border-brand-200 text-brand-700" 
                      : "bg-white border-gray-100 hover:border-gray-200 text-gray-600"
                  }`}
                >
                  <span>{chap.label}</span>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${activeAfricanChapter === chap.k ? "translate-x-1 text-brand-500" : "text-gray-300"}`} />
                </button>
              ))}
            </div>

            {/* Expanded Insight Plate */}
            <div className="md:col-span-8 bg-white border border-gray-150 p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-sm min-h-[300px] flex flex-col justify-between">
              <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 text-brand-50/20 rotate-12 pointer-events-none w-48 h-48">
                <Bitcoin className="w-full h-full" />
              </div>

              <div className="space-y-4 relative z-10 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gray-400 block tracking-wider">Chapter profile</span>
                    <h3 className="heading-display text-xl sm:text-2xl font-black text-gray-950">
                      {africanLensChapters[activeAfricanChapter].header}
                    </h3>
                  </div>
                  <span className="text-[10px] text-brand-600 font-bold bg-brand-50 border border-brand-100 rounded px-2.5 py-1 self-start sm:self-center">
                    {africanLensChapters[activeAfricanChapter].location}
                  </span>
                </div>

                <div className="bg-orange-50/50 p-3 rounded-xl border border-brand-100/50 text-xs text-brand-800 font-semibold inline-block">
                  🎯 Focus Metric: {africanLensChapters[activeAfricanChapter].stat}
                </div>

                <p className="text-xs sm:text-sm text-gray-650 leading-relaxed pt-2">
                  {africanLensChapters[activeAfricanChapter].thesis}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between relative z-10 text-xs">
                <span className="text-gray-400">Want deeper empirical spreadsheets and graphs?</span>
                <a href="#research" className="text-brand-600 font-bold hover:underline inline-flex items-center gap-0.5">
                  Browse papers <ChevronRight className="w-3.5 h-3.5 inline" />
                </a>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION: INTERACTIVE UTXO SIMULATOR (Collapsible sandbox) */}
        <section className="mb-24 bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden p-6 sm:p-10">
          <div className="grid md:grid-cols-12 gap-10 items-stretch">
            
            {/* Explainer pane */}
            <div className="md:col-span-5 text-left flex flex-col justify-between">
              <div>
                <span className="bg-brand-50 text-brand-700 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md mb-4 inline-block">
                  Interactive Learning Sandbox
                </span>
                <h2 className="heading-display text-2xl sm:text-3xl font-extrabold text-gray-950 mb-4">
                  The UTXO "Cash" Simulator
                </h2>
                <p className="text-sm text-gray-650 leading-relaxed mb-6">
                  Unlike traditional banks which simply subtract numbers from a total balance on their servers, Bitcoin behaves like <strong>physical paper bills or gold coins</strong> inside a real leather wallet. We call these individual digital coins <strong>UTXOs</strong> (Unspent Transaction Outputs).
                </p>
                
                <div className="space-y-4 p-4 bg-orange-50/30 rounded-2xl border border-orange-100/60">
                  <span className="text-xs font-bold text-brand-900 block uppercase tracking-wider">How to play:</span>
                  <div className="space-y-3.5 text-xs">
                    <div className="flex gap-2.5 items-start">
                      <div className="bg-brand-100 text-brand-800 font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0 font-mono">1</div>
                      <p className="text-gray-650 leading-relaxed">Select an item below (like Espresso or Data) and click <strong>"Send Transaction"</strong>.</p>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <div className="bg-brand-100 text-brand-800 font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0 font-mono">2</div>
                      <p className="text-gray-650 leading-relaxed">Watch how Alice's wallet automatically selects the best coin, melts it down, and pays the retailer.</p>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <div className="bg-brand-100 text-brand-800 font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0 font-mono">3</div>
                      <p className="text-gray-650 leading-relaxed">Observe how the protocol returns any remaining balance as a brand new <strong>change coin</strong> back to Alice!</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={resetUTXOSimulator}
                  className="text-xs font-bold text-gray-550 hover:text-brand-600 flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Wallet & Clear Simulator
                </button>
              </div>
            </div>

            {/* Simulated Live Stage */}
            <div className="md:col-span-7 space-y-6">
              
              {/* STEP 1: INPUT – Available Unspent Coins */}
              <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-xs text-left">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="bg-amber-100 text-amber-950 text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md inline-flex items-center gap-1 font-mono">
                    📥 Step 1: Input (Wallet Coins)
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">Unspent Transaction Outputs (UTXOs)</span>
                </div>

                <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">
                  Bitcoin doesn't have a single "balance" number. Instead, your wallet stores individual, distinct digital coin tokens. These are the <strong>Inputs</strong> used for making a payment.
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {aliceUTXOs.map((coin, index) => (
                    <motion.div
                      layout
                      key={index}
                      className="bg-gradient-to-br from-[#FFF8F2] to-[#FFECD9] border-2 border-[#FFE2C8] rounded-2xl p-3 shadow-xs text-center cursor-default flex flex-col items-center group hover:border-brand-300 hover:shadow-md transition-all duration-300 relative overflow-hidden"
                    >
                      <span className="absolute -right-3 -top-3 text-[50px] font-bold text-brand-200/10 rotate-12 select-none pointer-events-none">₿</span>
                      
                      <div className="p-2 bg-brand-500/10 text-brand-600 rounded-full mb-1">
                        <Coins className="w-4 h-4" />
                      </div>
                      <span className="font-mono font-extrabold text-xs sm:text-sm text-brand-950">{coin.toLocaleString()}</span>
                      <span className="text-[10px] font-black text-brand-500 font-mono tracking-tighter uppercase mt-0.5">Sats</span>
                      <div className="text-[9px] text-gray-400 font-mono mt-1 border-t border-brand-100/50 pt-1 w-full">
                        ~${(coin * 0.00068).toFixed(2)} USD
                      </div>
                    </motion.div>
                  ))}

                  {aliceUTXOs.length === 0 && (
                    <div className="col-span-3 text-center py-6 bg-red-50/50 border border-red-100 rounded-xl">
                      <span className="text-xs text-red-600 font-semibold block">Empty Wallet!</span>
                      <button 
                        type="button"
                        onClick={resetUTXOSimulator}
                        className="mt-2 text-[10px] font-bold text-brand-600 hover:underline"
                      >
                        Click here to reset with default cash coins
                      </button>
                    </div>
                  )}
                </div>

                {aliceUTXOs.length > 0 && (
                  <div className="text-xs text-gray-550 mt-4 flex items-center justify-between bg-[#FCFAF7] px-3 py-2 rounded-xl border border-gray-150">
                    <span className="font-medium text-gray-500">Aggregated Pocket Balance:</span>
                    <strong className="font-mono text-gray-900 font-bold bg-white px-2 py-0.5 rounded border border-gray-100">
                      {(aliceUTXOs.reduce((a,b)=>a+b, 0)).toLocaleString()} Sats (~${((aliceUTXOs.reduce((a,b)=>a+b, 0)) * 0.00068).toFixed(2)} USD)
                    </strong>
                  </div>
                )}
              </div>

              {/* STEP 2: TRANSACTION PROCESSING – Auto-Selecting & Melting */}
              <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-xs text-left">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-950 text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md inline-flex items-center gap-1 font-mono">
                    ⚙️ Step 2: Transaction Processing
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">Auto-selecting coins</span>
                </div>

                <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">
                  When you make a payment, your wallet protocol automatically picks the best combination of input coins, melts them together, and prepares the output split.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <select 
                    className="w-full bg-white border-2 border-gray-150 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-700 outline-none focus:border-brand-500 transition-all font-medium"
                    value={purchaseAmt}
                    onChange={(e) => setPurchaseAmt(parseInt(e.target.value))}
                  >
                    <option value="8000">☕ Fresh Double Espresso Meal — 8,000 Sats (~$5.44)</option>
                    <option value="18000">📱 2GB Weekly Internet Data Bundle — 18,000 Sats (~$12.24)</option>
                    <option value="35000">📚 Sovereignty eBook (Basics Guide) — 35,000 Sats (~$23.80)</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleUTXOPurchase}
                    disabled={isSimulating || aliceUTXOs.length === 0}
                    className="w-full sm:w-auto shrink-0 bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white rounded-xl px-6 py-2.5 font-bold text-xs sm:text-sm transition-all disabled:opacity-40 shadow-sm inline-flex items-center justify-center gap-2 select-none"
                  >
                    {isSimulating ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Bitcoin className="w-4 h-4 text-white" />
                    )}
                    Send Transaction
                  </button>
                </div>
              </div>

              {/* STEP 3: OUTPUT – Result, Splitting & Change returned */}
              <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-xs text-left">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="bg-green-100 text-green-950 text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md inline-flex items-center gap-1 font-mono">
                    📤 Step 3: Output (Change & Split)
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">Fresh output tokens created</span>
                </div>

                <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">
                  A finalized transaction produces brand new outputs: one paid to the merchant, one tipped to network miners as a standard fee, and a brand-new "Change" coin returned directly to you.
                </p>

                {/* VISUAL SPLITTING DIAGRAM */}
                <AnimatePresence mode="wait">
                  {lastTx ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-brand-500/5 border border-brand-200/60 rounded-xl p-4 text-left text-xs mb-4"
                    >
                      <span className="text-[9px] font-bold text-brand-800 tracking-wider uppercase block mb-3 font-mono">
                        🔍 VISUAL SPLITTING DIAGRAM (Latest Tx Explained)
                      </span>
                      
                      <div className="bg-white p-3.5 rounded-xl border border-brand-100 flex flex-col md:flex-row items-stretch justify-between gap-4 text-center">
                        
                        {/* Left: Spent coin */}
                        <div className="flex-1 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 pb-3 md:pb-0 md:pr-3">
                          <span className="text-[9px] text-gray-400 block uppercase font-mono mb-1">Melted Input Coin</span>
                          <div className="px-2.5 py-1 bg-amber-50 border border-amber-200 rounded font-mono font-bold text-xs text-amber-950">
                            {lastTx.spentCoins.map(val => val.toLocaleString()).join(" + ")} Sats
                          </div>
                        </div>

                        {/* Middle: Split flow detail lists */}
                        <div className="flex-2 flex flex-col justify-center text-left space-y-1.5 md:px-2 min-w-[160px]">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-gray-500">Retailer payment:</span>
                            <span className="font-mono font-bold text-gray-800">{lastTx.merchantPaid.toLocaleString()} Sats</span>
                          </div>
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-gray-500">Miner fee (Tip):</span>
                            <span className="font-mono font-bold text-gray-800">{lastTx.fee.toLocaleString()} Sats</span>
                          </div>
                          <div className="flex justify-between items-center text-[11px] text-green-700 bg-green-50 px-2 py-0.5 rounded mt-1 border border-green-100">
                            <span className="font-semibold">Alice's Change Output:</span>
                            <span className="font-mono font-bold">{lastTx.change.toLocaleString()} Sats</span>
                          </div>
                        </div>

                      </div>

                      <p className="text-[11px] text-gray-650 leading-relaxed mt-3 px-1">
                        💡 <strong>What happened:</strong> Since Alice didn't have a coin matching the exact coffee price, she used her coin(s) totaling <strong>{lastTx.totalInput.toLocaleString()} Sats</strong>. The transaction split that amount, paying the retailer, tipping the network <strong>{lastTx.fee.toLocaleString()} Sats</strong>, and sending a new <strong>{lastTx.change.toLocaleString()} Sats</strong> change coin back to her wallet.
                      </p>
                    </motion.div>
                  ) : (
                    <div className="border border-dashed border-gray-200 text-center py-6 rounded-xl mb-4 bg-gray-50/50">
                      <p className="text-xs text-gray-400 font-medium">Click "Send Transaction" under Step 2 to generate your Output Split Diagram!</p>
                    </div>
                  )}
                </AnimatePresence>

                {/* Merchant received & Miner block values */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-xs text-left">
                  <div className="bg-[#FCFAF7] p-3.5 rounded-xl border border-gray-150">
                    <span className="text-gray-400 block mb-1">🏦 Cafe/Merchant Got:</span>
                    <span className="font-mono font-bold text-gray-800 text-sm">
                      {merchantReceived.length > 0 ? `${(merchantReceived.reduce((a,b)=>a+b, 0)).toLocaleString()} Sats` : "0 Sats"}
                    </span>
                    <span className="text-[9px] text-gray-400 block mt-1 font-mono">({merchantReceived.length} item(s) purchased)</span>
                  </div>
                  <div className="bg-[#FCFAF7] p-3.5 rounded-xl border border-gray-150">
                    <span className="text-gray-400 block mb-1">⛏️ Accumulated Miner Fee:</span>
                    <span className="font-mono font-bold text-gray-800 text-sm">{(minerFees).toLocaleString()} Sats</span>
                    <span className="text-[9px] text-gray-400 block mt-1 font-mono">({(1000).toLocaleString()} Sats standard fee per card)</span>
                  </div>
                </div>

                {/* Console log */}
                <div className="bg-gray-950 text-green-400 rounded-xl p-4 font-mono text-[10px] text-left max-h-[120px] overflow-y-auto">
                  <span className="text-gray-500 border-b border-gray-850 pb-1 mb-2 block font-sans font-bold">Live consensus receipts</span>
                  <div className="space-y-1">
                    {simLog.map((log, i) => (
                      <div key={i} className="leading-normal">
                        &gt; {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION: MOLO AI EXPLORER TUTOR */}
        <section id="opportunities" className="mb-12 bg-[#120F0D] text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          <span id="ai-explorer" className="absolute top-0 left-0" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-brand-900/40 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 grid lg:grid-cols-12 gap-10">
            
            {/* Title & guidance */}
            <div className="lg:col-span-4 text-left flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 bg-brand-950/80 px-2.5 py-1 rounded border border-brand-900/50 mb-4 tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
                  Molo AI chat
                </div>
                <h3 className="heading-display text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-4">
                  AI Explorer & Community Router
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">
                  Not sure where to begin your journey, how lightning payment splits work, or where to find active developer programs in Nigeria, Kenya, or South Africa? Ask Molo AI.
                </p>
              </div>

              {/* Sample queries */}
              <div className="space-y-2 mt-4 lg:mt-0 text-left font-sans">
                <span className="text-[10px] font-bold text-gray-550 uppercase tracking-wider block">Frequently Asked Queries:</span>
                {[
                  "Where can a developer find open source Bitcoin jobs?",
                  "Explain Lightning Onion routing in simple terms",
                  "What are active Bitcoin circular communities in Africa?",
                  "Why does USSD technology help people receive Satoshi payments offline?"
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleAiChat(q)}
                    disabled={isAiLoading}
                    className="w-full text-left text-xs bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-500/50 p-2.5 rounded-lg transition-all line-clamp-1 block text-gray-300 transition-colors"
                  >
                    🚀 {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat output */}
            <div className="lg:col-span-8 flex flex-col h-[400px] bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
              
              {/* Chat body */}
              <div className="flex-grow p-4 overflow-y-auto space-y-4 text-xs font-sans text-left">
                {chatHistory.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl p-4 leading-relaxed ${
                      item.role === 'user' 
                        ? 'bg-brand-600 text-white rounded-br-none font-semibold' 
                        : 'bg-white/5 border border-white/10 text-gray-100 rounded-bl-none'
                    }`}>
                      {item.text.split("\n").map((line, lIdx) => {
                        let parts = line.split("**");
                        return (
                          <p key={lIdx} className={lIdx > 0 ? "mt-2" : ""}>
                            {parts.map((part, pIdx) => 
                              pIdx % 2 === 1 ? <strong key={pIdx} className="text-brand-300 font-bold">{part}</strong> : part
                            )}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                ))}
                
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 text-gray-100 rounded-2xl rounded-bl-none p-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" />
                      <span className="text-gray-400 font-mono text-[10px] ml-1">Molo AI routing answers...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat input form */}
              <div className="bg-white/[0.03] border-t border-white/10 p-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask any Bitcoin ecosystem or concept query..."
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAiChat(userQuery)}
                  className="flex-grow bg-white/5 border border-white/10 outline-none focus:border-brand-500/70 focus:bg-white/8 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-500 transition-all font-sans"
                />
                <button
                  onClick={() => handleAiChat(userQuery)}
                  disabled={isAiLoading || !userQuery.trim()}
                  className="bg-brand-600 hover:bg-brand-500 text-white rounded-xl px-4 py-3 font-semibold transition-all shadow-md flex items-center justify-center disabled:opacity-45 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* PAPER OVERVIEW FULL DIALOG MODAL / SLIDEOVER */}
      <AnimatePresence>
        {selectedPaper && (
          <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog">
            {/* Overlay backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPaper(null)}
              className="fixed inset-0 bg-gray-950/60 backdrop-blur-md" 
            />

            <div className="flex min-h-screen items-center justify-center p-4 text-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 w-full max-w-4xl rounded-3xl bg-white p-6 sm:p-10 text-left shadow-2xl border border-gray-150 inline-block overflow-hidden"
              >
                {/* Header elements */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="bg-brand-50 text-brand-700 font-mono text-[10px] font-bold px-2.5 py-1 rounded">
                      {categories.find(c => c.id === selectedPaper.category_id)?.name || "Protocol"}
                    </span>
                    <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedPaper.reading_time}
                    </span>
                  </div>

                  <button 
                    onClick={() => setSelectedPaper(null)}
                    className="p-1 px-3 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-500 rounded-xl text-xs font-bold font-mono transition-colors"
                  >
                    CLOSE [ESC]
                  </button>
                </div>

                <div className="grid md:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Abstract Column */}
                  <div className="md:col-span-8 space-y-6">
                    <div>
                      <h3 className="heading-display text-2xl sm:text-3.5xl font-extrabold text-gray-950 leading-tight">
                        {selectedPaper.title}
                      </h3>
                      <p className="text-semibold text-gray-600 mt-2 text-sm italic">
                        "{selectedPaper.subtitle}"
                      </p>
                    </div>

                    <div className="bg-[#FFFDFB] border border-brand-100/70 p-5 rounded-2xl">
                      <h4 className="text-xs font-bold text-gray-900 tracking-wider uppercase mb-2">Research Abstract</h4>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed m-0 font-sans">
                        {selectedPaper.abstract}
                      </p>
                    </div>

                    {/* Paper Prose content */}
                    <div 
                      className="prose prose-sm prose-brand text-gray-700 max-w-none text-left pt-2 font-sans border-t border-gray-50"
                      dangerouslySetInnerHTML={{ __html: selectedPaper.content }}
                    />
                  </div>

                  {/* Right metadata / GitHub links panel */}
                  <div className="md:col-span-4 bg-[#FCFAF7] border border-gray-150 p-5 rounded-2xl min-h-[300px] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono tracking-wider font-bold text-gray-400 uppercase block mb-4 font-mono">Archive Information</span>
                      
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] text-gray-500 uppercase block">Host Repository:</span>
                          <a 
                            href={selectedPaper.github_repo} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-xs font-mono font-bold text-brand-600 hover:text-brand-800 break-all flex items-center gap-1 mt-1 hover:underline"
                          >
                            <Github className="w-3.5 h-3.5 inline shrink-0" />
                            {selectedPaper.github_repo.replace("https://", "")}
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>

                        <div>
                          <span className="text-[10px] text-gray-550 uppercase block">Platform Standards:</span>
                          <span className="text-xs font-bold text-gray-800 mt-1 block">Vetted Technical Digest</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-gray-550 uppercase block">Licence Agreement:</span>
                          <span className="text-xs font-bold text-gray-800 mt-1 block">Apache-2.0 (Open-Source Standards)</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom downloads trigger */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => handleDownload(selectedPaper)}
                        className="w-full bg-[#FF7A00] hover:bg-[#E66E00] text-white rounded-xl py-3 text-xs sm:text-sm font-semibold transition-all shadow-md inline-flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4 stroke-[2]" />
                        Download Digest Digest
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPaper(null);
                          setTimeout(() => {
                            const chatInput = document.querySelector("#opportunities");
                            chatInput?.scrollIntoView({ behavior: "smooth" });
                          }, 300);
                        }}
                        className="w-full border border-gray-200 hover:border-brand-500/50 bg-white hover:bg-gray-50 text-gray-750 hover:text-brand-600 rounded-xl py-2.5 text-xs font-semibold mt-2 transition-all inline-flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                        Discuss with Molo AI
                      </button>
                    </div>

                  </div>

                </div>

              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
