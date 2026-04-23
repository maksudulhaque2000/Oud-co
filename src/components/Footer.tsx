import Link from "next/link";
import {
  FaFacebookF,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { SiThreads } from "react-icons/si";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { href: "https://maksudul-haque.vercel.app/", label: "Portfolio", icon: FaGlobe },
  { href: "https://github.com/maksudulhaque2000", label: "GitHub", icon: FaGithub },
  { href: "https://www.linkedin.com/in/maksudulhaque2000/", label: "LinkedIn", icon: FaLinkedinIn },
  { href: "https://www.facebook.com/maksudulhaque2000", label: "Facebook", icon: FaFacebookF },
  { href: "https://www.instagram.com/maksudulhaque2000/", label: "Instagram", icon: FaInstagram },
  { href: "https://www.youtube.com/@maksudulhaque2000", label: "YouTube", icon: FaYoutube },
  { href: "https://www.threads.com/@maksudulhaque2000", label: "Threads", icon: SiThreads },
  { href: "https://x.com/smmaksudulhaque", label: "X (Twitter)", icon: FaXTwitter },
];

export default function Footer() {
  return (
    <footer className="border-t border-amber-900/20 bg-[#0a0604] text-[#e9dab5]">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.2fr_0.8fr_1fr] md:px-6">
        <div>
          <p className="text-3xl font-bold tracking-wide text-[#d6b36a]">Oud.co</p>
          <p className="mt-2 max-w-xs text-sm text-[#d8c59b]">
            Where Every Drop Tells a Story of heritage, craft, and timeless luxury.
          </p>
          <a
            href="https://maksudul-haque.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-md border border-[#d6b36a]/40 bg-[#1b120c] px-4 py-2 text-sm font-semibold text-[#f0dca7] transition hover:border-[#d6b36a] hover:text-white"
          >
            Visit Portfolio
          </a>
        </div>

        <div>
          <p className="mb-3 font-semibold uppercase tracking-wide text-[#f5e6c2]">Navigate</p>
          <div className="space-y-2 text-sm">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="block hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 font-semibold uppercase tracking-wide text-[#f5e6c2]">Social Profiles</p>
          <div className="grid grid-cols-4 gap-2">
            {socialLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                title={item.label}
                aria-label={item.label}
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#d6b36a]/30 bg-[#1b120c] text-[#e0cfa9] transition hover:-translate-y-0.5 hover:border-[#d6b36a] hover:text-white"
              >
                <item.icon size={16} />
              </a>
            ))}
          </div>
          <p className="mt-3 text-xs text-[#bca475]">Follow Maksudul Haque (Moon) across platforms</p>
        </div>
      </div>
      <div className="border-t border-amber-900/20 px-4 py-4 text-center text-xs text-[#cbb280] md:px-6">
        Copyright (c) 2026 Oud.co. All rights reserved.
      </div>
    </footer>
  );
}
