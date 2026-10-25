import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import IntroLoader from "@/components/IntroLoader";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CLINIC_INFO } from "@/data/mediaManifest";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const dmSerifDisplay = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
  style: ["normal", "italic"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://bmk-dental-clinic.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${CLINIC_INFO.name} | ${CLINIC_INFO.leadSurgeon}`,
    template: `%s | ${CLINIC_INFO.name}`,
  },
  description:
    "Distinguished center for oral & maxillofacial surgery, trauma reconstruction, dental implants, and micro-endodontics led by Dr Vishal Lohana (FCPS, BDS) and his team in Saddar, Hyderabad, Sindh.",
  icons: {
    icon: [
      { url: "/media/logo.jpeg" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/media/logo.jpeg",
    apple: "/media/logo.jpeg",
  },
  keywords: [
    "Maxillofacial Surgery",
    "Dr Vishal Lohana",
    "BMK Dental Clinic",
    "Dental Implants Hyderabad",
    "Jaw Fracture Treatment",
    "Impacted Tooth Removal",
    "Female Dentist Hyderabad",
    "Dr. Jotika female dentist",
    "Root Canal Specialist Hyderabad",
    "Oral Cancer Resection",
    "Hyderabad Dental Surgery",
    "Saddar Hyderabad Clinic",
  ],
  authors: [{ name: CLINIC_INFO.name }],
  creator: CLINIC_INFO.leadSurgeon,
  publisher: CLINIC_INFO.name,
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: siteUrl || undefined,
    siteName: CLINIC_INFO.name,
    title: `${CLINIC_INFO.name} | ${CLINIC_INFO.leadSurgeon}`,
    description:
      "Consultant-led oral & maxillofacial surgery, dental implants, trauma care, and restorative dentistry in Saddar, Hyderabad.",
    images: [
      {
        url: "/media/logo.jpeg",
        width: 800,
        height: 800,
        alt: `${CLINIC_INFO.name} Logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${CLINIC_INFO.name} | ${CLINIC_INFO.leadSurgeon}`,
    description:
      "Consultant-led oral & maxillofacial surgery, dental implants, trauma care, and restorative dentistry in Saddar, Hyderabad.",
    images: ["/media/logo.jpeg"],
  },
};

// Verified Schema.org MedicalClinic & Dentist structured data
const clinicSchema = {
  "@context": "https://schema.org",
  "@type": ["Dentist", "MedicalClinic"],
  name: CLINIC_INFO.name,
  description: CLINIC_INFO.tagline,
  url: siteUrl || undefined,
  logo: "/media/logo.jpeg",
  image: "/media/logo.jpeg",
  telephone: "+923332760510",
  medicalSpecialty: [
    "Dentistry",
    "Oral and Maxillofacial Surgery",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Quaid-E-Azam Medical Complex, Clinic No: MF:32, CMH Rd, Saddar",
    addressLocality: "Hyderabad",
    addressRegion: "Sindh",
    postalCode: "72000",
    addressCountry: "PK",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 25.4003729,
    longitude: 68.3558586,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "16:00",
      closes: "22:00",
    },
  ],
  priceRange: "$$",
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+923332760510",
      contactType: "customer service",
      availableLanguage: ["English", "Urdu", "Sindhi"],
    },
    {
      "@type": "ContactPoint",
      telephone: "+923430386371",
      contactType: "emergency",
      availableLanguage: ["English", "Urdu", "Sindhi"],
    },
  ],
  sameAs: [
    CLINIC_INFO.facebookUrl,
    CLINIC_INFO.instagramUrl,
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${dmSerifDisplay.variable}`}
    >
      <head>
        <link rel="icon" href="/media/logo.jpeg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/media/logo.jpeg" />
        {/* Structured Data: Verified Clinic Information */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicSchema) }}
        />
        {/* Zero-Flash Synchronous Theme Initializer */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('bmk-theme');
                  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = stored ? stored : (systemDark ? 'dark' : 'light');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-[#F7F5EF] dark:bg-[#0A1B14] text-[#202622] dark:text-[#EFECE3] transition-colors duration-200">
        <ThemeProvider>
          <IntroLoader />
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
