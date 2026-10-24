"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowUpRight, Phone } from "lucide-react";
import { CLINIC_INFO } from "@/data/mediaManifest";
import { ThemeToggle } from "@/components/ThemeProvider";
import { WhatsAppIcon } from "@/components/BrandIcons";

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Overview" },
    { href: "/about", label: "The Clinic & Team" },
    { href: "/services", label: "Specialized Services" },
    { href: "/client-work", label: "Clinical Cases" },
  ];

  return (
    <>
      {/* Top Editorial Utility Strip */}
      <div className="bg-[#103629] dark:bg-[#06120D] text-[#F7F5EF] text-[11px] font-sans border-b border-[#174635] dark:border-[#142B21] py-2 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4 tracking-wide">
          <div className="flex items-center gap-2 text-ivory-300 dark:text-[#CBD5CF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B69A61]" />
            <span className="font-light">
              Quaid-E-Azam Medical Complex, Hyderabad &bull; Led by {CLINIC_INFO.leadSurgeon}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-ivory-200 text-[11px]">
            <span className="hidden lg:inline font-light text-ivory-300 dark:text-[#95A39B]">
              Mon–Sat: 4:00 PM – 10:00 PM &bull; Sun: Closed
            </span>
            <span className="hidden lg:inline text-forest-700 dark:text-[#1E4234]">|</span>
            <div className="flex items-center gap-2">
              <a
                href={CLINIC_INFO.phoneTel}
                className="text-[#F7F5EF] hover:text-[#B69A61] transition-colors inline-flex items-center gap-1 font-medium"
                aria-label={`Call ${CLINIC_INFO.phoneDisplay}`}
              >
                <Phone className="w-3 h-3 text-[#B69A61]" />
                <span>{CLINIC_INFO.phoneDisplay}</span>
              </a>
              <span className="text-ivory-400/50">/</span>
              <a
                href={CLINIC_INFO.secondaryPhoneTel}
                className="text-[#F7F5EF] hover:text-[#B69A61] transition-colors inline-flex items-center gap-1 font-medium"
                aria-label={`Call ${CLINIC_INFO.secondaryPhoneDisplay}`}
              >
                <span>{CLINIC_INFO.secondaryPhoneDisplay}</span>
              </a>
            </div>
            <span className="text-forest-700 dark:text-[#1E4234]">|</span>
            <div className="flex items-center gap-1.5">
              <a
                href={CLINIC_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#CBB584] hover:text-[#F7F5EF] transition-colors inline-flex items-center gap-1.5 font-medium"
                aria-label="Direct WhatsApp consultation"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              <span className="text-ivory-400/50">/</span>
              <a
                href={CLINIC_INFO.secondaryWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#CBB584] hover:text-[#F7F5EF] transition-colors inline-flex items-center gap-1 font-medium"
                aria-label="Secondary WhatsApp consultation"
              >
                <span>Line 2</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Editorial Header */}
      <header className="sticky top-0 z-40 bg-[#F7F5EF]/95 dark:bg-[#0A1B14]/95 backdrop-blur-sm border-b border-[#E4E0D6] dark:border-[#1E4234] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-22">
            {/* Logo + Wordmark */}
            <Link href="/" className="group flex items-center gap-3 sm:gap-3.5 py-1">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-sm overflow-hidden border border-[#E4E0D6] dark:border-[#1E4234] bg-[#202622] shrink-0 shadow-xs group-hover:border-[#B69A61] transition-colors relative">
                <Image
                  src="/media/logo.jpeg"
                  alt="BMK Dental & Maxillofacial Clinic Logo"
                  width={44}
                  height={44}
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-xl lg:text-2xl tracking-[-0.01em] text-[#103629] dark:text-[#F7F5EF] font-normal group-hover:text-[#174635] dark:group-hover:text-[#CBB584] transition-colors leading-tight">
                  BMK Dental &amp; Maxillofacial Clinic
                </span>
                <span className="text-[10px] tracking-[0.2em] text-[#545C57] dark:text-[#95A39B] uppercase font-sans font-medium mt-0.5">
                  Specialist Practice &bull; Dr Vishal Lohana (FCPS, BDS)
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-[13px] tracking-[0.03em] font-sans transition-colors relative py-1.5 ${
                      isActive
                        ? "text-[#103629] dark:text-[#F7F5EF] font-semibold"
                        : "text-[#545C57] dark:text-[#CBD5CF] hover:text-[#103629] dark:hover:text-[#F7F5EF] font-normal"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#B69A61] dark:bg-[#CBB584]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action CTA & Theme Toggle */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              {/* Accessible Theme Toggle */}
              <ThemeToggle />

              <Link
                href="/appointment"
                className="hidden sm:inline-flex items-center gap-2 bg-[#103629] dark:bg-[#B69A61] hover:bg-[#174635] dark:hover:bg-[#CBB584] text-[#F7F5EF] dark:text-[#0A1B14] px-5 py-2.5 text-xs font-sans tracking-[0.14em] uppercase font-medium border border-[#103629] dark:border-[#B69A61] transition-all duration-200"
              >
                <span>Book Appointment</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#B69A61] dark:text-[#0A1B14]" />
              </Link>

              {/* Mobile Menu Trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#103629] dark:text-[#F7F5EF] hover:text-[#174635] dark:hover:text-[#CBB584] focus:outline-none focus:ring-1 focus:ring-[#B69A61]"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#F7F5EF] dark:bg-[#0A1B14] border-b border-[#E4E0D6] dark:border-[#1E4234] px-4 pt-3 pb-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4E0D6] dark:border-[#1E4234]">
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#707873] dark:text-[#95A39B]">
                Theme Appearance
              </span>
              <ThemeToggle showLabel />
            </div>

            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 text-sm font-sans tracking-wide transition-colors ${
                      isActive
                        ? "bg-[#103629] dark:bg-[#183C2F] text-[#F7F5EF] font-medium"
                        : "text-[#202622] dark:text-[#EFECE3] hover:bg-[#EFECE3] dark:hover:bg-[#143026]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-[#E4E0D6] dark:border-[#1E4234] space-y-2.5">
              <Link
                href="/appointment"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#103629] dark:bg-[#B69A61] text-[#F7F5EF] dark:text-[#0A1B14] px-4 py-3 text-xs uppercase tracking-[0.14em] font-semibold text-center"
              >
                <span>Book an Appointment</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#B69A61] dark:text-[#0A1B14]" />
              </Link>

              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={CLINIC_INFO.phoneTel}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#EFECE3] dark:bg-[#143026] border border-[#E4E0D6] dark:border-[#1E4234] text-[#103629] dark:text-[#F7F5EF] text-xs font-medium"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#B69A61]" />
                    <span>Call ({CLINIC_INFO.phoneDisplay})</span>
                  </a>
                  <a
                    href={CLINIC_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#EFECE3] dark:bg-[#143026] border border-[#E4E0D6] dark:border-[#1E4234] text-[#103629] dark:text-[#F7F5EF] text-xs font-medium"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>WhatsApp 1</span>
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={CLINIC_INFO.secondaryPhoneTel}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#FAF9F6] dark:bg-[#0F261D] border border-[#E4E0D6] dark:border-[#1E4234] text-[#103629] dark:text-[#F7F5EF] text-xs font-medium"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#B69A61]" />
                    <span>Call ({CLINIC_INFO.secondaryPhoneDisplay})</span>
                  </a>
                  <a
                    href={CLINIC_INFO.secondaryWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#FAF9F6] dark:bg-[#0F261D] border border-[#E4E0D6] dark:border-[#1E4234] text-[#103629] dark:text-[#F7F5EF] text-xs font-medium"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>WhatsApp 2</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
