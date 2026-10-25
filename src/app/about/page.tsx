import { CLINIC_VIDEOS, CLINIC_INFO } from "@/data/mediaManifest";
import { getPublicStaff, getPublicSiteSettings } from "@/lib/data/clinic-data";
import VideoPlayer from "@/components/VideoPlayer";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  ShieldCheck,
  Microscope,
  Building2,
  MapPin,
  Phone,
  Clock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { WhatsAppIcon, FacebookIcon, InstagramIcon } from "@/components/BrandIcons";

export const metadata = {
  title: "About the Clinic & Surgical Faculty",
  description:
    "Learn about BMK Dental & Maxillofacial Clinic, led by Dr Vishal Lohana (FCPS, BDS), Dr Jotika (BDS, RDS), and our auxiliary surgical staff in Saddar, Hyderabad.",
  alternates: {
    canonical: "/about",
  },
};

export const revalidate = 60;

export default async function AboutPage() {
  const [clinicTeam, clinicSettings] = await Promise.all([
    getPublicStaff(),
    getPublicSiteSettings(),
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

  return (
    <div className="space-y-24 md:space-y-36 pb-24">
      {/* 1. EDITORIAL HEADER SECTION */}
      <section className="pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end border-b border-[#E4E0D6] dark:border-[#1E4234] pb-12">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] text-[#103629] dark:text-[#F7F5EF] text-xs font-mono tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B69A61]" />
              <span>Institutional Standard &bull; Hyderabad, Pakistan</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#103629] dark:text-[#F7F5EF] font-normal tracking-tight leading-[1.08]">
              Clinical Rigor, Surgical Precision &amp; Dedicated Patient Care
            </h1>
            <p className="text-base sm:text-lg text-[#545C57] dark:text-[#CBD5CF] font-sans leading-relaxed font-light max-w-3xl pt-2">
              BMK Dental &amp; Maxillofacial Clinic was founded by Dr Vishal Lohana (FCPS, BDS) to bring hospital-grade surgical theater standards and specialized restorative dental medicine together under a single unified center in Saddar, Hyderabad.
            </p>
          </div>

          {/* Quick Clinic Coordinates Plaque */}
          <div className="lg:col-span-4 bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] p-6 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B69A61] dark:text-[#CBB584] block font-semibold">
              Clinic Location &amp; Inquiries
            </span>
            <div className="flex items-start gap-2.5 text-xs text-[#545C57] dark:text-[#CBD5CF]">
              <MapPin className="w-4 h-4 text-[#103629] dark:text-[#B69A61] shrink-0 mt-0.5" />
              <span className="leading-relaxed">{CLINIC_INFO.address}</span>
            </div>
            <div className="pt-2 border-t border-[#E4E0D6] dark:border-[#1E4234] space-y-2 text-xs font-mono">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[#707873] dark:text-[#A8B2AC]">Call:</span>
                <a
                  href={CLINIC_INFO.phoneTel}
                  className="text-[#103629] dark:text-[#F7F5EF] hover:text-[#B69A61] dark:hover:text-[#CBB584] font-semibold transition-colors"
                >
                  {CLINIC_INFO.phoneDisplay}
                </a>
                <span>/</span>
                <a
                  href={CLINIC_INFO.secondaryPhoneTel}
                  className="text-[#103629] dark:text-[#F7F5EF] hover:text-[#B69A61] dark:hover:text-[#CBB584] font-semibold transition-colors"
                >
                  {CLINIC_INFO.secondaryPhoneDisplay}
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>WhatsApp:</span>
                </span>
                <a
                  href={CLINIC_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#103629] dark:text-[#F7F5EF] hover:text-[#B69A61] dark:hover:text-[#CBB584] underline transition-colors"
                >
                  {CLINIC_INFO.phoneDisplay}
                </a>
                <span>/</span>
                <a
                  href={CLINIC_INFO.secondaryWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#103629] dark:text-[#F7F5EF] hover:text-[#B69A61] dark:hover:text-[#CBB584] underline transition-colors"
                >
                  {CLINIC_INFO.secondaryPhoneDisplay}
                </a>
              </div>
              <div className="pt-1 flex items-center gap-3 text-[11px] text-[#B69A61] dark:text-[#CBB584]">
                <span>Social:</span>
                <a
                  href={CLINIC_INFO.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline transition-colors inline-flex items-center gap-1.5"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                  <span>Facebook</span>
                </a>
                <span>&bull;</span>
                <a
                  href={CLINIC_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline transition-colors inline-flex items-center gap-1.5"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SURGICAL DIRECTORS BIOGRAPHIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Dr. Vishal Lohana Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pb-20 border-b border-[#E4E0D6] dark:border-[#1E4234]">
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-2.5 border border-[#103629]/15 dark:border-[#CBB584]/20 pointer-events-none" />
              <div className="relative bg-forest-950 border border-forest-950/20 overflow-hidden shadow-lg">
                <Image
                  src={drVishal.image}
                  alt={drVishal.alt}
                  width={480}
                  height={520}
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="w-full h-[520px] object-cover object-top filter brightness-[0.98]"
                />
                <div className="p-5 bg-forest-950 text-ivory-100 border-t border-forest-900">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-400 block mb-1">
                    Head of Clinic &amp; Consultant Surgeon
                  </span>
                  <p className="font-serif text-2xl text-ivory-50">Dr Vishal Lohana</p>
                  <p className="text-xs font-mono text-ivory-300 mt-0.5">
                    FCPS (Oral &amp; Maxillofacial Surgery), BDS
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#B69A61] dark:text-[#CBB584] font-semibold block mb-2">
                Consultant Maxillofacial Profile
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#103629] dark:text-[#F7F5EF] font-normal">
                Dr. Vishal Lohana
              </h2>
              <p className="text-xs font-mono text-[#707873] dark:text-[#A8B2AC] uppercase tracking-wider mt-1">
                FCPS (Oral &amp; Maxillofacial Surgery) &bull; BDS
              </p>
            </div>

            <p className="text-sm sm:text-base text-[#545C57] dark:text-[#CBD5CF] leading-relaxed font-sans font-light">
              As a Fellow of the College of Physicians and Surgeons (FCPS), Dr Vishal Lohana manages high-complexity surgical pathology across the oral cavity, mandible, maxilla, and neck. His surgical scope includes open reduction and rigid titanium internal fixation of facial fractures, selective neck dissection for oral cavity squamous cell carcinoma, cyst enucleations, and immediate functional dental implant loading.
            </p>

            <p className="text-sm sm:text-base text-[#545C57] dark:text-[#CBD5CF] leading-relaxed font-sans font-light">
              Dr. Lohana emphasizes anatomical precision, tissue conservation, and comprehensive pre-surgical 3D volumetric planning to achieve functional rehabilitation while minimizing surgical morbidity.
            </p>

            <div className="pt-4">
              <h3 className="font-serif text-base text-[#103629] dark:text-[#F7F5EF] font-medium mb-3">
                Primary Surgical Focus:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {drVishal.specialties.map((spec, i) => (
                  <div
                    key={i}
                    className="p-3 bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] text-xs font-sans text-[#202622] dark:text-[#CBD5CF] flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B69A61] shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dr. Jotika Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pb-20 border-b border-[#E4E0D6] dark:border-[#1E4234]">
          <div className="lg:col-span-5 lg:order-2">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-2.5 border border-[#103629]/15 dark:border-[#CBB584]/20 pointer-events-none" />
              <div className="relative bg-[#103629] border border-[#174635] overflow-hidden shadow-lg">
                <Image
                  src={drJotika.image}
                  alt={drJotika.alt}
                  width={480}
                  height={520}
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="w-full h-[520px] object-cover object-top filter brightness-[0.98]"
                />
                <div className="p-5 bg-[#103629] text-[#F7F5EF] border-t border-[#174635]">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#B69A61] dark:text-[#CBB584] block mb-1">
                    Female Dental Surgeon &amp; Aesthetic Specialist
                  </span>
                  <p className="font-serif text-2xl text-[#F7F5EF]">Dr. Jotika</p>
                  <p className="text-xs font-mono text-[#CBD5CF] mt-0.5">
                    BDS, RDS (Registered Dental Surgeon)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 lg:order-1 space-y-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#B69A61] dark:text-[#CBB584] font-semibold block mb-2">
                Restorative &amp; Aesthetic Profile
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#103629] dark:text-[#F7F5EF] font-normal">
                Dr. Jotika
              </h2>
              <p className="text-xs font-mono text-[#707873] dark:text-[#A8B2AC] uppercase tracking-wider mt-1">
                BDS, RDS &bull; Registered Dental Surgeon (Female Dentist)
              </p>
            </div>

            <p className="text-sm sm:text-base text-[#545C57] dark:text-[#CBD5CF] leading-relaxed font-sans font-light">
              Dr. Jotika directs restorative and cosmetic dentistry at BMK Clinic with particular expertise in wire-free clear aligner therapy, microscopic root canal therapy for irreversible pulpitis, ceramic crowns, aesthetic veneers, and gentle preventive care tailored for female patients and families.
            </p>

            <p className="text-sm sm:text-base text-[#545C57] dark:text-[#CBD5CF] leading-relaxed font-sans font-light">
              Her clinical methodology focuses on enamel conservation, gentle delivery of local anesthesia, and transparent communication that demystifies procedures for apprehensive patients.
            </p>

            <div className="pt-4">
              <h3 className="font-serif text-base text-[#103629] dark:text-[#F7F5EF] font-medium mb-3">
                Core Restorative Proficiencies:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {drJotika.specialties.map((spec, i) => (
                  <div
                    key={i}
                    className="p-3 bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] text-xs font-sans text-[#202622] dark:text-[#CBD5CF] flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B69A61] shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Auxiliary Surgical Staff Roster */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#B69A61] dark:text-[#CBB584] block mb-2 font-semibold">
              Auxiliary Surgical Support
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#103629] dark:text-[#F7F5EF] font-normal">
              Technical &amp; Clinical Dental Staff
            </h2>
            <p className="text-xs sm:text-sm text-[#545C57] dark:text-[#CBD5CF] font-sans mt-2">
              Surgical success requires rigorous theater sterilization, precise prosthetic model fabrication, and meticulous dental hygiene protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {auxiliaryStaff.map((staff) => (
              <div
                key={staff.id}
                className="bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] overflow-hidden flex flex-col sm:flex-row group transition-colors"
              >
                <div className="sm:w-48 aspect-square sm:aspect-auto bg-[#103629] shrink-0 relative">
                  <Image
                    src={staff.image}
                    alt={staff.alt}
                    width={192}
                    height={192}
                    className="w-full h-full object-cover object-top filter brightness-[0.98]"
                  />
                  <div className="absolute top-2 left-2 bg-[#103629]/90 text-[#B69A61] dark:text-[#CBB584] text-[10px] font-mono px-2 py-0.5">
                    Auxiliary Staff
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-normal text-[#103629] dark:text-[#F7F5EF]">
                      {staff.name}
                    </h3>
                    <p className="text-xs font-mono text-[#B69A61] dark:text-[#CBB584] font-semibold mb-1">
                      {staff.credentials}
                    </p>
                    <p className="text-xs text-[#707873] dark:text-[#A8B2AC] font-sans mb-3">
                      {staff.role}
                    </p>
                    <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] font-sans leading-relaxed">
                      {staff.bio}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#E4E0D6] dark:border-[#1E4234] mt-4 text-[11px] text-[#103629] dark:text-[#F7F5EF] font-medium">
                    Primary Domain: {staff.specialties[0]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CLINICAL OPERATIVE VIDEOS SECTION */}
      <section id="video-tour" className="bg-forest-950 text-ivory-100 py-20 border-y border-forest-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-gold-400 block mb-2 font-semibold">
              Authentic Operative Suite Documentation
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ivory-50 font-normal">
              Operative Suite &amp; Surgical Workflow
            </h2>
            <p className="text-xs sm:text-sm text-ivory-300 font-sans mt-3 font-light leading-relaxed">
              Real clinical video documentation recorded inside BMK Clinic in Hyderabad. These records show actual operative suite preparation, instrument ergonomics, and thorough diagnostic patient consultation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {CLINIC_VIDEOS.map((video) => (
              <VideoPlayer key={video.id} video={video} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. STERILIZATION & SURGICAL INFRASTRUCTURE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#B69A61] dark:text-[#CBB584] block mb-2 font-semibold">
            Clinical Standards
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#103629] dark:text-[#F7F5EF] font-normal">
            Surgical &amp; Sterilization Infrastructure
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] space-y-4">
            <div className="p-3 bg-[#103629] text-[#B69A61] inline-block">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-[#103629] dark:text-[#F7F5EF] font-normal">
              Hospital-Grade Operative Suite
            </h3>
            <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] leading-relaxed font-sans">
              Equipped for both local and sedated oral surgical procedures including orthognathic osteotomies, complex impactions, and titanium mini-plate osteosynthesis.
            </p>
          </div>

          <div className="p-8 bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] space-y-4">
            <div className="p-3 bg-[#103629] text-[#B69A61] inline-block">
              <Microscope className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-[#103629] dark:text-[#F7F5EF] font-normal">
              3D CBCT Volumetric Radiology
            </h3>
            <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] leading-relaxed font-sans">
              Sub-millimeter volumetric CT reconstructions guarantee accurate measurement of alveolar crest width and inferior alveolar nerve canal trajectories prior to implant drilling.
            </p>
          </div>

          <div className="p-8 bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] space-y-4">
            <div className="p-3 bg-[#103629] text-[#B69A61] inline-block">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-[#103629] dark:text-[#F7F5EF] font-normal">
              Class-B Vacuum Sterilization
            </h3>
            <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] leading-relaxed font-sans">
              Fractionated vacuum autoclaving ensures sterile penetration into hollow instruments, handpieces, and surgical cassettes with biological spore testing validation.
            </p>
          </div>
        </div>
      </section>

      {/* 5. DIRECT CLINIC INQUIRY BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B69A61] dark:text-[#CBB584] block font-semibold">
              Consultation &amp; Surgical Evaluation
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#103629] dark:text-[#F7F5EF] font-normal">
              Schedule a Consultation with Dr Vishal Lohana and his team
            </h3>
            <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] font-sans max-w-xl">
              Clinic No: MF:32, Quaid-E-Azam Medical Complex, CMH Rd, Saddar, Hyderabad.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a
              href={CLINIC_INFO.phoneTel}
              className="inline-flex items-center gap-2 bg-[#FAF9F6] dark:bg-[#174635] hover:bg-[#EFECE3] dark:hover:bg-[#1E523F] text-[#103629] dark:text-[#F7F5EF] px-5 py-3 text-xs font-mono uppercase tracking-wider font-semibold border border-[#E4E0D6] dark:border-[#1E4234] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#B69A61]" />
              <span>{CLINIC_INFO.phoneDisplay}</span>
            </a>
            <Link
              href="/appointment"
              className="inline-flex items-center gap-2 bg-[#103629] hover:bg-[#174635] text-[#F7F5EF] px-6 py-3 text-xs font-sans uppercase tracking-widest font-semibold transition-colors"
            >
              <span>Book Appointment</span>
              <ArrowUpRight className="w-4 h-4 text-[#B69A61]" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

