import { getPublicServices } from "@/lib/data/clinic-data";
import ServicesDirectoryClient from "@/components/ServicesDirectoryClient";

export const metadata = {
  title: "Clinical Services & Procedures",
  description:
    "Explore our complete range of maxillofacial trauma surgeries, oncological resections, immediate dental implants, micro-endodontics, and restorative oral care in Saddar, Hyderabad.",
  alternates: {
    canonical: "/services",
  },
};

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await getPublicServices();

  return <ServicesDirectoryClient initialServices={services} />;
}
