"use client";

import { useState } from "react";
import { Star, MessageSquareQuote, CheckCircle2, AlertCircle, Loader2, Sparkles, Plus } from "lucide-react";
import type { PatientReview } from "@/lib/data/clinic-data";
import { submitPublicReviewAction } from "@/app/actions/admin-reviews";

interface PatientReviewsSectionProps {
  initialReviews: PatientReview[];
}

export default function PatientReviewsSection({ initialReviews }: PatientReviewsSectionProps) {
  const [reviews] = useState<PatientReview[]>(initialReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [rating, setRating] = useState(5);
  const [treatmentType, setTreatmentType] = useState("");
  const [location, setLocation] = useState("Hyderabad");
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    try {
      const res = await submitPublicReviewAction({
        patient_name: patientName,
        rating,
        treatment_type: treatmentType || undefined,
        review_text: reviewText,
        location: location || "Hyderabad",
      });

      if (res.success) {
        setFeedback({ type: "success", message: res.message });
        setPatientName("");
        setTreatmentType("");
        setReviewText("");
        setRating(5);
        setTimeout(() => {
          setIsModalOpen(false);
          setFeedback(null);
        }, 3000);
      } else {
        setFeedback({ type: "error", message: res.message });
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err?.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#E4E0D6] dark:border-[#1E4234]">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-[#E4E0D6] dark:border-[#1E4234]">
        <div>
          <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#B69A61] dark:text-[#CBB584] font-semibold block mb-2">
            Patient Voices &bull; Clinical Experiences
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#103629] dark:text-[#F7F5EF] font-normal tracking-[-0.01em]">
            Verified Patient Testimonials
          </h2>
          <p className="text-sm text-[#545C57] dark:text-[#CBD5CF] font-sans max-w-2xl mt-2 font-light">
            Reflecting genuine experiences from patients treated at BMK Dental &amp; Maxillofacial Clinic for reconstructive trauma, implant surgery, root canal therapy, and smile rehabilitation.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#103629] dark:bg-[#B69A61] hover:bg-[#174635] dark:hover:bg-[#CBB584] text-[#F7F5EF] dark:text-[#0A1B14] px-5 py-3 text-xs font-sans tracking-[0.16em] uppercase font-medium transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[#B69A61] dark:text-[#0A1B14]" />
            <span>Share Your Experience</span>
          </button>
        </div>
      </div>

      {/* Reviews Grid / Empty State */}
      {reviews.length === 0 ? (
        <div className="p-8 sm:p-12 bg-[#EFECE3]/40 dark:bg-[#102B21]/40 border border-[#E4E0D6] dark:border-[#1E4234] text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-10 h-10 rounded-full bg-[#103629]/10 dark:bg-[#B69A61]/20 text-[#103629] dark:text-[#CBB584] flex items-center justify-center mx-auto">
            <MessageSquareQuote className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl text-[#103629] dark:text-[#F7F5EF] font-normal">
            Be the First to Share Your Clinical Experience
          </h3>
          <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] font-sans font-light leading-relaxed max-w-lg mx-auto">
            We value genuine feedback from our patients. If you have visited BMK Dental &amp; Maxillofacial Clinic for a consultation or procedure with Dr. Vishal Lohana or Dr. Jotika, share your experience to help other patients.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#103629] dark:bg-[#B69A61] hover:bg-[#174635] dark:hover:bg-[#CBB584] text-[#F7F5EF] dark:text-[#0A1B14] px-5 py-2.5 text-xs font-sans tracking-[0.14em] uppercase font-medium transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-[#B69A61] dark:text-[#0A1B14]" />
              <span>Submit a Review</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-[#EFECE3]/60 dark:bg-[#102B21]/60 border border-[#E4E0D6] dark:border-[#1E4234] flex flex-col justify-between hover:border-[#B69A61] dark:hover:border-[#CBB584] transition-colors"
            >
            <div className="space-y-3">
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-[#B69A61]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < rev.rating
                        ? "fill-[#B69A61] text-[#B69A61]"
                        : "text-[#E4E0D6] dark:text-[#1E4234]"
                    }`}
                  />
                ))}
              </div>

              {/* Treatment Badge */}
              {rev.treatment_type && (
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#103629] dark:text-[#CBB584] font-medium block">
                  {rev.treatment_type}
                </span>
              )}

              {/* Review Text */}
              <p className="text-xs text-[#545C57] dark:text-[#CBD5CF] font-sans font-light leading-relaxed italic">
                &ldquo;{rev.review_text}&rdquo;
              </p>
            </div>

            {/* Author Footer */}
            <div className="pt-4 border-t border-[#E4E0D6] dark:border-[#1E4234] mt-5 flex items-center justify-between text-xs">
              <span className="font-serif text-[#103629] dark:text-[#F7F5EF] font-medium">
                {rev.patient_name}
              </span>
              <span className="text-[11px] text-[#707873] dark:text-[#95A39B] font-sans">
                {rev.location || "Hyderabad"}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FAF9F6] dark:bg-[#0A1B14] border border-[#E4E0D6] dark:border-[#1E4234] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#E4E0D6] dark:border-[#1E4234] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B69A61] dark:text-[#CBB584] font-semibold block">
                  Public Feedback
                </span>
                <h3 className="font-serif text-2xl text-[#103629] dark:text-[#F7F5EF] font-normal">
                  Submit a Patient Review
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs font-mono text-[#707873] hover:text-[#103629] dark:hover:text-[#F7F5EF] p-1"
              >
                &times; Close
              </button>
            </div>

            {feedback && (
              <div
                className={`p-3 text-xs flex items-start gap-2 border ${
                  feedback.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                    : "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#103629] dark:text-[#F7F5EF] font-semibold">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Fatima Tariq"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#071510] border border-[#E4E0D6] dark:border-[#1E4234] text-xs text-[#103629] dark:text-[#F7F5EF] focus:outline-none focus:ring-1 focus:ring-[#B69A61]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#103629] dark:text-[#F7F5EF] font-semibold">
                    Rating <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#071510] border border-[#E4E0D6] dark:border-[#1E4234] text-xs text-[#103629] dark:text-[#F7F5EF] focus:outline-none focus:ring-1 focus:ring-[#B69A61]"
                  >
                    <option value={5}>5 Stars — Excellent</option>
                    <option value={4}>4 Stars — Very Good</option>
                    <option value={3}>3 Stars — Satisfactory</option>
                    <option value={2}>2 Stars — Needs Improvement</option>
                    <option value={1}>1 Star — Unsatisfactory</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#545C57] dark:text-[#CBD5CF] font-semibold">
                    Location / Area
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Saddar, Hyderabad"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#071510] border border-[#E4E0D6] dark:border-[#1E4234] text-xs text-[#103629] dark:text-[#F7F5EF] focus:outline-none focus:ring-1 focus:ring-[#B69A61]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#545C57] dark:text-[#CBD5CF] font-semibold">
                  Procedure / Treatment Received
                </label>
                <input
                  type="text"
                  value={treatmentType}
                  onChange={(e) => setTreatmentType(e.target.value)}
                  placeholder="e.g. Dental Implants, Wisdom Tooth Removal, Root Canal"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#071510] border border-[#E4E0D6] dark:border-[#1E4234] text-xs text-[#103629] dark:text-[#F7F5EF] focus:outline-none focus:ring-1 focus:ring-[#B69A61]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#103629] dark:text-[#F7F5EF] font-semibold">
                  Your Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Describe your consultation or treatment experience with Dr. Vishal Lohana, Dr. Jotika, or the clinic staff..."
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#071510] border border-[#E4E0D6] dark:border-[#1E4234] text-xs text-[#103629] dark:text-[#F7F5EF] focus:outline-none focus:ring-1 focus:ring-[#B69A61]"
                />
                <span className="text-[11px] text-[#707873] dark:text-[#A8B2AC] font-sans block">
                  Reviews are moderated by clinic administration to prevent promotional spam before appearing live.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-mono text-[#545C57] dark:text-[#CBD5CF] hover:text-[#103629] uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-[#103629] hover:bg-[#174635] text-[#F7F5EF] px-5 py-2.5 text-xs font-sans uppercase tracking-wider font-semibold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Review</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
