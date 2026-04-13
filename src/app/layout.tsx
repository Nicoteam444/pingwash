import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PINGWASH — Le laveur qui protège la banquise",
  description:
    "Lavage auto, moto & vélo à domicile ou en entreprise. Écologique, rapide et intelligent. Réservez en 30 secondes.",
  keywords: [
    "lavage auto",
    "lavage domicile",
    "lavage écologique",
    "lavage entreprise",
    "PINGWASH",
  ],
  metadataBase: new URL("https://pingwash.com"),
  openGraph: {
    title: "PINGWASH — Le laveur qui protège la banquise",
    description:
      "Lavage auto, moto & vélo à domicile ou en entreprise. Écologique, rapide et intelligent. Réservez en 30 secondes.",
    url: "https://pingwash.com",
    siteName: "PINGWASH",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 2400,
        height: 1260,
        alt: "PINGWASH — Votre véhicule lavé. La banquise protégée.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PINGWASH — Le laveur qui protège la banquise",
    description:
      "Lavage auto, moto & vélo à domicile ou en entreprise. Écologique, rapide et intelligent.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
