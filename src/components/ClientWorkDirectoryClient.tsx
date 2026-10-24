"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { type ClientCase, CLINIC_INFO } from "@/data/mediaManifest";
import ClinicalModal from "@/components/ClinicalModal";
import {
  Filter,
  Eye,
  ZoomIn,
  ShieldCheck,
  Phone,
  ArrowUpRight,
} from "lucide-react";

interface ClientWorkDirectoryClientProps {
  initialCases: ClientCase[];
}

export default function ClientWorkDirectoryClient({ initialCases }: ClientWorkDirectoryClientProps) {
  const [activeCase, setActiveCase] = useState<ClientCase | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const defaultCategories = [
    "All",
    "Implantology",
    "Maxillofacial Surgery",
    "Aesthetic Orthodontics",
    "Radiology & Implantology",
    "Micro-Endodontics",
    "Maxillofacial Oncology",
    "Maxillofacial Trauma",
  ];

  // Dynamically include any new categories added via CMS
  const dynamicCategories = Array.from(
    new Set(["All", ...defaultCategories.slice(1), ...initialCases.map((c) => c.category).filter(Boolean)])
  );

  const filtered =
    selectedCategory === "All"
      ? initialCases
      : initialCases.filter((c) => c.category === selectedCategory);

  const featuredLeadCase = filtered[0];
  const galleryCases = filtered.slice(1);

  return (
    <>
      <ClinicalModal clinicalCase={activeCase} onClose={() => setActiveCase(null)} />

      <div className="space-y-16 md:space-y-24 pb-24">
        {/* HEADER */}
        <section className="pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] text-[#103629] dark:text-[#F7F5EF] text-xs font-mono tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B69A61]" />
              <span>Authentic Clinical Records Archive &bull; {initialCases.length} Documented Records</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#103629] dark:text-[#F7F5EF] font-normal tracking-tight leading-[1.08]">
              Documented Clinical &amp; Surgical Cases
            </h1>
            <p className="text-base sm:text-lg text-[#545C57] dark:text-[#CBD5CF] font-sans leading-relaxed pt-2 font-light">
              Objective photographic and radiographic case studies performed at BMK Dental &amp; Maxillofacial Clinic in Hyderabad. All records represent real patient presentations and factual procedural notes.
            </p>
          </div>

          {/* Ethical Disclaimer */}
          <div className="mt-8 p-5 bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] text-xs text-[#545C57] dark:text-[#CBD5CF] font-sans leading-relaxed max-w-3xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#103629] dark:text-[#B69A61] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#103629] dark:text-[#F7F5EF] block mb-0.5">Clinical Transparency &amp; Patient Privacy:</strong>
              Photographs and radiographs are clinical records from BMK Clinic. Patient identities are protected. Individual anatomical healing and clinical responses vary. These case records are published solely for clinical reference and educational transparency, and do not constitute guaranteed treatment outcomes.
            </div>
          </div>

          {/* Category Filter */}
          <div className="pt-8 flex flex-wrap items-center gap-2 border-b border-[#E4E0D6] dark:border-[#1E4234] pb-6">
            <span className="text-xs font-mono text-[#707873] dark:text-[#A8B2AC] uppercase tracking-wider mr-2 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#B69A61]" />
              Specialty Category:
            </span>
            {dynamicCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-sans tracking-wide transition-all ${
                  selectedCategory === cat
                    ? "bg-[#103629] dark:bg-[#B69A61] text-[#F7F5EF] dark:text-[#0A1B14] font-semibold shadow-sm"
                    : "bg-[#EFECE3] dark:bg-[#102B21] hover:bg-[#E4E0D6] dark:hover:bg-[#1A3D30] text-[#545C57] dark:text-[#CBD5CF] border border-[#E4E0D6] dark:border-[#1E4234]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* FEATURED LEAD CASE SPOTLIGHT */}
        {featuredLeadCase && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#B69A61] dark:text-[#CBB584] font-semibold">
                Spotlight Clinical Case Study
              </span>
            </div>

            <div className="bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch shadow-sm">
              <div className="lg:col-span-7 bg-[#071510] relative min-h-[360px] lg:min-h-[460px] overflow-hidden group flex items-center justify-center p-4">
                <Image
                  src={featuredLeadCase.image}
                  alt={featuredLeadCase.alt}
                  width={784}
                  height={460}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="w-full max-h-[460px] object-contain group-hover:scale-[1.02] transition-transform duration-500"
                />
                <button
                  type="button"
                  onClick={() => setActiveCase(featuredLeadCase)}
                  className="absolute inset-0 bg-[#0A1B14]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                  aria-label={`Inspect ${featuredLeadCase.title}`}
                >
                  <div className="flex items-center gap-2 text-[#F7F5EF] text-xs font-mono uppercase tracking-wider border border-[#B69A61] bg-[#103629]/90 px-5 py-2.5">
                    <ZoomIn className="w-4 h-4 text-[#B69A61]" />
                    <span>Click to Inspect High-Resolution Record</span>
                  </div>
                </button>
                <div className="absolute top-4 left-4 bg-[#103629]/90 text-[#B69A61] dark:text-[#CBB584] font-mono text-xs px-3 py-1 uppercase tracking-widest border border-[#B69A61]/20">
                  {featuredLeadCase.category}
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#707873] dark:text-[#A8B2AC] mb-2">
                    <span>Clinical Case 01</span>
                    <span className="text-[#B69A61] dark:text-[#CBB584] font-medium">Verified Clinic Record</span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl text-[#103629] dark:text-[#F7F5EF] font-normal mb-3">
                    {featuredLeadCase.title}
                  </h2>

                  <p className="text-sm text-[#545C57] dark:text-[#CBD5CF] font-sans leading-relaxed mb-4 font-light">
                    {featuredLeadCase.clinicalSummary}
                  </p>

                  <div className="p-4 bg-[#E4E0D6]/70 dark:bg-[#0A1B14]/60 border border-[#E4E0D6] dark:border-[#1E4234] space-y-2 mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#103629] dark:text-[#F7F5EF] font-semibold block">
                      Procedure Documentation:
                    </span>
                    <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] font-sans leading-relaxed">
                      {featuredLeadCase.procedureNotes}
                    </p>
                  </div>

                  <div className="space-y-1 text-xs font-mono text-[#707873] dark:text-[#A8B2AC]">
                    <p>
                      <strong className="text-[#103629] dark:text-[#F7F5EF]">Modality:</strong> {featuredLeadCase.modality}
                    </p>
                    <p>
                      <strong className="text-[#103629] dark:text-[#F7F5EF]">Diagnostic Method:</strong>{" "}
                      {featuredLeadCase.diagnosticMethod}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E4E0D6] dark:border-[#1E4234] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveCase(featuredLeadCase)}
                    className="inline-flex items-center gap-2 bg-[#103629] hover:bg-[#174635] text-[#F7F5EF] px-5 py-2.5 text-xs font-sans uppercase tracking-widest font-semibold transition-colors"
                  >
                    <Eye className="w-4 h-4 text-[#B69A61]" />
                    <span>Examine Radiograph</span>
                  </button>
                  <Link
                    href="/appointment"
                    className="text-xs font-mono text-[#103629] dark:text-[#F7F5EF] font-semibold hover:text-[#B69A61] dark:hover:text-[#CBB584] inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Request Case Review</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* EDITORIAL GALLERY GRID FOR REMAINING CASES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between border-b border-[#E4E0D6] dark:border-[#1E4234] pb-4">
            <h3 className="font-serif text-2xl text-[#103629] dark:text-[#F7F5EF] font-normal">
              Additional Documented Cases
            </h3>
            <span className="text-xs font-mono text-[#707873] dark:text-[#A8B2AC]">
              Showing {galleryCases.length} records
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryCases.map((clinicalCase, index) => (
              <button
                key={clinicalCase.id}
                onClick={() => setActiveCase(clinicalCase)}
                className="text-left bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] overflow-hidden flex flex-col group hover:border-[#B69A61]/60 transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#B69A61] focus:ring-offset-2"
                aria-label={`Open clinical case: ${clinicalCase.title}`}
              >
                {/* Case Image */}
                <div className="relative bg-[#071510] aspect-[4/3] overflow-hidden">
                  <Image
                    src={clinicalCase.image}
                    alt={clinicalCase.alt}
                    width={400}
                    height={300}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-[#0A1B14]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-[#F7F5EF] text-xs font-mono uppercase tracking-wider border border-[#B69A61]/60 px-4 py-2 bg-[#103629]/90">
                      <ZoomIn className="w-4 h-4 text-[#B69A61]" />
                      <span>Inspect Radiograph</span>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 bg-[#103629]/85 backdrop-blur-sm text-[#B69A61] dark:text-[#CBB584] text-[10px] font-mono px-2.5 py-1 uppercase tracking-wider border border-[#B69A61]/20">
                    {clinicalCase.category}
                  </div>

                  {/* Number Badge */}
                  <div className="absolute bottom-3 right-3 bg-[#0A1B14]/80 text-[#CBD5CF] text-[10px] font-mono px-2 py-1 border border-white/10">
                    Case {String(index + 2).padStart(2, "0")}
                  </div>
                </div>

                {/* Case Detail */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-lg font-medium text-[#103629] dark:text-[#F7F5EF] mb-2 group-hover:text-[#B69A61] transition-colors">
                      {clinicalCase.title}
                    </h4>
                    <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] font-sans leading-relaxed line-clamp-3">
                      {clinicalCase.clinicalSummary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E4E0D6] dark:border-[#1E4234] mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#707873] dark:text-[#A8B2AC] uppercase tracking-wider block">
                        Modality
                      </span>
                      <span className="text-[11px] font-medium text-[#103629] dark:text-[#F7F5EF] line-clamp-1">
                        {clinicalCase.modality}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#103629] dark:text-[#F7F5EF] font-semibold group-hover:text-[#B69A61] transition-colors shrink-0">
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Record</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* CLINICAL INQUIRY BANNER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0A241B] text-[#F7F5EF] p-8 sm:p-12 border border-[#174635] flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B69A61] block font-semibold">
                Direct Evaluation &amp; Surgical Consultation
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-ivory-50 font-normal">
                Facing a Complex Jaw Fracture or Oral Lesion?
              </h3>
              <p className="text-xs sm:text-sm text-ivory-300 max-w-xl font-light leading-relaxed">
                Our surgical team led by Dr Vishal Lohana (FCPS, BDS) evaluates acute trauma and surgical pathology at Quaid-E-Azam Medical Complex, Saddar, Hyderabad.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <a
                href={CLINIC_INFO.phoneTel}
                className="inline-flex items-center gap-2 bg-[#F7F5EF]/10 hover:bg-[#F7F5EF]/20 text-[#F7F5EF] px-5 py-3 text-xs font-mono uppercase tracking-wider font-semibold border border-white/20 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#B69A61]" />
                <span>Call {CLINIC_INFO.phoneDisplay}</span>
              </a>
              <Link
                href="/appointment"
                className="inline-flex items-center gap-2 bg-[#B69A61] hover:bg-[#CBB584] text-[#103629] px-6 py-3 text-xs font-sans uppercase tracking-widest font-semibold transition-colors shrink-0"
              >
                <span>Book Consultation</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
