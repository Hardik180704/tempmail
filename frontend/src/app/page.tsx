"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import Link from "next/link";

const API_BASE = "http://localhost:8080/api/v1";

async function createAddress(url: string, { arg }: { arg: { alias?: string } }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });
  if (!res.ok) throw new Error("Failed to create");
  return res.json();
}

export default function Home() {
  const router = useRouter();
  const [emailData, setEmailData] = useState<{ id: string, email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const { trigger } = useSWRMutation(`${API_BASE}/addresses`, createAddress);

  useEffect(() => {
    // Auto-generate on load
    const init = async () => {
      try {
        const data = await trigger({});
        setEmailData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [trigger]);

  const handleRefresh = () => {
     setLoading(true);
     trigger({}).then(data => {
        setEmailData(data);
        setLoading(false);
     });
  };

  const handleCopy = () => {
    if (emailData) {
      navigator.clipboard.writeText(emailData.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenInbox = () => {
    if (emailData) {
      router.push(`/inbox/${emailData.id}?email=${emailData.email}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f0fff4] to-[#ccfbf1] text-slate-800 font-sans selection:bg-teal-200">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex flex-col items-center group cursor-default">
           {/* Logo Row: Icon + Main Text */}
           <div className="flex items-center justify-center gap-3 transition-transform duration-300 group-hover:scale-105">
              {/* Icon SVG: Envelope with slight tilt */}
              <div className="relative pt-1 transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                <svg className="w-12 h-12 text-[#1e293b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                   <rect x="3" y="6" width="18" height="13" rx="3" />
                   <path d="M3 8l9 5 9-5" />
                </svg>
                {/* Decorative dot */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#F0FBFA]"></div>
              </div>
              
              {/* Main Text Stack */}
              <div className="flex flex-col leading-none select-none">
                  <div className="flex items-baseline">
                    <span className="font-display font-[800] text-[32px] text-[#1e293b] tracking-tight">Temp</span>
                    <span className="font-display font-[800] text-[32px] text-blue-600 tracking-tight">Mail</span>
                  </div>
              </div>
           </div>
           
           {/* Subtitle Centered Below */}
           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.25em] mt-2 group-hover:text-blue-500 transition-colors duration-300">Disposable Email Address</span>
        </div>

        <div className="hidden md:flex items-center gap-10 font-bold text-gray-500 text-sm">
          <Link href="/" className="text-slate-900 border-b-2 border-green-400 pb-1">Home</Link>
          <Link href="/service" className="hover:text-slate-900 transition">Service</Link>
          <Link href="/about" className="hover:text-slate-900 transition">About</Link>
          <Link href="/blog" className="hover:text-slate-900 transition">Blog</Link>
        </div>

        <button className="md:hidden p-2 text-slate-900">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </nav>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-32 text-center">
        {/* Toggle Pills */}
        <div className="flex justify-center mb-12 w-full animate-fade-in-up">
            <div className="inline-flex gap-8 relative">
               {/* Full width underline background */}
               <div className="absolute bottom-0 left-[-50vw] right-[-50vw] h-[2px] bg-gray-100"></div>
               
               {/* Active Tab: Email */}
               <button className="pb-3 border-b-2 border-[#1e293b] font-display font-bold text-2xl text-[#1e293b] flex items-center gap-3 relative z-10 transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <rect x="8" y="8" width="12" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Temporary E-mail
               </button>
               
               {/* Inactive Tab: SMS */}
               <button title="Coming Soon" className="pb-3 border-b-2 border-transparent font-display font-bold text-2xl text-[#94a3b8] flex items-center gap-3 relative z-10 hover:text-[#64748b] transition-colors cursor-not-allowed opacity-60 group">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <rect x="7" y="4" width="10" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="12" y1="17" x2="12" y2="17.01" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} />
                  </svg>
                  Temporary SMS
                  <span className="bg-slate-200 text-slate-500 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider -mt-4 -ml-2 group-hover:bg-slate-300 transition-colors">Soon</span>
               </button>
            </div>
        </div>

        {/* Headline */}
        <div className="relative mb-6 flex flex-col items-center animate-fade-in-up delay-100">
          <span className="font-handwriting text-[4rem] text-[#2F80ED] leading-none transform -rotate-6 relative top-2 z-10">Temporary</span>
          <h1 className="font-display text-6xl md:text-7xl font-bold text-[#1a202c] tracking-tight relative z-0 mt-[-10px]">Email Address</h1>
        </div>

        <p className="text-[#4A5568] font-medium max-w-3xl mx-auto mb-12 leading-relaxed text-base md:text-[1.1rem] animate-fade-in-up delay-200">
          Forget about spam, advertising mailings, hacking and attacking robots. Keep your real mailbox clean and secure. Temp Mail provides temporary, secure, anonymous, free, disposable email address.
        </p>

        {/* The "Box" - Address Display */}
        <div className="relative z-20 animate-fade-in-up delay-300">
             <div className="bg-[#2D3342] text-white p-2.5 rounded-[2rem] shadow-2xl flex items-center max-w-2xl mx-auto mb-10 pl-8 pr-2.5 h-20 transition-all hover:scale-[1.01]">
              {loading ? (
                 <div className="flex items-center gap-3 w-full text-slate-400">
                   <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   <span className="text-lg">Generating secure address...</span>
                 </div>
              ) : (
                 <input
                   readOnly
                   className="bg-transparent w-full outline-none text-white text-xl font-medium tracking-wide selection:bg-blue-500/30 font-mono"
                   value={emailData?.email || ""}
                 />
              )}
    
              {/* Action inside pill */}
              <button 
                 onClick={handleCopy}
                 className={`ml-3 ${copied ? "bg-green-500 text-white" : "bg-white text-[#2D3342] hover:bg-gray-100"} font-bold text-base py-4 px-8 rounded-[1.5rem] flex items-center gap-2 transition-all whitespace-nowrap duration-300`}
              >
                 {copied ? (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Copied!
                    </>
                 ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      Copy
                    </>
                 )}
              </button>
            </div>
        </div>

        {/* Feature Buttons */}
        <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up delay-400">
          <button onClick={handleCopy} className={`group flex items-center gap-3 px-8 py-4 ${copied ? "bg-green-100 text-green-700" : "bg-[#E0F2F1] text-slate-700 hover:bg-[#b2dfdb]"} rounded-[1.5rem] font-bold text-lg transition duration-200`}>
             {copied ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
             ) : (
                <svg className="w-6 h-6 text-slate-600 group-hover:text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
             )}
             {copied ? "Copied!" : "Copy"}
          </button>
          
          <button onClick={handleRefresh} className="group flex items-center gap-3 px-8 py-4 bg-[#E0F2F1] hover:bg-[#b2dfdb] rounded-[1.5rem] text-slate-700 font-bold text-lg transition duration-200">
             <svg className="w-6 h-6 text-slate-600 group-hover:text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
             Refresh
          </button>
          
          <button onClick={handleRefresh} className="group flex items-center gap-3 px-8 py-4 bg-[#E0F2F1] hover:bg-[#b2dfdb] rounded-[1.5rem] text-slate-700 font-bold text-lg transition duration-200">
             <svg className="w-6 h-6 text-slate-600 group-hover:text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
             Delete
          </button>
        </div>
        
         <div className="mt-10 animate-fade-in-up delay-500">
            <button 
               onClick={handleOpenInbox}
               disabled={!emailData || loading}
               className="text-blue-600 font-bold text-lg hover:underline flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
            >
               Open Inbox
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
         </div>
      </div>

      {/* Info Section */}
      <div className="grid md:grid-cols-2 gap-16 max-w-7xl mx-auto px-6 pb-32 items-center">
        <div className="animate-fade-in-up delay-300">
           <div className="text-blue-600 font-bold mb-4 tracking-wide uppercase text-sm">About temp mail</div>
           <h2 className="text-4xl md:text-5xl font-black text-[#1a202c] mb-8 leading-tight">What is Temp mail?</h2>
           <p className="text-gray-500 mb-8 leading-relaxed text-lg">
             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris id est quis magna viverra adipiscing elit. Proin in tincidunt nibh. Etiam ut egestas ligula.
           </p>
           
           <div className="space-y-5">
              {["No Sign up required", "No annoying mails", "No installations"].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-slate-800 font-bold text-lg">
                   <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-500 shrink-0">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                   </div>
                   {item}
                </div>
              ))}
           </div>

           <Link href="#" className="inline-flex items-center gap-2 text-blue-600 font-bold text-lg mt-10 hover:text-blue-700 group">
              Learn More 
              <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
           </Link>
        </div>
        <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative transition duration-500 animate-float">
            {/* Mockup of Inbox */}
             <div className="rounded-xl border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-10">
                   <div className="font-bold text-2xl text-slate-800">Your Inbox</div>
                   <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                   </div>
                </div>
                <div className="flex justify-between mb-12 text-base font-bold text-slate-700 border-b border-gray-100 pb-6">
                   <div className="flex items-center gap-3"><div className="w-5 h-5 border-2 border-slate-300 rounded"></div> Sender</div>
                   <div className="flex items-center gap-3"><div className="w-5 h-5 border-2 border-slate-300 rounded"></div> Subject</div>
                   <div className="flex items-center gap-3"><div className="w-5 h-5 border-2 border-slate-300 rounded"></div> View</div>
                </div>
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
                   <div className="w-24 h-24 bg-[#E0F2F1] rounded-full flex items-center justify-center mb-6 text-[#4DB6AC]">
                      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                   </div>
                   <p className="text-slate-800 font-bold text-lg mb-1">Your inbox is empty</p>
                   <p className="text-sm font-medium">Awaiting for incoming emails</p>
                   <div className="flex items-center gap-2 mt-4 text-blue-500 animate-pulse text-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                       Scanning...
                   </div>
                </div>
             </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-6 pb-32">
        <h2 className="text-4xl md:text-5xl font-black text-[#1a202c] mb-12 text-center leading-tight">Frequently Asked Questions</h2>
        
        <div className="grid gap-6">
           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="font-display text-2xl font-bold text-slate-800 mb-3">What is a disposable email?</h3>
              <p className="text-slate-500 leading-relaxed text-lg">
                 A disposable email is a temporary address that allows you to sign up for websites without revealing your real identity. It helps you avoid spam and protects your personal data.
              </p>
           </div>

           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="font-display text-2xl font-bold text-slate-800 mb-3">How long does the email last?</h3>
              <p className="text-slate-500 leading-relaxed text-lg">
                 Your generated email address is valid until you delete it or your session expires. Emails in the inbox are kept for about 24 hours before being automatically wiped.
              </p>
           </div>

           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="font-display text-2xl font-bold text-slate-800 mb-3">Is it secure?</h3>
              <p className="text-slate-500 leading-relaxed text-lg">
                 Yes, absolutely. We do not track your IP address or store logs. All emails are processed in memory and deleted permanently after the expiration period.
              </p>
           </div>
           
           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="font-display text-2xl font-bold text-slate-800 mb-3">Can I receive attachments?</h3>
              <p className="text-slate-500 leading-relaxed text-lg">
                 Yes! Our service supports receiving attachments in emails. You can view and download them directly from the inbox interface.
              </p>
           </div>
        </div>
      </div>
      
      {/* Footer (Simplified for brevity as user focused on header/hero) */}
      <footer className="bg-[#F0FBFA] py-12 border-t border-gray-200 text-center text-gray-500 text-sm">
         © 2025 Temp Mail Pro. All branding match.
      </footer>
    </main>
  );
}
