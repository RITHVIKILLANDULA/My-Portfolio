import { Geist, Geist_Mono, Baloo_2, Dancing_Script } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/ui/Cursor";

const SITE_URL = "https://rithvikillandula.github.io/My-Portfolio";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const baloo = Baloo_2({ variable: "--font-baloo", subsets: ["latin"], weight: ["400", "600", "800"] });
const dancing = Dancing_Script({ variable: "--font-dancing", subsets: ["latin"], weight: ["400", "700"] });

const description =
  "Data, AI, and Software Engineer with 4+ years across Deloitte, WAFU, and the University at Buffalo, and three CS degrees. I build pipelines, ML/LLM systems, and production-ready software.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Rithvik Illandula | Data, AI & Software Engineer",
    template: "%s | Rithvik Illandula",
  },
  description,
  keywords: [
    "Rithvik Illandula",
    "Data Engineer",
    "AI Engineer",
    "Machine Learning Engineer",
    "Software Engineer",
    "RAG",
    "LLM",
    "BigQuery",
    "Airflow",
    "Buffalo",
  ],
  authors: [{ name: "Rithvik Illandula", url: SITE_URL }],
  creator: "Rithvik Illandula",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Rithvik Illandula",
    title: "Rithvik Illandula | Data, AI & Software Engineer",
    description,
    images: [{ url: `${SITE_URL}/assets/portrait.png`, width: 1200, height: 630, alt: "Rithvik Illandula" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rithvik Illandula | Data, AI & Software Engineer",
    description,
    images: [`${SITE_URL}/assets/portrait.png`],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/favicons/apple-touch-icon.png" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${baloo.variable} ${dancing.variable} h-full antialiased`}>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${baloo.variable} ${dancing.variable} h-full antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Rithvik Illandula",
              url: SITE_URL,
              email: "rithvik.illandula@gmail.com",
              jobTitle: "Data, AI & Software Engineer",
              sameAs: [
                "https://github.com/RITHVIKILLANDULA",
                "https://www.linkedin.com/in/rithvik-illandula/",
              ],
            }),
          }}
        />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
