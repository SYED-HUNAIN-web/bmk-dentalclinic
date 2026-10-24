import { getPublicCases } from "@/lib/data/clinic-data";
import ClientWorkDirectoryClient from "@/components/ClientWorkDirectoryClient";

export const metadata = {
  title: "Documented Surgical Cases & Radiographic Studies",
  description:
    "Review authenticated maxillofacial trauma reconstructions, immediate dental implants, and micro-endodontic case archives from BMK Dental & Maxillofacial Clinic in Hyderabad.",
  alternates: {
    canonical: "/client-work",
  },
};

export const revalidate = 60;

export default async function ClientWorkPage() {
  const cases = await getPublicCases();

  return <ClientWorkDirectoryClient initialCases={cases} />;
}
