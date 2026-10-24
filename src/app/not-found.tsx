import Link from "next/link";
import { ArrowLeft, Stethoscope } from "lucide-react";
import { CLINIC_INFO } from "@/data/mediaManifest";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-md w-full bg-ivory-100/90 border border-forest-950/15 p-8 sm:p-10 text-center space-y-6 shadow-sm">
        <div className="w-12 h-12 mx-auto rounded-full bg-forest-900 text-gold-400 flex items-center justify-center">
          <Stethoscope className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-600 block font-semibold">
            Error 404 &bull; Clinical Record Not Found
          </span>
          <h1 className="font-serif text-3xl text-forest-950 font-normal">
            Page Not Located
          </h1>
          <p className="text-xs text-charcoal-600 font-sans leading-relaxed pt-1">
            The requested page does not exist or has been relocated within the BMK Dental &amp; Maxillofacial Clinic system.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center text-xs font-sans">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 bg-forest-900 hover:bg-forest-800 text-ivory-50 px-5 py-3 uppercase tracking-wider font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/appointment"
            className="inline-flex items-center justify-center gap-1.5 bg-ivory-200 hover:bg-ivory-300 text-forest-950 px-5 py-3 uppercase tracking-wider font-semibold border border-forest-950/15 transition-colors"
          >
            <span>Book Consultation</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
