export const metadata = {
  title: "Request a Consultation",
  description:
    "Submit a consultation request to BMK Dental & Maxillofacial Clinic in Saddar, Hyderabad. Review clinical schedules and request your preferred appointment date and time slot.",
  alternates: {
    canonical: "/appointment",
  },
};

export default function AppointmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
