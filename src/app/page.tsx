import Link from "next/link";
import Image from "next/image";
import { CLINIC_INFO, CLINIC_VIDEOS } from "@/data/mediaManifest";
import { getPublicStaff, getPublicServices, getPublicCases } from "@/lib/data/clinic-data";
import VideoPlayer from "@/components/VideoPlayer";
import {
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Microscope,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Stethoscope,
  Video,
} from "lucide-react";
import { WhatsAppIcon, FacebookIcon, InstagramIcon } from "@/components/BrandIcons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consultant Oral & Maxillofacial Surgeon | Dental Clinic Hyderabad",
  description:
    "BMK Dental & Maxillofacial Clinic in Saddar, Hyderabad. Led by Dr Vishal Lohana (FCPS, BDS). Specializing in dental implants, jaw fractures, surgical extractions, and restorative dentistry.",
  alternates: {
    canonical: "/",
  },
};

export const revalidate = 60;

export default async function HomePage() {
  const [clinicTeam, clinicServices, clientCases] = await Promise.all([
    getPublicStaff(),
    getPublicServices(),
    getPublicCases(),
  ]);

  const drVishal =
    clinicTeam.find((m) => m.id === "dr-vishal-lohana" || m.name.toLowerCase().includes("vishal")) ||
    clinicTeam[0];
  const drJotika =
    clinicTeam.find((m) => m.id === "dr-jotika" || m.name.toLowerCase().includes("jotika")) ||
    clinicTeam[1] ||
    clinicTeam[0];
  const auxiliaryStaff = clinicTeam.filter(
    (m) => m.id !== drVishal?.id && m.id !== drJotika?.id
  );

  // Curated spotlight service & complementary procedures
  const spotlightService =
    clinicServices.find((s) => s.id === "dental-implants" || s.slug?.includes("implant")) ||
    clinicServices[0];
  const featuredServices = [
    clinicServices.find((s) => s.id === "root-canals-hot-tooth" || s.slug?.includes("root-canal")) ||
      clinicServices[0],
    clinicServices.find((s) => s.id === "impacted-tooth-removal" || s.slug?.includes("impacted")) ||
      clinicServices[1] ||
      clinicServices[0],
    clinicServices.find((s) => s.id === "jaw-fractures" || s.slug?.includes("fracture")) ||
      clinicServices[2] ||
      clinicServices[0],
  ];

  // Documented surgical cases for editorial preview
  const primaryCase =
    clientCases.find((c: any) => c.id === "mandible-fracture-mini-plates" || c.slug?.includes("mandible")) ||
    clientCases[0];
  const secondaryCases = [
    clientCases.find((c: any) => c.id === "immediate-dental-implant" || c.slug?.includes("implant")) ||
      clientCases[1] ||
      clientCases[0],
    clientCases.find((c: any) => c.id === "teeth-alignment-no-wires" || c.slug?.includes("align")) ||
      clientCases[2] ||
      clientCases[0],
    clientCases.find((c: any) => c.id === "identification-four-canals-rct" || c.slug?.includes("canal")) ||
      clientCases[3] ||
      clientCases[0],
  ];

  return (
    <div className="bg-[#F7F5EF] dark:bg-[#0A1B14] text-[#202622] dark:text-[#EFECE3] transition-colors duration-200">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION — Asymmetric Editorial Composition
      ────────────────────────────────────────────────────────────── */}
      <section className="border-b border-[#E4E0D6] dark:border-[#1E4234] pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Expressive Headline & Authentic Copy */}
          <div className="lg:col-span-7 space-y-8">
            {/* Restrained Eyebrow */}
            <div className="inline-flex items-center gap-2.5 text-[11px] font-sans tracking-[0.2em] text-[#545C57] dark:text-[#95A39B] uppercase font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B69A61] dark:bg-[#CBB584]" />
              <span>Specialist Practice &bull; Hyderabad, Pakistan</span>
            </div>

            {/* Major Editorial Headline */}
            <div className="space-y-4">
              <h1 className="font-serif text-[clamp(2.75rem,5.5vw,4.75rem)] leading-[1.04] text-[#103629] dark:text-[#F7F5EF] font-normal tracking-[-0.02em]">
                Specialist care.<br />
                <span className="italic font-light">Considered</span> in every detail.
              </h1>
              <div className="w-16 h-[1.5px] bg-[#B69A61] dark:bg-[#CBB584]" />
            </div>

            {/* Authentic Narrative */}
            <p className="text-base sm:text-lg text-[#545C57] dark:text-[#CBD5CF] font-sans font-light leading-relaxed max-w-xl">
              BMK Dental &amp; Maxillofacial Clinic brings consultant-led surgical precision and restorative dental medicine together under one roof. Led by{" "}
              <strong className="font-semibold text-[#103629] dark:text-[#CBB584]">Dr Vishal Lohana (FCPS, BDS)</strong>{" "}
              and his team in Hyderabad.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <Link
                href="/appointment"
                className="inline-flex items-center justify-center gap-2 bg-[#103629] dark:bg-[#B69A61] hover:bg-[#174635] dark:hover:bg-[#CBB584] text-[#F7F5EF] dark:text-[#0A1B14] px-7 py-4 text-xs font-sans tracking-[0.16em] uppercase font-medium border border-[#103629] dark:border-[#B69A61] transition-all shadow-sm"
              >
                <span>Book an Appointment</span>
                <ArrowUpRight className="w-4 h-4 text-[#B69A61] dark:text-[#0A1B14]" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 bg-[#EFECE3] dark:bg-[#143026] hover:bg-[#E4E0D6] dark:hover:bg-[#18382C] text-[#103629] dark:text-[#F7F5EF] px-6 py-4 text-xs font-sans tracking-[0.16em] uppercase font-medium border border-[#E4E0D6] dark:border-[#1E4234] transition-colors"
              >
                <span>Explore Specialized Services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Direct Contact & Verified Hours Strip */}
            <div className="pt-4 border-t border-[#E4E0D6] dark:border-[#1E4234] flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-5 text-xs font-sans text-[#545C57] dark:text-[#95A39B]">
              <div className="inline-flex items-center gap-1.5 text-[#103629] dark:text-[#F7F5EF] font-medium">
                <Phone className="w-3.5 h-3.5 text-[#B69A61] dark:text-[#CBB584]" />
                <span>Call:</span>
                <a
                  href={CLINIC_INFO.phoneTel}
                  className="hover:text-[#B69A61] dark:hover:text-[#CBB584] font-semibold transition-colors"
                >
                  {CLINIC_INFO.phoneDisplay}
                </a>
                <span>/</span>
                <a
                  href={CLINIC_INFO.secondaryPhoneTel}
                  className="hover:text-[#B69A61] dark:hover:text-[#CBB584] font-semibold transition-colors"
                >
                  {CLINIC_INFO.secondaryPhoneDisplay}
                </a>
              </div>
              <span className="text-[#E4E0D6] dark:text-[#1E4234]">&bull;</span>
              <div className="inline-flex items-center gap-1.5 text-[#103629] dark:text-[#CBB584] font-medium">
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>WhatsApp:</span>
                <a
                  href={CLINIC_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#B69A61] dark:hover:text-[#F7F5EF] font-semibold transition-colors"
                >
                  {CLINIC_INFO.phoneDisplay}
                </a>
                <span>/</span>
                <a
                  href={CLINIC_INFO.secondaryWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#B69A61] dark:hover:text-[#F7F5EF] font-semibold transition-colors"
                >
                  {CLINIC_INFO.secondaryPhoneDisplay}
                </a>
              </div>
              <span className="text-[#E4E0D6] dark:text-[#1E4234]">&bull;</span>
              <span className="text-[#707873] dark:text-[#95A39B]">Mon–Sat: 4:00 PM – 10:00 PM</span>
            </div>
          </div>

          {/* Right Column: Thoughtfully Composed Editorial Portrait */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] p-3 sm:p-4 shadow-sm transition-colors">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#103629]/10 dark:bg-[#06120D]">
                <Image
                  src={drVishal.image}
                  alt={drVishal.alt}
                  width={640}
                  height={853}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 480px"
                  className="w-full h-full object-cover object-top filter brightness-[0.98] contrast-[1.02]"
                />
                <div className="absolute inset-0 border border-[#E4E0D6]/40 dark:border-[#1E4234]/60 pointer-events-none" />
              </div>

              {/* Editorial Plaque */}
              <div className="pt-4 pb-2 px-1 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[10px] font-sans tracking-[0.2em] text-[#B69A61] dark:text-[#CBB584] uppercase font-medium">
                  <span>Clinical Director</span>
                  <span>FCPS, BDS</span>
                </div>
                <h2 className="font-serif text-2xl text-[#103629] dark:text-[#F7F5EF] font-normal mt-1">
                  Dr Vishal Lohana
                </h2>
                <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] font-sans mt-0.5">
                  Consultant Oral &amp; Maxillofacial Surgeon &bull; Dental Surgeon
                </p>
                <p className="text-[11px] text-[#707873] dark:text-[#95A39B] font-sans mt-2 pt-2 border-t border-[#E4E0D6] dark:border-[#1E4234]">
                  Quaid-E-Azam Medical Complex, Saddar, Hyderabad
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. CLINIC INTRODUCTION — Calm Narrative & Foundations
      ────────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#E4E0D6] dark:border-[#1E4234]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Thesis & Statement */}
          <div className="lg:col-span-5 space-y-5">
            <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#B69A61] dark:text-[#CBB584] font-semibold block">
              The Clinic &bull; Hyderabad
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#103629] dark:text-[#F7F5EF] font-normal leading-[1.14]">
              A practice founded on surgical rigor, anatomical mastery, and quiet patient dignity.
            </h2>
            <div className="w-12 h-[1px] bg-[#B69A61] dark:bg-[#CBB584]" />
            <p className="text-sm sm:text-base text-[#545C57] dark:text-[#CBD5CF] font-sans leading-relaxed font-light">
              BMK Dental &amp; Maxillofacial Clinic operates with a singular standard: every patient receives direct care and evaluation from certified specialist clinicians. We unite advanced maxillofacial operative surgery with patient-centered restorative and cosmetic dentistry.
            </p>
            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.16em] text-[#103629] dark:text-[#CBB584] font-semibold hover:text-[#B69A61] dark:hover:text-[#F7F5EF] transition-colors"
              >
                <span>Learn About Our Practice &amp; Faculty</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Three Dignified Pillars */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 pt-2">
            <div className="space-y-3 p-5 bg-[#EFECE3]/50 dark:bg-[#102B21]/50 border border-[#E4E0D6] dark:border-[#1E4234] transition-colors">
              <div className="w-8 h-8 flex items-center justify-center text-[#103629] dark:text-[#F7F5EF]">
                <Microscope className="w-5 h-5 text-[#B69A61] dark:text-[#CBB584]" />
              </div>
              <h3 className="font-serif text-lg text-[#103629] dark:text-[#F7F5EF] font-normal">
                Diagnostic Precision
              </h3>
              <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] font-sans leading-relaxed font-light">
                High-resolution radiographic and CBCT assessments mapping nerve canals and osseous contours prior to any surgical intervention.
              </p>
            </div>

            <div className="space-y-3 p-5 bg-[#EFECE3]/50 dark:bg-[#102B21]/50 border border-[#E4E0D6] dark:border-[#1E4234] transition-colors">
              <div className="w-8 h-8 flex items-center justify-center text-[#103629] dark:text-[#F7F5EF]">
                <ShieldCheck className="w-5 h-5 text-[#B69A61] dark:text-[#CBB584]" />
              </div>
              <h3 className="font-serif text-lg text-[#103629] dark:text-[#F7F5EF] font-normal">
                Class-B Autoclave Protocol
              </h3>
              <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] font-sans leading-relaxed font-light">
                Hospital-grade vacuum sterilization protocols across all handpieces, instruments, and surgical trays to ensure absolute cross-infection control.
              </p>
            </div>

            <div className="space-y-3 p-5 bg-[#EFECE3]/50 dark:bg-[#102B21]/50 border border-[#E4E0D6] dark:border-[#1E4234] transition-colors">
              <div className="w-8 h-8 flex items-center justify-center text-[#103629] dark:text-[#F7F5EF]">
                <Stethoscope className="w-5 h-5 text-[#B69A61] dark:text-[#CBB584]" />
              </div>
              <h3 className="font-serif text-lg text-[#103629] dark:text-[#F7F5EF] font-normal">
                Consultant-Led Care
              </h3>
              <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] font-sans leading-relaxed font-light">
                Dr Vishal Lohana and his team personally conduct assessments, treatment plans, surgical procedures, and follow-up examinations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. SPECIALIZED SERVICES — Asymmetric Editorial Spread
      ────────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#E4E0D6] dark:border-[#1E4234]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 pb-6 border-b border-[#E4E0D6] dark:border-[#1E4234]">
          <div>
            <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#B69A61] dark:text-[#CBB584] font-semibold block mb-2">
              Clinical Discipline
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#103629] dark:text-[#F7F5EF] font-normal tracking-[-0.01em]">
              Specialized Services
            </h2>
            <p className="text-sm text-[#545C57] dark:text-[#CBD5CF] font-sans mt-2 max-w-xl font-light">
              From complex trauma osteosynthesis and oral pathology to micro-endodontics and aesthetic clear aligners.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-[#103629] dark:bg-[#B69A61] hover:bg-[#174635] dark:hover:bg-[#CBB584] text-[#F7F5EF] dark:text-[#0A1B14] px-5 py-3 text-xs font-sans tracking-[0.14em] uppercase font-medium transition-colors shrink-0"
          >
            <span>View All 10 Services</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B69A61] dark:text-[#0A1B14]" />
          </Link>
        </div>

        {/* Asymmetric Composition: Large Feature (Left) + 3 Complementary Disciplines (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Large Editorial Focus: Dental Implants */}
          <div className="lg:col-span-7 bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] flex flex-col justify-between transition-colors">
            <div>
              {/* Service Imagery: Contained cleanly on dark background so the 323x507 procedural graphic is crisp and uncropped */}
              <div className="relative bg-[#103629] dark:bg-[#06120D] overflow-hidden border-b border-[#E4E0D6] dark:border-[#1E4234] flex items-center justify-center p-6 min-h-[340px]">
                <div className="relative max-w-[240px] sm:max-w-[260px] w-full aspect-[323/507] mx-auto drop-shadow-2xl">
                  <Image
                    src={spotlightService.image}
                    alt={spotlightService.alt}
                    width={323}
                    height={507}
                    className="w-full h-full object-contain filter contrast-[1.03]"
                  />
                </div>
                <div className="absolute top-4 left-4 bg-[#103629]/95 dark:bg-[#06120D]/95 text-[#F7F5EF] text-[10px] font-sans tracking-[0.18em] uppercase px-3 py-1 border border-[#B69A61]/40 backdrop-blur-sm">
                  Featured Specialty &bull; Service {spotlightService.number}
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between text-xs font-sans text-[#707873] dark:text-[#95A39B]">
                  <span className="text-[#B69A61] dark:text-[#CBB584] uppercase tracking-[0.18em] font-medium text-[11px]">
                    {spotlightService.category}
                  </span>
                  <span>Specialist Procedure</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl text-[#103629] dark:text-[#F7F5EF] font-normal">
                  {spotlightService.title}
                </h3>

                <p className="text-sm text-[#545C57] dark:text-[#CBD5CF] font-sans leading-relaxed font-light">
                  {spotlightService.fullDesc}
                </p>

                <div className="pt-4 border-t border-[#E4E0D6] dark:border-[#1E4234] space-y-2">
                  <span className="text-[11px] font-sans uppercase tracking-[0.18em] text-[#103629] dark:text-[#F7F5EF] font-semibold block">
                    Clinical Indications:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#545C57] dark:text-[#CBD5CF]">
                    {spotlightService.indications.map((ind, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B69A61] dark:bg-[#CBB584] shrink-0" />
                        <span>{ind}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-0 border-t border-[#E4E0D6] dark:border-[#1E4234] flex items-center justify-between">
              <span className="text-xs font-sans text-[#707873] dark:text-[#95A39B]">
                Evidence-Based Protocol
              </span>
              <Link
                href={`/services#${spotlightService.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-[0.14em] text-[#103629] dark:text-[#CBB584] font-semibold hover:text-[#B69A61] dark:hover:text-[#F7F5EF] transition-colors"
              >
                <span>Read Full Service Details</span>
                <ArrowUpRight className="w-4 h-4 text-[#B69A61] dark:text-[#CBB584]" />
              </Link>
            </div>
          </div>

          {/* Right Column: 3 Varied Editorial Rows with Procedure Thumbnails */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {featuredServices.map((service) => (
              <div
                key={service.id}
                className="p-5 sm:p-6 bg-[#EFECE3]/60 dark:bg-[#102B21]/60 border border-[#E4E0D6] dark:border-[#1E4234] flex flex-col justify-between group hover:border-[#B69A61] dark:hover:border-[#CBB584] transition-colors"
              >
                <div className="flex gap-4 items-start">
                  <div className="w-16 h-24 bg-[#103629] dark:bg-[#06120D] border border-[#B69A61]/30 p-1.5 shrink-0 overflow-hidden flex items-center justify-center">
                    <Image
                      src={service.image}
                      alt={service.alt}
                      width={323}
                      height={517}
                      className="w-full h-full object-contain filter contrast-[1.05]"
                    />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-lg text-[#B69A61] dark:text-[#CBB584] font-light">
                        {service.number}
                      </span>
                      <span className="text-[10px] font-sans uppercase tracking-[0.18em] text-[#707873] dark:text-[#95A39B]">
                        {service.category}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl text-[#103629] dark:text-[#F7F5EF] font-normal group-hover:text-[#174635] dark:group-hover:text-[#CBB584] transition-colors">
                      {service.title}
                    </h3>

                    <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] font-sans font-light leading-relaxed line-clamp-2">
                      {service.shortDesc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E4E0D6] dark:border-[#1E4234] mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-[#707873] dark:text-[#95A39B] font-sans">
                    Consultation &bull; Procedure
                  </span>
                  <Link
                    href={`/services#${service.id}`}
                    className="inline-flex items-center gap-1 text-xs font-sans uppercase tracking-[0.14em] text-[#103629] dark:text-[#CBB584] font-medium group-hover:text-[#B69A61] dark:group-hover:text-[#F7F5EF] transition-colors"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. THE CLINICAL TEAM — Led by Dr Vishal Lohana
      ────────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#E4E0D6] dark:border-[#1E4234]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 pb-6 border-b border-[#E4E0D6] dark:border-[#1E4234]">
          <div>
            <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#B69A61] dark:text-[#CBB584] font-semibold block mb-2">
              Clinical Team
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#103629] dark:text-[#F7F5EF] font-normal tracking-[-0.01em]">
              The Clinical Faculty
            </h2>
            <p className="text-sm text-[#545C57] dark:text-[#CBD5CF] font-sans mt-2 max-w-xl font-light">
              Led by Dr Vishal Lohana and his team, bringing specialized qualifications and dedicated auxiliary support to each procedure.
            </p>
          </div>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.16em] text-[#103629] dark:text-[#CBB584] font-semibold hover:text-[#B69A61] dark:hover:text-[#F7F5EF] transition-colors shrink-0"
          >
            <span>Read Faculty Biographies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Lead Clinicians: Two Distinctive Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          
          {/* Dr Vishal Lohana */}
          <div className="bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 transition-colors">
            <div className="sm:w-48 aspect-[3/4] bg-[#202622] overflow-hidden shrink-0 border border-[#E4E0D6] dark:border-[#1E4234]">
              <Image
                src={drVishal.image}
                alt={drVishal.alt}
                width={192}
                height={256}
                className="w-full h-full object-cover object-top filter brightness-[0.98]"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#B69A61] dark:text-[#CBB584] font-semibold block">
                  Lead Consultant &bull; Founder
                </span>
                <h3 className="font-serif text-2xl text-[#103629] dark:text-[#F7F5EF] font-normal">
                  {drVishal.name}
                </h3>
                <p className="text-xs font-sans text-[#707873] dark:text-[#95A39B] font-medium tracking-wide">
                  {drVishal.credentials}
                </p>
                <p className="text-xs sm:text-sm text-[#545C57] dark:text-[#CBD5CF] font-sans font-light leading-relaxed pt-2">
                  {drVishal.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E4E0D6] dark:border-[#1E4234] mt-4">
                <span className="text-[10px] font-sans uppercase tracking-[0.16em] text-[#707873] dark:text-[#95A39B] block mb-1">
                  Primary Surgical Scope:
                </span>
                <p className="text-xs text-[#103629] dark:text-[#CBB584] font-medium">
                  {drVishal.specialties[0]}
                </p>
              </div>
            </div>
          </div>

          {/* Dr Jotika */}
          <div className="bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 transition-colors">
            <div className="sm:w-48 aspect-[3/4] bg-[#202622] overflow-hidden shrink-0 border border-[#E4E0D6] dark:border-[#1E4234]">
              <Image
                src={drJotika.image}
                alt={drJotika.alt}
                width={192}
                height={256}
                className="w-full h-full object-cover object-top filter brightness-[0.98]"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#B69A61] dark:text-[#CBB584] font-semibold block">
                  Female Dental Surgeon
                </span>
                <h3 className="font-serif text-2xl text-[#103629] dark:text-[#F7F5EF] font-normal">
                  {drJotika.name}
                </h3>
                <p className="text-xs font-sans text-[#707873] dark:text-[#95A39B] font-medium tracking-wide">
                  {drJotika.credentials}
                </p>
                <p className="text-xs sm:text-sm text-[#545C57] dark:text-[#CBD5CF] font-sans font-light leading-relaxed pt-2">
                  {drJotika.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E4E0D6] dark:border-[#1E4234] mt-4">
                <span className="text-[10px] font-sans uppercase tracking-[0.16em] text-[#707873] dark:text-[#95A39B] block mb-1">
                  Primary Restorative Scope:
                </span>
                <p className="text-xs text-[#103629] dark:text-[#CBB584] font-medium">
                  {drJotika.specialties[0]}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Auxiliary Support Staff */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {auxiliaryStaff.map((staff) => (
            <div
              key={staff.id}
              className="p-5 bg-[#EFECE3]/50 dark:bg-[#102B21]/50 border border-[#E4E0D6] dark:border-[#1E4234] flex items-center gap-4 transition-colors"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-[#E4E0D6] dark:border-[#1E4234] bg-[#202622]">
                <Image
                  src={staff.image}
                  alt={staff.alt}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h3 className="font-serif text-lg text-[#103629] dark:text-[#F7F5EF] font-normal">
                  {staff.name}
                </h3>
                <p className="text-xs font-sans text-[#B69A61] dark:text-[#CBB584] font-medium">
                  {staff.credentials} &bull; {staff.role}
                </p>
                <p className="text-xs text-[#707873] dark:text-[#95A39B] font-sans mt-0.5">
                  {staff.specialties[0]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4.5 OPERATIVE SUITE & STERILIZATION WALKTHROUGH — Authentic Video
      ────────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#E4E0D6] dark:border-[#1E4234]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-5">
            <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#B69A61] dark:text-[#CBB584] font-semibold block">
              Facility &bull; Operative Theater
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#103629] dark:text-[#F7F5EF] font-normal leading-tight">
              Hospital-Grade Operative Standards in Saddar, Hyderabad
            </h2>
            <div className="w-12 h-[1px] bg-[#B69A61] dark:bg-[#CBB584]" />
            <p className="text-sm text-[#545C57] dark:text-[#CBD5CF] font-sans leading-relaxed font-light">
              Experience the sterilized operative suite where Dr. Vishal Lohana and the surgical team conduct maxillofacial trauma reconstructions, open reduction and internal fixation, cyst enucleations, and immediate implant loading.
            </p>
            <ul className="space-y-2 text-xs font-sans text-[#545C57] dark:text-[#CBD5CF] pt-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B69A61] dark:bg-[#CBB584]" />
                <span>Class-B multi-vacuum autoclave sterilization cycles</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B69A61] dark:bg-[#CBB584]" />
                <span>Precision surgical trays &amp; fiber-optic handpieces</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B69A61] dark:bg-[#CBB584]" />
                <span>Continuous digital patient monitoring &amp; emergency oxygen line</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7">
            <VideoPlayer video={CLINIC_VIDEOS[0]} />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. CLINICAL CASES PREVIEW — Dignified Photography
      ────────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#E4E0D6] dark:border-[#1E4234]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 pb-6 border-b border-[#E4E0D6] dark:border-[#1E4234]">
          <div>
            <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#B69A61] dark:text-[#CBB584] font-semibold block mb-2">
              Surgical Documentation
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#103629] dark:text-[#F7F5EF] font-normal tracking-[-0.01em]">
              Clinical Cases
            </h2>
            <p className="text-sm text-[#545C57] dark:text-[#CBD5CF] font-sans mt-2 max-w-xl font-light">
              Real intraoperative records and radiographic imaging from procedures conducted at BMK Clinic.
            </p>
          </div>
          <Link
            href="/client-work"
            className="inline-flex items-center gap-2 bg-[#103629] dark:bg-[#B69A61] hover:bg-[#174635] dark:hover:bg-[#CBB584] text-[#F7F5EF] dark:text-[#0A1B14] px-5 py-3 text-xs font-sans tracking-[0.14em] uppercase font-medium transition-colors shrink-0"
          >
            <span>View All 10 Clinical Cases</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B69A61] dark:text-[#0A1B14]" />
          </Link>
        </div>

        {/* Asymmetric Case Spread: 1 Primary Case (Left) + 3 Secondary Cases (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Primary Case Feature */}
          <div className="lg:col-span-7 bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] flex flex-col justify-between transition-colors">
            <div>
              <div className="relative aspect-[16/11] bg-[#202622] overflow-hidden border-b border-[#E4E0D6] dark:border-[#1E4234]">
                <Image
                  src={primaryCase.image}
                  alt={primaryCase.alt}
                  width={784}
                  height={539}
                  className="w-full h-full object-cover filter brightness-[0.98]"
                />
                <div className="absolute top-4 left-4 bg-[#103629]/90 dark:bg-[#06120D]/90 text-[#F7F5EF] text-[10px] font-sans tracking-[0.18em] uppercase px-3 py-1 border border-[#B69A61]/30">
                  Documented Case &bull; {primaryCase.category}
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between text-xs font-sans text-[#707873] dark:text-[#95A39B]">
                  <span>Modality: {primaryCase.modality}</span>
                  <span className="text-[#B69A61] dark:text-[#CBB584] font-medium">{primaryCase.diagnosticMethod}</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl text-[#103629] dark:text-[#F7F5EF] font-normal">
                  {primaryCase.title}
                </h3>

                <p className="text-sm text-[#545C57] dark:text-[#CBD5CF] font-sans leading-relaxed font-light">
                  {primaryCase.clinicalSummary}
                </p>

                <p className="text-xs text-[#707873] dark:text-[#95A39B] font-sans italic border-l-2 border-[#B69A61] dark:border-[#CBB584] pl-3">
                  {primaryCase.procedureNotes}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-0 border-t border-[#E4E0D6] dark:border-[#1E4234] flex items-center justify-between">
              <span className="text-xs font-sans text-[#707873] dark:text-[#95A39B]">
                Anatomical Reconstruction
              </span>
              <Link
                href="/client-work"
                className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-[0.14em] text-[#103629] dark:text-[#CBB584] font-semibold hover:text-[#B69A61] dark:hover:text-[#F7F5EF] transition-colors"
              >
                <span>Inspect All Case Records</span>
                <ArrowUpRight className="w-4 h-4 text-[#B69A61] dark:text-[#CBB584]" />
              </Link>
            </div>
          </div>

          {/* Secondary Cases Stack */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {secondaryCases.map((c) => (
              <div
                key={c.id}
                className="p-5 bg-[#EFECE3]/60 dark:bg-[#102B21]/60 border border-[#E4E0D6] dark:border-[#1E4234] flex flex-col sm:flex-row gap-5 group hover:border-[#B69A61] dark:hover:border-[#CBB584] transition-colors"
              >
                <div className="sm:w-36 aspect-square bg-[#202622] shrink-0 overflow-hidden border border-[#E4E0D6] dark:border-[#1E4234]">
                  <Image
                    src={c.image}
                    alt={c.alt}
                    width={144}
                    height={144}
                    className="w-full h-full object-cover filter brightness-[0.98]"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-sans uppercase tracking-[0.18em] text-[#B69A61] dark:text-[#CBB584] font-medium block">
                      {c.category}
                    </span>
                    <h3 className="font-serif text-lg text-[#103629] dark:text-[#F7F5EF] font-normal group-hover:text-[#174635] dark:group-hover:text-[#CBB584] transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] font-sans font-light line-clamp-2">
                      {c.clinicalSummary}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#E4E0D6] dark:border-[#1E4234] mt-3 flex items-center justify-between text-xs font-sans">
                    <span className="text-[11px] text-[#707873] dark:text-[#95A39B]">{c.modality}</span>
                    <Link
                      href="/client-work"
                      className="text-[#103629] dark:text-[#CBB584] font-medium hover:text-[#B69A61] dark:hover:text-[#F7F5EF] inline-flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. APPOINTMENT CALL TO ACTION — Decisive & Restrained
      ────────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#103629] dark:bg-[#06120D] text-[#F7F5EF] p-8 sm:p-12 lg:p-16 border border-[#174635] dark:border-[#1E4234] relative overflow-hidden transition-colors">
          <div className="max-w-2xl space-y-6">
            <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#B69A61] dark:text-[#CBB584] font-semibold block">
              Consultation &bull; Direct Triage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-[#F7F5EF]">
              Schedule your clinical consultation.
            </h2>
            <div className="w-12 h-[1.5px] bg-[#B69A61] dark:bg-[#CBB584]" />
            <p className="text-sm sm:text-base text-ivory-200 dark:text-[#CBD5CF] font-sans font-light leading-relaxed">
              Submitting an appointment request allows our clinical team to review your case and contact you directly via telephone to confirm availability and schedule your visit.
            </p>

            {/* Clinic Details Box */}
            <div className="p-5 bg-[#0A241B]/70 dark:bg-[#0F261D]/90 border border-[#174635] dark:border-[#1E4234] text-xs font-sans space-y-3 text-ivory-300 dark:text-[#CBD5CF]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B69A61] dark:text-[#CBB584] shrink-0 mt-0.5" />
                <span>{CLINIC_INFO.address}</span>
              </div>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 pt-1 text-ivory-200 dark:text-[#EFECE3]">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#B69A61] dark:text-[#CBB584]" />
                  <span>Mon–Sat: 4:00 PM – 10:00 PM &bull; Sun: Closed</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-[#B69A61] dark:text-[#CBB584]" />
                  <span>Call:</span>
                  <a href={CLINIC_INFO.phoneTel} className="underline hover:text-[#B69A61] dark:hover:text-[#CBB584]">
                    {CLINIC_INFO.phoneDisplay}
                  </a>
                  <span>/</span>
                  <a href={CLINIC_INFO.secondaryPhoneTel} className="underline hover:text-[#B69A61] dark:hover:text-[#CBB584]">
                    {CLINIC_INFO.secondaryPhoneDisplay}
                  </a>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>WhatsApp:</span>
                  <a
                    href={CLINIC_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-[#B69A61] dark:hover:text-[#CBB584]"
                  >
                    {CLINIC_INFO.phoneDisplay}
                  </a>
                  <span>/</span>
                  <a
                    href={CLINIC_INFO.secondaryWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-[#B69A61] dark:hover:text-[#CBB584]"
                  >
                    {CLINIC_INFO.secondaryPhoneDisplay}
                  </a>
                </div>
              </div>

              {/* Social Channels in Contact Plaque */}
              <div className="pt-2 border-t border-[#174635] flex items-center gap-3 text-[11px] font-mono">
                <span className="text-ivory-400">Social:</span>
                <a
                  href={CLINIC_INFO.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ivory-100 transition-colors inline-flex items-center gap-1.5 text-[#B69A61]"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                  <span>Facebook</span>
                </a>
                <span className="text-ivory-400/50">&bull;</span>
                <a
                  href={CLINIC_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ivory-100 transition-colors inline-flex items-center gap-1.5 text-[#B69A61]"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <Link
                href="/appointment"
                className="inline-flex items-center justify-center gap-2 bg-[#B69A61] hover:bg-[#CBB584] text-[#103629] px-8 py-4 text-xs font-sans tracking-[0.16em] uppercase font-semibold transition-all shadow-sm"
              >
                <span>Request an Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-[#0A241B] text-[#F7F5EF] px-6 py-4 text-xs font-sans tracking-[0.16em] uppercase font-medium border border-ivory-200/20 transition-colors"
              >
                <span>About Dr Vishal &amp; Team</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
