import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { 
  Bookmark, 
  Clock, 
  Trash2, 
  Users, 
  ArrowRight, 
  Edit2, 
  Check, 
  X, 
  MapPin, 
  Sparkles, 
  Send, 
  Globe, 
  BadgePercent, 
  TrendingUp, 
  CheckCircle2, 
  User, 
  Cpu
} from "lucide-react";

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'following'>('bookmarks');
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile fields state
  const [profile, setProfile] = useState<any>({
    name: "Satoshi Reader",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
    bio: "Bitcoin Core enthusiast & casual researcher of lightning micro-transactions and offline nodes.",
    country: "Ghana",
    lightning_address: "reader@8333.mobi",
    interests: ["Scaling & Lightning", "Monetary Economics"],
    preference: "ELI5_Beginner"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState("");
  const [editingBio, setEditingBio] = useState("");
  const [editingCountry, setEditingCountry] = useState("");
  const [editingLightning, setEditingLightning] = useState("");
  const [editingAvatar, setEditingAvatar] = useState("");
  const [editingPreference, setEditingPreference] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const presetAvatars = [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=150&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop"
  ];

  const availableInterests = [
    "Physical Protocol",
    "Scaling & Lightning",
    "Security & Custody",
    "Monetary Economics",
    "Energy & Mining",
    "USSD Offline Rails"
  ];

  const fetchData = () => {
    setLoading(true);
    
    const fetchProfile = fetch("/api/profile/current", { headers: { "x-user-id": "user_1" } }).then(r => r.json());
    const fetchBookmarks = fetch("/api/bookmarks", { headers: { "x-user-id": "user_1" } }).then(r => r.json());
    const fetchFeed = fetch("/api/follows/feed", { headers: { "x-user-id": "user_1" } }).then(r => r.json());

    Promise.all([fetchProfile, fetchBookmarks, fetchFeed])
      .then(([profileData, bookmarksData, feedData]) => {
        if (profileData && profileData.id) {
          setProfile(profileData);
          setEditingName(profileData.name || "");
          setEditingBio(profileData.bio || "");
          setEditingCountry(profileData.country || "");
          setEditingLightning(profileData.lightning_address || "");
          setEditingAvatar(profileData.avatar || "");
          setEditingPreference(profileData.preference || "ELI5_Beginner");
          setSelectedInterests(profileData.interests || []);
        }
        setBookmarks(bookmarksData);
        setFeed(feedData);
        setLoading(false);
      })
      .catch(e => {
        console.error("Error loading reader profile details:", e);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const removeBookmark = (articleId: string) => {
    fetch(`/api/bookmarks/${articleId}`, { 
      method: "DELETE",
      headers: { "x-user-id": "user_1" }
    }).then(() => {
      setBookmarks(bookmarks.filter(b => b.id !== articleId));
    });
  };

  const startEditing = () => {
    setEditingName(profile.name);
    setEditingBio(profile.bio);
    setEditingCountry(profile.country);
    setEditingLightning(profile.lightning_address);
    setEditingAvatar(profile.avatar);
    setEditingPreference(profile.preference || "ELI5_Beginner");
    setSelectedInterests(profile.interests || []);
    setIsEditing(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    fetch("/api/profile/current", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-user-id": "user_1"
      },
      body: JSON.stringify({
        name: editingName,
        bio: editingBio,
        country: editingCountry,
        lightning_address: editingLightning,
        avatar: editingAvatar,
        preference: editingPreference,
        interests: selectedInterests
      })
    })
      .then(r => r.json())
      .then(res => {
        setSaving(false);
        if (res.success && res.user) {
          setProfile(res.user);
          setIsEditing(false);
          setSuccessMsg("Profile synced securely with database!");
          setTimeout(() => setSuccessMsg(""), 3500);
        }
      })
      .catch(err => {
        setSaving(false);
        console.error("Error updating profile:", err);
      });
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SEO title="My Profile - Molo BTC Research Lab" description="View and customize your research dashboard, lightning addresses, & peer study bookmarks" />
      <Navigation />
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        {successMsg && (
          <div className="mb-6 bg-brand-50 border border-brand-200 text-brand-900 rounded-2xl p-4 flex items-center gap-2.5 text-xs font-bold shadow-sm animate-bounce">
            <CheckCircle2 className="h-4.5 w-4.5 text-brand-500 shrink-0" />
            {successMsg}
          </div>
        )}

        {/* Profile Card & Info Board */}
        <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden mb-8">
          
          {/* Subtle Orange-Dust Tech Banner */}
          <div className="h-32 bg-amber-50 relative overflow-hidden flex items-center justify-between px-8 border-b border-gray-100">
            <div className="absolute inset-0 bg-radial-gradient from-brand-500/5 to-transparent pointer-events-none" />
            <div className="relative font-mono text-[9px] text-brand-500/70 select-none tracking-widest uppercase py-1">
              Nodes: [Active] // Sub-Saharan Route Key // x-user-id: user_1
            </div>
            <div className="relative flex items-center gap-2 opacity-50 select-none font-mono text-[10px] text-gray-500">
              <Cpu className="w-3.5 h-3.5 animate-spin-slow" />
              <span>UTC Connected</span>
            </div>
          </div>

          <div className="p-8 -mt-12 relative flex flex-col md:flex-row gap-6 md:items-end justify-between">
            <div className="flex flex-col sm:flex-row gap-6 sm:items-end">
              <div className="relative shrink-0">
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className="w-24 h-24 rounded-2xl border-4 border-white shadow-md bg-gray-100 object-cover" 
                />
              </div>

              <div className="space-y-1 bg-white">
                <div className="flex items-center gap-2 group">
                  <h1 className="text-2xl font-black text-gray-950 tracking-tight font-display">
                    {profile.name}
                  </h1>
                  <span className="text-[10px] font-mono bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded font-bold uppercase border border-brand-100">
                    Sovereign Reader
                  </span>
                </div>
                
                <p className="text-gray-500 text-xs font-semibold leading-relaxed max-w-lg mt-1 font-sans">
                  {profile.bio || "No professional biography has been published on this profile yet."}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-xs font-semibold text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-500" />
                    <span>{profile.country || "Unmapped"}</span>
                  </div>
                  {profile.lightning_address && (
                    <div className="flex items-center gap-1 font-mono text-gray-500 bg-gray-50 border border-gray-150 rounded px-1.5 py-0.5 text-[10px]">
                      <Send className="w-3 h-3 text-brand-500" />
                      <span>{profile.lightning_address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 font-sans text-[11px] font-bold text-gray-500">
                    <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                    <span>Preset: {profile.preference === "ELI5_Beginner" ? "ELI5 (Beginner)" : profile.preference === "Academic_Dense" ? "Academic Dense" : profile.preference === "Pragmatic_Coder" ? "Technical Coder" : "Socratic Inquiry"}</span>
                  </div>
                </div>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={startEditing}
                className="self-start md:self-end flex items-center gap-1.5 border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-950 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all bg-white hover:bg-gray-50 shadow-sm"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Customize Profile
              </button>
            )}
          </div>

          {/* Interests display section */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="px-8 pb-6 border-t border-gray-100 pt-4 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono mr-1">Study Focus:</span>
              {profile.interests.map((interest: string, idx: number) => (
                <span 
                  key={idx}
                  className="bg-[#FCFAF7] border border-brand-200/40 text-brand-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}

        </div>

        {/* 2. PROFILE EDIT ELEMENT: INTERACTIVE SLIDER/FORM */}
        {isEditing && (
          <div className="bg-white rounded-3xl border-2 border-brand-500/20 p-6 md:p-8 shadow-md mb-8 animate-fade-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-gray-950 flex items-center gap-2 font-display">
                  <User className="w-4.5 h-4.5 text-brand-500" />
                  Customize Reader Identity Card
                </h3>
                <p className="text-[11px] text-gray-500 font-medium">This synchronized profile tells other researchers who is reviewing or bookmarking topics.</p>
              </div>
              <button 
                onClick={() => setIsEditing(false)} 
                className="text-gray-400 hover:text-gray-600 p-1"
                title="Cancel changes"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              
              {/* Avatar Preset Selector */}
              <div>
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2 font-mono">Select Avatar Blueprint</label>
                <div className="flex items-center gap-3">
                  {presetAvatars.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditingAvatar(url)}
                      className={`relative rounded-xl overflow-hidden h-14 w-14 border-2 transition-all ${
                        editingAvatar === url 
                          ? "border-brand-500 scale-105 shadow" 
                          : "border-transparent hover:scale-102"
                      }`}
                    >
                      <img src={url} alt="preset" className="h-full w-full object-cover" />
                      {editingAvatar === url && (
                        <div className="absolute inset-0 bg-brand-500/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white drop-shadow-sm font-bold" />
                        </div>
                      )}
                    </button>
                  ))}
                  
                  {/* Custom URL Option */}
                  <div className="flex-1 ml-4">
                    <label className="block text-[9px] font-bold text-gray-400 mb-1">Or enter custom image web link:</label>
                    <input 
                      type="text" 
                      value={editingAvatar}
                      onChange={e => setEditingAvatar(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:border-brand-500 font-mono text-gray-600 bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Identity coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Researcher Handle / Name</label>
                  <input
                    type="text"
                    required
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-brand-500 bg-gray-50 font-bold text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Lightning Routing Node (Address)</label>
                  <input
                    type="text"
                    placeholder="e.g. key@8333.mobi"
                    value={editingLightning}
                    onChange={e => setEditingLightning(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-brand-500 bg-gray-50 font-mono text-gray-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Active Hub Location / Country</label>
                  <select
                    value={editingCountry}
                    onChange={e => setEditingCountry(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-xl p-3 text-xs outline-none focus:border-brand-500 font-bold text-gray-800"
                  >
                    <option value="Ghana">Ghana (Accra / Kumasi Hub)</option>
                    <option value="Nigeria">Nigeria (Lagos / Abuja Hub)</option>
                    <option value="Kenya">Kenya (Nairobi Geothermal Hub)</option>
                    <option value="South Africa">South Africa (Satoshi Circular Hub)</option>
                    <option value="Zimbabwe">Zimbabwe (Baka Mobile USSD Hub)</option>
                    <option value="Botswana">Botswana (Gaborone Pula Corridor)</option>
                    <option value="United Kingdom">United Kingdom (Expatriate Remittance)</option>
                    <option value="United States">United States (Sovereign Operations)</option>
                    <option value="Other Area">Global Node (Remote Orbit)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">AI Tutor Interactive Preference</label>
                  <select
                    value={editingPreference}
                    onChange={e => setEditingPreference(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-xl p-3 text-xs outline-none focus:border-brand-500 font-bold text-gray-800"
                  >
                    <option value="ELI5_Beginner">ELI5 (Metaphoric Simplified Graphics)</option>
                    <option value="Academic_Dense">Academic Dense (Equations, Core Source Files)</option>
                    <option value="Pragmatic_Coder">Pragmatic Developer (Solidity, UTXO Rust Code)</option>
                    <option value="Socratic_Coach">Socratic inquiry (Guides utilizing questions)</option>
                  </select>
                </div>
              </div>

              {/* Narrative Bio */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest font-mono">Biography / Professional Abstract</label>
                  <span className="text-[10px] text-gray-400 font-mono font-bold">Max 300 characters</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={300}
                  value={editingBio}
                  onChange={e => setEditingBio(e.target.value)}
                  placeholder="Bitcoin Core researcher exploring lightning protocols..."
                  className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-brand-500 bg-gray-50 text-gray-700 leading-relaxed"
                />
              </div>

              {/* Research Focus toggles */}
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2.5 font-mono">Select Core Focus Research Nodes</label>
                <div className="flex flex-wrap gap-2">
                  {availableInterests.map((interest, idx) => {
                    const active = selectedInterests.includes(interest);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${
                          active 
                            ? "bg-brand-500 border-brand-500 text-white shadow-sm" 
                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-3 rounded-xl font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  {saving ? "Publishing State..." : "Sync & Publish Profile"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="border border-gray-200 hover:bg-gray-50 text-gray-650 px-5 py-3 rounded-xl font-bold text-xs transition-all"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        )}

        {/* 3. LAYOUT TAB CONTROLS */}
        <div className="flex items-center gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center gap-2 px-6 py-4 font-black uppercase tracking-wider text-xs transition-colors border-b-2 ${
              activeTab === 'bookmarks' 
                ? 'border-brand-500 text-brand-600' 
                : 'border-transparent text-gray-400 hover:text-gray-900'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${activeTab === 'bookmarks' ? 'fill-current' : ''}`} /> My Reading List ({bookmarks.length})
          </button>
          
          <button
            onClick={() => setActiveTab('following')}
            className={`flex items-center gap-2 px-6 py-4 font-black uppercase tracking-wider text-xs transition-colors border-b-2 ${
              activeTab === 'following' 
                ? 'border-brand-500 text-brand-600' 
                : 'border-transparent text-gray-400 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" /> Following Authors Feed ({feed.length})
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400 text-xs font-mono">Loading profile data node...</div>
        ) : (
          <>
            {/* Reading List Tab */}
            {activeTab === 'bookmarks' && (
              <>
                {bookmarks.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-gray-150 shadow-sm flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#FCFAF7] rounded-full flex items-center justify-center mb-4">
                      <Bookmark className="h-7 w-7 text-brand-500" />
                    </div>
                    <h3 className="text-base font-extrabold text-gray-900 mb-1 font-display">No Saved Research Collections</h3>
                    <p className="text-gray-550 mb-6 max-w-sm text-xs leading-relaxed font-sans">
                      Articles you bookmark from active research corridors will appear here so you can peer-review them anytime.
                    </p>
                    <Link to="/" className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs hover:bg-brand-600 transition-colors shadow-sm">
                      Explore Active Researches
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-5">
                    {bookmarks.map(article => (
                      <div 
                        key={article.id} 
                        className="bg-white rounded-2xl p-5 border border-gray-150 shadow-xs flex flex-col sm:flex-row gap-5 items-start group hover:shadow-sm hover:border-brand-200 transition-all"
                      >
                        {article.featured_image && (
                          <Link to={`/article/${article.slug || article.id}`} className="w-full sm:w-44 h-28 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 block">
                            <img 
                              src={article.featured_image} 
                              alt={article.title} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" 
                            />
                          </Link>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div>
                              <Link to={`/article/${article.slug || article.id}`}>
                                <h3 className="text-base font-bold text-gray-950 hover:text-brand-600 transition-colors mb-1.5 line-clamp-2 font-display">
                                  {article.title}
                                </h3>
                              </Link>
                              
                              <p className="text-gray-500 line-clamp-2 text-[12px] mb-3 leading-relaxed font-sans">
                                {article.subtitle || article.content?.replace(/<[^>]+>/g, '').substring(0, 150)}
                              </p>
                              
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-gray-400 font-mono">
                                <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded border border-gray-150">
                                  Saved {new Date(article.bookmarked_at).toLocaleDateString()}
                                </span>
                                {article.reading_time && (
                                  <div className="flex items-center gap-1 text-gray-400">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{article.reading_time}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <button 
                              onClick={() => removeBookmark(article.id)}
                              className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors shrink-0 self-start sm:self-auto flex items-center justify-center border border-red-100"
                              title="Delete bookmark"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Following Feed Tab */}
            {activeTab === 'following' && (
              <>
                {feed.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-gray-150 shadow-sm flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#FCFAF7] rounded-full flex items-center justify-center mb-4">
                      <Users className="h-7 w-7 text-brand-500" />
                    </div>
                    <h3 className="text-base font-extrabold text-gray-900 mb-1 font-display">No Active Author Updates</h3>
                    <p className="text-gray-550 mb-6 max-w-sm text-xs leading-relaxed font-sans">
                      Follow premium Molo BTC research contributors to receive instant notifications in this feed.
                    </p>
                    <Link to="/" className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs hover:bg-brand-600 transition-colors shadow-sm">
                      Find Core Authors
                    </Link>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-5">
                    {feed.map(article => (
                      <Link 
                        key={article.id} 
                        to={`/article/${article.slug || article.id}`} 
                        className="bg-white rounded-2xl border border-gray-150 p-5 shadow-xs hover:shadow-sm hover:border-brand-200 transition-all group flex flex-col h-full"
                      >
                        {article.featured_image && (
                          <div className="aspect-[16/10] mb-4 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                            <img 
                              src={article.featured_image} 
                              alt={article.title} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-[10px] font-black text-brand-600 mb-2 tracking-widest uppercase font-mono">
                          <span>{new Date(article.published_at || article.created_at).toLocaleDateString()}</span>
                        </div>
                        
                        <h3 className="text-base font-bold text-gray-950 mb-1.5 group-hover:text-brand-600 transition-colors line-clamp-2 font-display">
                          {article.title}
                        </h3>
                        
                        <p className="text-gray-500 line-clamp-2 mb-4 flex-1 text-xs leading-relaxed font-sans">
                          {article.subtitle || article.content?.replace(/<[^>]+>/g, '').substring(0, 150)}...
                        </p>
                        
                        <div className="flex items-center font-bold text-xs text-brand-600 group-hover:gap-2 gap-1.5 transition-all mt-auto font-mono uppercase tracking-wider pt-2 border-t border-gray-50">
                          Inspect Node <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
