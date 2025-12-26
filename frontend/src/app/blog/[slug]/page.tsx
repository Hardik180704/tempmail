import Link from "next/link";
import { notFound } from "next/navigation";

// Mock content database
const blogContent = {
  "why-you-should-never-use-your-real-email": {
    title: "Why You Should Never Use Your Real Email for Signups",
    date: "Sep 24, 2025",
    readTime: "5 min read",
    category: "Privacy",
    content: (
      <>
        <p className="mb-6">
          In the digital age, your email address is more than just a communication tool—it&apos;s your digital passport. Every time you sign up for a newsletter, create an account, or download a whitepaper, you&apos;re handing over a piece of your identity. But should you?
        </p>
        <h3 className="text-2xl font-bold text-slate-800 mb-4 font-display">The Spaghetti Effect</h3>
        <p className="mb-6">
          Using your primary email for everything is like throwing spaghetti at a wall. Eventually, it works, but it makes a huge mess. Your professional correspondence gets buried under 20% off coupons from a store you visited once three years ago.
        </p>
        <h3 className="text-2xl font-bold text-slate-800 mb-4 font-display">Data Breaches are Inevitable</h3>
        <p className="mb-6">
          It&apos;s not a matter of if, but when. Even major tech companies suffer data breaches. When you use unique, disposable emails for different services, a breach at one site doesn&apos;t compromise your entire digital life. If &apos;service-a@temp-mail.dev&apos; gets leaked, you just delete it. Your real inbox remains pristine.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl my-8">
           <p className="font-bold text-blue-900">Pro Tip:</p>
            <p className="text-blue-800">Use Temp Mail for any service you don&apos;t intend to use for more than a week. It keeps your main inbox focused on what actually matters.</p>
        </div>
      </>
    )
  },
  "top-10-spam-sources": {
    title: "Top 10 Sources of Email Spam",
    date: "Sep 12, 2025",
    readTime: "8 min read",
    category: "Security",
    content: (
      <>
        <p className="mb-6">
          We analyzed over 50 million inbound emails to our temporary addresses to identify who exactly is filling up the world&apos;s inboxes with junk. The results were... enlightening.
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6 marker:text-blue-500">
           <li><strong>Newsletter Aggregators:</strong> Often sold as &quot;marketing lists&quot; to third parties.</li>
           <li><strong>Free E-book Downloads:</strong> The classic &quot;give us your email for this PDF&quot; trade.</li>
           <li><strong>Contest Entries:</strong> &quot;Enter to win an iPhone&quot; really means &quot;Enter to win a lifetime of spam.&quot;</li>
           <li><strong>Compromised Databases:</strong> Old forums and websites with poor security.</li>
        </ul >
        <p className="mb-6">
           The vast majority of spam doesn&apos;t come from malicious hackers, but from legitimate businesses effectively sharing (or selling) your data without clear consent.
        </p>
      </>
    )
  },
  "how-temp-mail-works-under-hood": {
    title: "How Temp Mail Works Under the Hood",
    date: "Aug 30, 2025",
    readTime: "6 min read",
    category: "Tech",
    content: (
      <>
        <p className="mb-6">
           Ever wondered what happens when you click &quot;Generate&quot;? It&apos;s not magic, it&apos;s efficient engineering.
        </p>
        <h3 className="text-2xl font-bold text-slate-800 mb-4 font-display">1. The SMTP Server</h3>
        <p className="mb-6">
           We run a custom Go-based SMTP server that listens for incoming connections on port 25. Unlike a standard server like Postfix, ours doesn&apos;t save emails to disk immediately. It parses the incoming stream in memory.
        </p>
        <h3 className="text-2xl font-bold text-slate-800 mb-4 font-display">2. In-Memory Processing</h3>
        <p className="mb-6">
           To ensure speed and privacy, we use Redis. When an email arrives, we check if the recipient alias exists and is active. If yes, we store the parsed content (Subject, Body, Attachments) directly into a Redis list with a TTL (Time To Live).
        </p>
        <h3 className="text-2xl font-bold text-slate-800 mb-4 font-display">3. WebSocket Push</h3>
        <p className="mb-6">
           Your browser maintains an open WebSocket connection (or polls securely). As soon as Redis acknowledges the new message, our API pushes the notification to your specific client session. The whole process takes milliseconds.
        </p>
      </>
    )
  }
};

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogContent[params.slug as keyof typeof blogContent];

  if (!post) {
     return notFound();
  }

  return (
    <main className="min-h-screen bg-[#F0FBFA] font-sans selection:bg-cyan-200 p-8 md:p-16">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 font-bold transition">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Blog
        </Link>
        
        <div className="flex items-center gap-3 mb-6">
            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{post.category}</span>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{post.date}</span>
            <span className="text-slate-300 text-xs">•</span>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{post.readTime}</span>
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-[#1e293b] mb-8 leading-tight">{post.title}</h1>
        
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100 text-lg text-slate-600 leading-loose">
            {post.content}
        </div>
      </div>
    </main>
  );
}
