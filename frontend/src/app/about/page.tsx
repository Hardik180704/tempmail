import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F0FBFA] font-sans selection:bg-cyan-200 p-8 md:p-16">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 font-bold transition">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Home
        </Link>
        
        <h1 className="font-display text-5xl font-bold text-[#1e293b] mb-6">About Temp Mail</h1>
        <p className="text-xl text-slate-600 mb-12 leading-relaxed">
           Why stick your neck out online? Temp Mail is your shield against spam, data leaks, and intrusive marketing.
        </p>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 mb-8">
            <h2 className="font-display text-3xl font-bold text-slate-800 mb-4">Our Mission</h2>
            <p className="text-slate-500 text-lg leading-relaxed">
               We believe privacy is a fundamental right. In an age where every website demands your personal information, Temp Mail provides a necessary buffer. We empower you to explore the internet freely without compromising your personal inbox or digital identity.
            </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[{label: "Emails Processed", val: "10M+"}, {label: "Spam Blocked", val: "50TB"}, {label: "Happy Users", val: "2M+"}, {label: "Uptime", val: "99.9%"}].map((stat, i) => (
               <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100">
                  <div className="font-display font-black text-3xl text-blue-600 mb-1">{stat.val}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
               </div>
            ))}
        </div>
      </div>
    </main>
  );
}
