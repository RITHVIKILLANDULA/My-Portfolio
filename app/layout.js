import { Instrument_Serif, Archivo, Martian_Mono } from "next/font/google";
import "./globals.css";
import "./motion.css";
import StyledJsxRegistry from "./StyledJsxRegistry";

const SITE_URL = "https://rithvikillandula.github.io/My-Portfolio";

// Cappen-language type system: grotesque statements / elegant serif italics / Martian Mono details
const serif = Instrument_Serif({ variable: "--font-serif-display", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });
const martian = Martian_Mono({ variable: "--font-martian", subsets: ["latin"], weight: ["300", "400"] });

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
      { url: `${SITE_URL}/favicons/favicon-32x32.png`, sizes: "32x32", type: "image/png" },
      { url: `${SITE_URL}/favicons/favicon.ico`, sizes: "any" },
    ],
    apple: [{ url: `${SITE_URL}/favicons/apple-touch-icon.png` }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${archivo.variable} ${martian.variable} h-full antialiased`}>
      <body suppressHydrationWarning className={`${serif.variable} ${archivo.variable} ${martian.variable} h-full antialiased`}>
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
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  );
}
