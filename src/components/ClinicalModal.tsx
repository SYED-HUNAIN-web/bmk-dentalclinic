"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ZoomIn, ZoomOut, Activity, FileText, CheckCircle2 } from "lucide-react";
import { ClientCase } from "@/data/mediaManifest";

interface ClinicalModalProps {
  clinicalCase: ClientCase | null;
  onClose: () => void;
}

export default function ClinicalModal({ clinicalCase, onClose }: ClinicalModalProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (clinicalCase) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [clinicalCase, onClose]);

  if (!clinicalCase) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-case-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0A1B14]/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF9F6] dark:bg-[#0F261D] border border-[#E4E0D6] dark:border-[#1E4234] max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4E0D6] dark:border-[#1E4234] bg-[#EFECE3] dark:bg-[#102B21]">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#B69A61] dark:text-[#CBB584] uppercase font-semibold">
              Clinical Case File &bull; {clinicalCase.category}
            </span>
            <h3 id="modal-case-title" className="font-serif text-xl sm:text-2xl text-[#103629] dark:text-[#F7F5EF] font-normal">
              {clinicalCase.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-[#707873] hover:text-[#103629] dark:text-[#CBD5CF] dark:hover:text-[#F7F5EF] hover:bg-[#E4E0D6] dark:hover:bg-[#1A3D30] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Image Container */}
          <div className="relative bg-[#071510] border border-[#E4E0D6] dark:border-[#1E4234] overflow-hidden flex items-center justify-center min-h-[280px] max-h-[460px]">
            <Image
              src={clinicalCase.image}
              alt={clinicalCase.alt}
              width={800}
              height={460}
              className={`object-contain w-full max-h-[460px] transition-transform duration-300 ${
                isZoomed ? "scale-150 cursor-zoom-out" : "scale-100 cursor-zoom-in"
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            />
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="absolute bottom-3 right-3 bg-[#0A1B14]/85 hover:bg-[#102B21] text-[#F7F5EF] p-2 text-xs font-mono rounded flex items-center gap-1.5 backdrop-blur-sm transition-colors border border-white/10"
              aria-label={isZoomed ? "Zoom out image" : "Zoom in image"}
            >
              {isZoomed ? <ZoomOut className="w-4 h-4 text-[#B69A61]" /> : <ZoomIn className="w-4 h-4 text-[#B69A61]" />}
              <span className="hidden sm:inline">{isZoomed ? "Reset View" : "Enlarge Image"}</span>
            </button>
          </div>

          {/* Clinical Case Analysis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#103629] dark:text-[#F7F5EF] font-serif text-base font-medium">
                <Activity className="w-4 h-4 text-[#B69A61]" />
                <h4>Clinical Summary</h4>
              </div>
              <p className="text-sm text-[#545C57] dark:text-[#CBD5CF] leading-relaxed font-sans font-light">
                {clinicalCase.clinicalSummary}
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-mono text-[#707873] dark:text-[#A8B2AC] uppercase tracking-wider block">
                  Diagnostic Modality
                </span>
                <span className="text-xs font-medium text-[#103629] dark:text-[#F7F5EF]">
                  {clinicalCase.diagnosticMethod}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#103629] dark:text-[#F7F5EF] font-serif text-base font-medium">
                <FileText className="w-4 h-4 text-[#B69A61]" />
                <h4>Surgical &amp; Restorative Procedure</h4>
              </div>
              <p className="text-sm text-[#545C57] dark:text-[#CBD5CF] leading-relaxed font-sans font-light">
                {clinicalCase.procedureNotes}
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-mono text-[#707873] dark:text-[#A8B2AC] uppercase tracking-wider block">
                  Technique Classification
                </span>
                <span className="text-xs font-medium text-[#103629] dark:text-[#F7F5EF]">
                  {clinicalCase.modality}
                </span>
              </div>
            </div>
          </div>

          {/* Ethical Medical Disclaimer */}
          <div className="bg-[#EFECE3] dark:bg-[#102B21] border border-[#E4E0D6] dark:border-[#1E4234] p-4 rounded-sm text-xs text-[#545C57] dark:text-[#CBD5CF] leading-relaxed font-sans">
            <p className="font-semibold text-[#103629] dark:text-[#F7F5EF] mb-0.5">Clinical Case Documentation Notice:</p>
            This clinical record reflects an authentic surgical procedure performed by Dr. Vishal Lohana and the surgical team at BMK Clinic. Individual physiological responses, healing intervals, and treatment pathways vary based on patient anatomy and systemic status.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E4E0D6] dark:border-[#1E4234] bg-[#EFECE3] dark:bg-[#102B21] flex justify-between items-center text-xs">
          <span className="text-[#707873] dark:text-[#A8B2AC] font-mono text-[11px]">
            BMK Maxillofacial &amp; Dental Case Archive
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#103629] hover:bg-[#174635] text-[#F7F5EF] text-xs font-medium uppercase tracking-wider transition-colors"
          >
            Close Case
          </button>
        </div>
      </div>
    </div>
  );
}
