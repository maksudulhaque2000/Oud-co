import Link from "next/link";
import { Globe2, Mail, Send } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-amber-900/20 bg-[#0c0805] text-[#e9dab5]">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
        <div>
          <p className="text-2xl font-bold tracking-wide text-[#d6b36a]">Oud.co</p>
          <p className="mt-2 max-w-xs text-sm text-[#d8c59b]">
            Where Every Drop Tells a Story of heritage, craft, and timeless luxury.
          </p>
        </div>

        <div>
          <p className="mb-3 font-semibold text-[#f5e6c2]">Navigate</p>
          <div className="space-y-2 text-sm">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="block hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 font-semibold text-[#f5e6c2]">Social</p>
          <div className="flex items-center gap-3">
            <a href="#" className="rounded-full border border-[#d6b36a]/40 p-2 hover:border-[#d6b36a]" aria-label="Facebook">
              <Globe2 size={16} />
            </a>
            <a href="#" className="rounded-full border border-[#d6b36a]/40 p-2 hover:border-[#d6b36a]" aria-label="Instagram">
              <Mail size={16} />
            </a>
            <a href="#" className="rounded-full border border-[#d6b36a]/40 p-2 hover:border-[#d6b36a]" aria-label="Youtube">
              <Send size={16} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-amber-900/20 px-4 py-4 text-center text-xs text-[#cbb280] md:px-6">
        Copyright (c) 2025 Oud.co. All rights reserved.
      </div>
    </footer>
  );
}
