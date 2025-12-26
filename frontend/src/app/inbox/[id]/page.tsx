"use client";

import { useState } from "react";
import useSWR from "swr";
import { useParams, useSearchParams } from "next/navigation";
import EmailView from "@/components/EmailView";
import Link from "next/link";
import clsx from "clsx";

const API_BASE = "http://localhost:8080/api/v1";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function InboxPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const addressId = params.id as string;
  const emailAddress = searchParams.get("email");
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  // Poll for emails every 5 seconds
  const { data: emails, error } = useSWR(
    addressId ? `${API_BASE}/addresses/${addressId}/emails` : null,
    fetcher,
    { refreshInterval: 2000 }
  );

  // Fetch full email content when selected
  const { data: fullEmail } = useSWR(
    selectedEmailId ? `${API_BASE}/emails/${selectedEmailId}` : null,
    fetcher
  );

  return (
    <div className="flex h-screen bg-[#F0FBFA] font-sans overflow-hidden p-4 md:p-6 gap-6">
      {/* Sidebar */}
      <div className="w-96 flex flex-col bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden shrink-0">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2 group">
               <div className="bg-slate-100 p-2 rounded-xl group-hover:bg-slate-200 transition">
                  <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
               </div>
               <span className="font-bold text-slate-700 text-sm">Back</span>
            </Link>
            <div className="font-bold text-xl text-[#1a202c] font-display">TempMail</div>
          </div>

          <div className="bg-[#2D3342] p-4 rounded-2xl shadow-lg relative overflow-hidden group">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Current Address</label>
            <div className="flex items-center justify-between gap-2 relative z-10">
              <code className="text-sm font-medium text-white truncate select-all font-mono">
                {emailAddress || "Loading..."}
              </code>
              <button 
                onClick={() => navigator.clipboard.writeText(emailAddress || "")}
                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition"
                title="Copy"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
              </button>
            </div>
            {/* Decor */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">Inbox</h3>
          {!emails ? (
            <div className="p-8 text-center text-gray-400 flex flex-col items-center">
               <svg className="animate-spin h-6 w-6 mb-2 text-blue-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               <span className="text-xs font-medium">Checking mail...</span>
            </div>
          ) : emails.length === 0 ? (
            <div className="text-center py-10 px-4">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" /></svg>
               </div>
               <p className="text-sm font-bold text-slate-600">No emails yet</p>
               <p className="text-xs text-slate-400 mt-1">Waiting for incoming messages...</p>
            </div>
          ) : (
            emails.map((email: any) => (
              <button
                key={email.id}
                onClick={() => setSelectedEmailId(email.id)}
                className={clsx(
                  "w-full p-4 rounded-xl text-left transition-all relative group border",
                  selectedEmailId === email.id 
                    ? "bg-blue-50 border-blue-200 shadow-sm" 
                    : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-100"
                )}
              >
                <div className="flex justify-between items-baseline mb-1">
                  <span className={clsx("font-bold text-sm truncate pr-2", selectedEmailId === email.id ? "text-blue-700" : "text-slate-800")}>
                    {email.from}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                    {new Date(email.received_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className={clsx("text-xs truncate mb-1 font-medium", selectedEmailId === email.id ? "text-blue-900" : "text-slate-600")}>
                  {email.subject}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {email.text_body?.substring(0, 40)}...
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden relative">
        {fullEmail ? (
          <div className="h-full p-0">
             <EmailView email={fullEmail} />
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
             <div className="w-32 h-32 bg-[#F0FBFA] rounded-full flex items-center justify-center mb-6 text-[#4DB6AC]">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
             </div>
             <h2 className="text-2xl font-bold text-slate-800 mb-2 font-display">Select an email to read</h2>
             <p className="text-slate-500 max-w-sm">
               Click on any email in your list to view its contents, attachments and details here.
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
