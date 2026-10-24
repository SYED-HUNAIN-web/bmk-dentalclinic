import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/auth",
          "/auth/",
          "/api/",
        ],
      },
    ],
    ...(siteUrl ? { sitemap: `${siteUrl.replace(/\/+$/, "")}/sitemap.xml` } : {}),
  };
}
