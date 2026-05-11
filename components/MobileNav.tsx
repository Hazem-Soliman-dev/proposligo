"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  component?: React.ReactNode;
  isActive?: boolean;
}

interface MobileNavProps {
  items: NavItem[];
}

export default function MobileNav({ items }: MobileNavProps) {
  const pathname = usePathname();
  const { lang } = useLanguage();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-2xl border-t border-zinc-800/50 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between h-16 px-2 max-w-lg mx-auto relative">
        {items.map((item, index) => {
          const isActive = item.isActive !== undefined ? item.isActive : (item.href ? pathname === item.href : false);
          
          const content = (
            <div className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-300 ${isActive ? "text-emerald-400" : "text-zinc-500 hover:text-emerald-400"}`}>
              <div className={`relative transition-all duration-500 ${isActive ? "scale-110 -translate-y-0.5" : "scale-100"}`}>
                {item.icon}
                {isActive && (
                  <div className="absolute -inset-2 bg-emerald-400/10 blur-xl rounded-full -z-10 animate-pulse" />
                )}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${isActive ? "opacity-100 translate-y-0" : "opacity-60 translate-y-0.5"}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              )}
            </div>
          );

          return (
            <div key={index} className="flex-1 flex items-center justify-center h-full min-w-0">
              {item.component ? (
                <div className="flex flex-col items-center justify-center w-full h-full py-2">
                  {item.component}
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 opacity-60 mt-1 whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              ) : item.href ? (
                <Link href={item.href} className="w-full h-full flex items-center justify-center">
                  {content}
                </Link>
              ) : (
                <button onClick={item.onClick} className="w-full h-full flex items-center justify-center">
                  {content}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
