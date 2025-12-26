import Link from "next/link";

export default function ServicePage() {
  return (
    <main className="min-h-screen bg-[#F0FBFA] font-sans selection:bg-cyan-200 p-8 md:p-16">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 font-bold transition">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Home
        </Link>
        
        <h1 className="font-display text-5xl font-bold text-[#1e293b] mb-6">Our Services</h1>
        <p className="text-xl text-slate-600 mb-12 leading-relaxed">
           We provide secure, anonymous, and disposable email addresses to help you avoid spam and protect your privacy.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
               <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
               </div>
               <h3 className="font-display text-2xl font-bold text-slate-800 mb-2">Temporary Email</h3>
               <p className="text-slate-500">
                  Instantly generate disposable email addresses that self-destruct after a set period. Perfect for sign-ups and verifications.
               </p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
               <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
               </div>
               <h3 className="font-display text-2xl font-bold text-slate-800 mb-2">Privacy Protection</h3>
               <p className="text-slate-500">
                  Keep your real inbox clean and secure. We never track your IP address or store logs of your activity.
               </p>
            </div>
        </div>
      </div>
    </main>
  );
}
