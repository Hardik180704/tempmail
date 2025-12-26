import Link from "next/link";

export default function BlogPage() {
  const posts = [
      {
          slug: "why-you-should-never-use-your-real-email",
          title: "Why You Should Never Use Your Real Email for Signups",
          excerpt: "Protecting your primary inbox is crucial in 2024. Here is why disposable emails are the future of online privacy.",
          date: "Sep 24, 2025",
          readTime: "5 min read",
          category: "Privacy"
      },
      {
          slug: "top-10-spam-sources",
          title: "Top 10 Sources of Email Spam",
          excerpt: "We analyzed millions of emails to find out who is selling your data. The results might surprise you.",
          date: "Sep 12, 2025",
          readTime: "8 min read",
          category: "Security"
      },
      {
          slug: "how-temp-mail-works-under-hood",
          title: "How Temp Mail Works Under the Hood",
          excerpt: "A deep dive into the technology behind disposable email addresses and how we keep your data safe.",
          date: "Aug 30, 2025",
          readTime: "6 min read",
          category: "Tech"
      }
  ];

  return (
    <main className="min-h-screen bg-[#F0FBFA] font-sans selection:bg-cyan-200 p-8 md:p-16">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 font-bold transition">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Home
        </Link>
        
        <h1 className="font-display text-5xl font-bold text-[#1e293b] mb-4">Blog</h1>
        <p className="text-xl text-slate-600 mb-12">Latest updates, privacy tips, and news from the Temp Mail team.</p>

        <div className="grid gap-8">
            {posts.map((post, i) => (
                <Link href={`/blog/${post.slug}`} key={i} className="block group">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{post.category}</span>
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{post.date}</span>
                            <span className="text-slate-300 text-xs">•</span>
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{post.readTime}</span>
                        </div>
                        <h2 className="font-display text-2xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">{post.title}</h2>
                        <p className="text-slate-500 leading-relaxed mb-4">{post.excerpt}</p>
                        <span className="text-blue-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read Article <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </span>
                    </div>
                </Link>
            ))}
        </div>
      </div>
    </main>
  );
}
