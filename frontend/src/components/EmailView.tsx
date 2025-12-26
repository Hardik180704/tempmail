"use client";

import { useState } from "react";
import clsx from "clsx";

interface Attachment {
  filename: string;
  content_type: string;
  size: number;
}

interface Email {
  id: string;
  subject: string;
  from: string;
  to: string[];
  text_body: string;
  html_body: string;
  attachments: Attachment[];
  received_at: string;
}

export default function EmailView({ email }: { email: Email }) {
  const [activeTab, setActiveTab] = useState<"html" | "text">("html");

  if (!email) return null;

  // Extract name/email from "Name <email@domain.com>"
  const fromMatch = email.from.match(/(.*)<(.*)>/);
  const fromName = fromMatch ? fromMatch[1].trim() : email.from;
  const fromAddress = fromMatch ? fromMatch[2].trim() : "";

  // Generate avatar initial
  const initial = (fromName || email.from || "?")[0].toUpperCase();

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden relative">
      {/* Email Header */}
      <div className="p-8 border-b border-gray-100 bg-white z-10">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-[#1a202c] leading-tight font-display tracking-tight">
            {email.subject}
          </h1>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide bg-gray-50 px-3 py-1.5 rounded-full">
             {new Date(email.received_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#E0F2F1] text-[#009688] flex items-center justify-center text-xl font-bold border border-[#B2DFDB]">
            {initial}
          </div>
          <div className="flex-1">
            <div className="flex flex-col">
              <span className="font-bold text-slate-800 text-lg">{fromName}</span>
              {fromAddress && <span className="text-slate-400 text-sm font-medium">{fromAddress}</span>}
            </div>
          </div>
          <div className="flex gap-2 text-sm font-medium bg-gray-50 p-1 rounded-lg">
             <button
               onClick={() => setActiveTab("html")}
               className={clsx(
                 "px-4 py-1.5 rounded-md transition-all",
                 activeTab === "html" ? "bg-white text-slate-800 shadow-sm" : "text-gray-400 hover:text-gray-600"
               )}
             >
               HTML
             </button>
             <button
               onClick={() => setActiveTab("text")}
               className={clsx(
                 "px-4 py-1.5 rounded-md transition-all",
                 activeTab === "text" ? "bg-white text-slate-800 shadow-sm" : "text-gray-400 hover:text-gray-600"
               )}
             >
               Text
             </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-white p-8">
        {activeTab === "html" ? (
          <div 
            className="prose prose-slate max-w-none prose-headings:font-display prose-a:text-blue-600 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: email.html_body || `<div class="p-6 bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-100 flex items-center gap-3"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> No HTML content available for this email.</div>` }}
          />
        ) : (
          <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 bg-gray-50 p-6 rounded-xl border border-gray-100">
            {email.text_body || "No text content"}
          </pre>
        )}
      </div>

      {/* Attachments Footer */}
      {email.attachments && email.attachments.length > 0 && (
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Attachments ({email.attachments.length})</h4>
          <div className="flex flex-wrap gap-3">
            {email.attachments.map((att, i) => (
              <a
                key={i}
                href="#"
                className="flex items-center gap-3 bg-white p-3 pr-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700 truncate max-w-[150px]">{att.filename}</span>
                  <span className="text-[10px] text-gray-400 uppercase font-medium">{Math.round(att.size / 1024)} KB</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
