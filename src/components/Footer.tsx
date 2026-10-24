import Link from "next/link";
import Image from "next/image";
import { CLINIC_INFO } from "@/data/mediaManifest";
import { ShieldAlert, ArrowRight, Clock, MapPin, Phone } from "lucide-react";
import { WhatsAppIcon, FacebookIcon, InstagramIcon } from "@/components/BrandIcons";

export default function Footer() {
  return (
    <footer className="bg-[#103629] dark:bg-[#071510] text-[#F7F5EF] border-t border-[#174635] dark:border-[#133024] pt-16 pb-12 font-sans transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Urgent Triage / Priority Care Banner */}
        <div className="bg-[#0A241B] dark:bg-[#06120D] border border-[#174635] dark:border-[#133024] p-6 sm:p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-start gap-4 md:col-span-2">
              <div className="p-3 bg-[#B69A61]/10 text-[#B69A61] border border-[#B69A61]/20 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-lg text-ivory-50 tracking-wide font-normal">
                  Maxillofacial Trauma &amp; Urgent Surgical Consultations
                </h4>
                <p className="text-xs text-ivory-300 mt-1.5 leading-relaxed font-light max-w-2xl">
                  {CLINIC_INFO.emergencyNote} During clinic operating hours (Monday – Saturday: 4:00 PM – 10:00 PM), acute mandibulofacial injuries, severe dental infections, and urgent clinical evaluations receive priority attention.
                </p>
              </div>
            </div>
            <div className="flex md:justify-end gap-3 flex-wrap">
              <a
                href={CLINIC_INFO.phoneTel}
                className="inline-flex items-center gap-2 bg-[#F7F5EF]/10 hover:bg-[#F7F5EF]/20 text-[#F7F5EF] px-4 py-3 text-xs font-sans uppercase tracking-[0.14em] transition-colors border border-ivory-100/20"
              >
                <Phone className="w-3.5 h-3.5 text-[#B69A61]" />
                <span>Call {CLINIC_INFO.phoneDisplay}</span>
              </a>
              <Link
                href="/appointment"
                className="inline-flex items-center gap-2 bg-[#B69A61] hover:bg-[#CBB584] text-[#103629] px-5 py-3 text-xs font-sans font-semibold uppercase tracking-[0.14em] transition-colors"
              >
                <span>Request Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Column Editorial Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Col 1: Clinic Identity & Lead */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-sm overflow-hidden border border-[#174635] bg-[#202622] shrink-0 shadow-sm relative">
                <Image
                  src="/media/logo.jpeg"
                  alt="BMK Clinic Logo"
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-serif text-2xl tracking-[-0.01em] text-ivory-50 block font-normal leading-tight">
                {CLINIC_INFO.name}
              </span>
            </div>
            <p className="text-[11px] text-[#B69A61] tracking-[0.18em] uppercase font-sans font-medium">
              Led by {CLINIC_INFO.leadSurgeon}
            </p>
            <p className="text-xs text-ivory-300 leading-relaxed font-light pt-1">
              An evidence-based center for complex oral &amp; maxillofacial surgery, specialized micro-endodontics, aesthetic prosthetics, and osseointegrated dental implantology.
            </p>
            <div className="pt-2 text-[11px] text-ivory-400 font-sans space-y-1">
              <p>&bull; Specialist Registry: FCPS Certified</p>
              <p>&bull; Class-B Hospital-Grade Sterilization</p>
            </div>
          </div>

          {/* Col 2: Clinical Services */}
          <div>
            <h5 className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#B69A61] mb-4 pb-2 border-b border-[#174635] font-semibold">
              Specialized Services
            </h5>
            <ul className="space-y-2.5 text-xs text-ivory-300 font-light">
              <li>
                <Link href="/services#root-canals-hot-tooth" className="hover:text-[#B69A61] transition-colors">
                  Root Canals for Hot Tooth
                </Link>
              </li>
              <li>
                <Link href="/services#crowns" className="hover:text-[#B69A61] transition-colors">
                  Crowns &amp; Restorative Prosthetics
                </Link>
              </li>
              <li>
                <Link href="/services#scaling-polishing" className="hover:text-[#B69A61] transition-colors">
                  Teeth Scaling &amp; Polishing
                </Link>
              </li>
              <li>
                <Link href="/services#extractions" className="hover:text-[#B69A61] transition-colors">
                  Surgical &amp; Routine Extractions
                </Link>
              </li>
              <li>
                <Link href="/services#impacted-tooth-removal" className="hover:text-[#B69A61] transition-colors">
                  Impacted Wisdom Tooth Removal
                </Link>
              </li>
              <li>
                <Link href="/services#jaw-cysts-tumours" className="hover:text-[#B69A61] transition-colors">
                  Removal of Jaw Cysts &amp; Tumours
                </Link>
              </li>
              <li>
                <Link href="/services#jaw-fractures" className="hover:text-[#B69A61] transition-colors">
                  Jaw Fracture Treatment (ORIF)
                </Link>
              </li>
              <li>
                <Link href="/services#orthognathic-surgeries" className="hover:text-[#B69A61] transition-colors">
                  Orthognathic Surgeries
                </Link>
              </li>
              <li>
                <Link href="/services#tmj-surgeries" className="hover:text-[#B69A61] transition-colors">
                  TMJ Surgeries &amp; Joint Therapeutics
                </Link>
              </li>
              <li>
                <Link href="/services#dental-implants" className="hover:text-[#B69A61] transition-colors">
                  Dental Implants (Immediate &amp; Delayed)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Clinical Navigation */}
          <div>
            <h5 className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#B69A61] mb-4 pb-2 border-b border-[#174635] font-semibold">
              Practice Navigation
            </h5>
            <ul className="space-y-2.5 text-xs text-ivory-300 font-light">
              <li>
                <Link href="/" className="hover:text-[#B69A61] transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#B69A61] transition-colors">
                  The Clinic &amp; Team (Faculty Biographies)
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#B69A61] transition-colors">
                  Specialized Services (All 10 Disciplines)
                </Link>
              </li>
              <li>
                <Link href="/client-work" className="hover:text-[#B69A61] transition-colors">
                  Clinical Cases (10 Documented Records)
                </Link>
              </li>
              <li>
                <Link href="/appointment" className="hover:text-[#B69A61] transition-colors">
                  Book an Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Practice Hours & Contact */}
          <div className="space-y-3.5">
            <h5 className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#B69A61] mb-4 pb-2 border-b border-[#174635] font-semibold">
              Practice Hours &amp; Location
            </h5>
            <div className="flex items-start gap-2.5 text-xs text-ivory-300 font-light">
              <Clock className="w-4 h-4 text-[#B69A61] shrink-0 mt-0.5" />
              <span>{CLINIC_INFO.hours}</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-ivory-300 font-light">
              <MapPin className="w-4 h-4 text-[#B69A61] shrink-0 mt-0.5" />
              <span className="leading-relaxed">{CLINIC_INFO.address}</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-ivory-300 font-light">
              <Phone className="w-4 h-4 text-[#B69A61] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div>
                  <span className="text-ivory-400">Tel 1: </span>
                  <a
                    href={CLINIC_INFO.phoneTel}
                    className="hover:text-[#B69A61] text-[#F7F5EF] underline decoration-[#174635] underline-offset-2 transition-colors font-medium font-mono"
                  >
                    {CLINIC_INFO.phoneDisplay}
                  </a>
                </div>
                <div>
                  <span className="text-ivory-400">Tel 2: </span>
                  <a
                    href={CLINIC_INFO.secondaryPhoneTel}
                    className="hover:text-[#B69A61] text-[#F7F5EF] underline decoration-[#174635] underline-offset-2 transition-colors font-medium font-mono"
                  >
                    {CLINIC_INFO.secondaryPhoneDisplay}
                  </a>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-ivory-300 font-light">
              <WhatsAppIcon className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div>
                  <span className="text-ivory-400">WhatsApp 1: </span>
                  <a
                    href={CLINIC_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#B69A61] text-[#F7F5EF] underline decoration-[#174635] underline-offset-2 transition-colors font-medium font-mono"
                  >
                    {CLINIC_INFO.phoneDisplay}
                  </a>
                </div>
                <div>
                  <span className="text-ivory-400">WhatsApp 2: </span>
                  <a
                    href={CLINIC_INFO.secondaryWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#B69A61] text-[#F7F5EF] underline decoration-[#174635] underline-offset-2 transition-colors font-medium font-mono"
                  >
                    {CLINIC_INFO.secondaryPhoneDisplay}
                  </a>
                </div>
              </div>
            </div>

            {/* Official Social Media Links */}
            <div className="pt-2">
              <span className="text-[10px] text-[#B69A61] block uppercase tracking-[0.18em] font-semibold mb-2">
                Official Social Media
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={CLINIC_INFO.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0A241B] hover:bg-[#143026] text-[#F7F5EF] hover:text-[#B69A61] border border-[#174635] text-xs font-sans transition-colors rounded-xs shadow-xs"
                  aria-label="BMK Dental Clinic on Facebook (opens in a new tab)"
                >
                  <FacebookIcon className="w-4 h-4" />
                  <span>Facebook</span>
                </a>
                <a
                  href={CLINIC_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0A241B] hover:bg-[#143026] text-[#F7F5EF] hover:text-[#B69A61] border border-[#174635] text-xs font-sans transition-colors rounded-xs shadow-xs"
                  aria-label="BMK Dental Clinic on Instagram (opens in a new tab)"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[10px] text-ivory-400 block uppercase tracking-[0.16em]">
                Consultation Oversight:
              </span>
              <p className="text-[11px] text-ivory-300 mt-1 leading-normal italic font-light">
                Dr Vishal Lohana and his team personally oversee all clinical assessments and consultation reviews.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Footer */}
        <div className="pt-8 border-t border-[#174635] flex flex-col md:flex-row items-center justify-between text-[11px] text-ivory-400 font-sans gap-4">
          <p>
            &copy; {new Date().getFullYear()} {CLINIC_INFO.name}. All clinical photography and radiographic case files are protected clinic records.
          </p>
          <div className="flex items-center gap-6">
            <a
              href={CLINIC_INFO.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ivory-300 hover:text-[#B69A61] transition-colors inline-flex items-center gap-1.5"
            >
              <FacebookIcon className="w-3.5 h-3.5" />
              <span>Facebook</span>
            </a>
            <span className="text-[#174635]">&bull;</span>
            <a
              href={CLINIC_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ivory-300 hover:text-[#B69A61] transition-colors inline-flex items-center gap-1.5"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </a>
            <span className="text-[#174635]">&bull;</span>
            <span className="text-ivory-300">Head of Clinic: {CLINIC_INFO.leadSurgeon}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
