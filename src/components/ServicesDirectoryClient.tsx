"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { type ClinicService, CLINIC_INFO } from "@/data/mediaManifest";
import {
  ArrowUpRight,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/BrandIcons";

interface ServicesDirectoryClientProps {
  initialServices: ClinicService[];
}

export default function ServicesDirectoryClient({ initialServices }: ServicesDirectoryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Oral Surgery",
    "Maxillofacial Trauma & Oncology",
    "Restorative & Implantology",
    "Preventive & Endodontics",
  ];

  const filteredServices =
    selectedCategory === "All"
      ? initialServices
      : initialServices.filter((s) => s.category === selectedCategory);

  return (
    <div className="space-y-16 md:space-y-24 pb-24">
      {/* 1. EDITORIAL HEADER */}
      <section className="pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] text-[#103629] dark:text-[#F7F5EF] text-xs font-mono tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B69A61]" />
            <span>{initialServices.length} Specialized Clinical Departments</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#103629] dark:text-[#F7F5EF] font-normal tracking-tight leading-[1.08]">
            Surgical &amp; Dental Procedures Directory
          </h1>
          <p className="text-base sm:text-lg text-[#545C57] dark:text-[#CBD5CF] font-sans leading-relaxed pt-2 font-light">
            From acute pulpitis management and clear aligner orthodontics to complex maxillofacial trauma reconstruction and rigid titanium osteosynthesis, explore our comprehensive scope of evidence-based treatments.
          </p>
        </div>

        {/* Services Quick Scan Directory Bar */}
        <div className="mt-10 p-6 bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E4E0D6] dark:border-[#1E4234]">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B69A61] dark:text-[#CBB584] font-semibold">
              Rapid Clinical Index &bull; Click to Jump
            </span>
            <span className="text-xs font-mono text-[#707873] dark:text-[#A8B2AC]">
              {initialServices.length} Documented Procedures
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {initialServices.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="p-2.5 bg-[#FAF9F6] dark:bg-[#0F261D] hover:bg-[#EFECE3] dark:hover:bg-[#174635] border border-[#E4E0D6] dark:border-[#1E4234] text-left transition-colors group block"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-[#B69A61] dark:text-[#CBB584] font-medium mb-1">
                  <span>{s.number}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs font-serif text-[#103629] dark:text-[#F7F5EF] font-medium line-clamp-1 group-hover:text-[#B69A61]">
                  {s.title}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="pt-8 flex flex-wrap items-center gap-2 border-b border-[#E4E0D6] dark:border-[#1E4234] pb-6">
          <span className="text-xs font-mono text-[#707873] dark:text-[#A8B2AC] uppercase tracking-wider mr-2 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#B69A61]" />
            Filter by Specialty:
          </span>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-xs font-sans tracking-wide rounded-sm transition-all ${
                selectedCategory === category
                  ? "bg-[#103629] dark:bg-[#B69A61] text-[#F7F5EF] dark:text-[#0A1B14] font-semibold shadow-sm"
                  : "bg-[#EFECE3] dark:bg-[#102B21] hover:bg-[#E4E0D6] dark:hover:bg-[#1A3D30] text-[#545C57] dark:text-[#CBD5CF] border border-[#E4E0D6] dark:border-[#1E4234]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* 2. SERVICES LIST (ALTERNATING EDITORIAL DESIGN) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {filteredServices.map((service, index) => {
            const isEven = index % 2 === 1;
            return (
              <div
                key={service.id}
                id={service.id}
                className="bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch group hover:border-[#B69A61]/50 transition-colors scroll-mt-24 shadow-sm"
              >
                {/* Service Imagery: Uncropped procedural clinical graphic */}
                <div
                  className={`lg:col-span-5 bg-[#103629] dark:bg-[#071510] relative min-h-[340px] lg:min-h-full overflow-hidden flex items-center justify-center p-6 ${
                    isEven ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <div className="relative max-w-[220px] sm:max-w-[260px] w-full aspect-[323/517] mx-auto drop-shadow-xl">
                    <Image
                      src={service.image}
                      alt={service.alt}
                      width={323}
                      height={517}
                      sizes="(max-width: 640px) 220px, 260px"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 filter contrast-[1.03]"
                    />
                  </div>
                  <div className="absolute top-4 left-4 bg-[#103629]/90 backdrop-blur-sm text-[#B69A61] dark:text-[#CBB584] font-mono text-xs px-3 py-1 uppercase tracking-widest border border-[#B69A61]/20">
                    Procedure {service.number}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-[#103629]/85 backdrop-blur-sm text-[#F7F5EF] text-[10px] font-mono px-3 py-1">
                    {service.category}
                  </div>
                </div>

                {/* Service Detailed Overview */}
                <div
                  className={`lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B69A61] dark:text-[#CBB584] font-semibold">
                        {service.category}
                      </span>
                      <span className="text-xs font-mono text-[#707873] dark:text-[#A8B2AC]">
                        Evidence-Based Protocol
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl text-[#103629] dark:text-[#F7F5EF] font-normal mb-3">
                      {service.title}
                    </h2>

                    <p className="text-sm text-[#545C57] dark:text-[#CBD5CF] font-sans leading-relaxed mb-6 font-light">
                      {service.fullDesc}
                    </p>

                    {/* Clinical Indications */}
                    <div className="space-y-3 pt-4 border-t border-[#E4E0D6] dark:border-[#1E4234]">
                      <h3 className="text-xs font-mono uppercase tracking-wider text-[#103629] dark:text-[#F7F5EF] font-medium">
                        Primary Clinical Indications:
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {service.indications.map((ind, i) => (
                          <li
                            key={i}
                            className="text-xs text-[#545C57] dark:text-[#CBD5CF] flex items-start gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#B69A61] shrink-0 mt-0.5" />
                            <span>{ind}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Approach / Technique */}
                    <div className="mt-5 p-4 bg-[#E4E0D6]/70 dark:bg-[#0A1B14]/60 border border-[#E4E0D6] dark:border-[#1E4234] rounded-sm">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#103629] dark:text-[#F7F5EF] font-semibold block mb-1">
                        Surgical &amp; Procedural Methodology:
                      </span>
                      <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] font-sans leading-relaxed">
                        {service.clinicalApproach}
                      </p>
                    </div>
                  </div>

                  {/* Footer action */}
                  <div className="pt-4 border-t border-[#E4E0D6] dark:border-[#1E4234] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="text-[11px] font-mono text-[#707873] dark:text-[#A8B2AC]">
                      Clinical oversight: Dr Vishal Lohana and his team
                    </div>
                    <Link
                      href={`/appointment?service=${encodeURIComponent(service.title)}`}
                      className="inline-flex items-center gap-2 bg-[#103629] hover:bg-[#174635] text-[#F7F5EF] px-5 py-2.5 text-xs font-sans uppercase tracking-widest font-medium transition-colors"
                    >
                      <span>Book for this Procedure</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#B69A61]" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. CLINICAL TRIAGE CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0A241B] text-[#F7F5EF] p-8 sm:p-12 border border-[#174635] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B69A61] block font-semibold">
              Unsure Which Procedure Fits Your Symptoms?
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-ivory-50 font-normal">
              Direct Clinical Triage &amp; Phone Consultation
            </h3>
            <p className="text-xs sm:text-sm text-ivory-300 max-w-xl font-light leading-relaxed">
              Call our clinic at{" "}
              <a href={CLINIC_INFO.phoneTel} className="text-[#B69A61] underline font-mono">
                {CLINIC_INFO.phoneDisplay}
              </a>{" "}
              or message via WhatsApp. Our team will guide you on the appropriate diagnostic steps.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a
              href={CLINIC_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-3 text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>WhatsApp Triage</span>
            </a>
            <Link
              href="/appointment"
              className="inline-flex items-center gap-2 bg-[#B69A61] hover:bg-[#CBB584] text-[#103629] px-6 py-3 text-xs font-sans uppercase tracking-widest font-semibold transition-colors shrink-0"
            >
              <span>Book Appointment</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
