/**
 * Centralized JSON-LD (schema.org) entities for AI/search crawlability.
 * All facts here are sourced from the site's own content (bio.json, About).
 * The Person @id is the canonical anchor referenced by Article JSON-LD on
 * insight pages and by the ProfilePage on /pedro-ripper.
 */

export const SITE_URL = "https://pedroripper.com";
export const PERSON_ID = `${SITE_URL}/#pedro-ripper`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const PERSON_LD = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Pedro Ripper",
  givenName: "Pedro",
  familyName: "Ripper",
  url: SITE_URL,
  image: `${SITE_URL}/images/og-preview.png`,
  jobTitle: "Co-founder and CEO",
  worksFor: {
    "@type": "Organization",
    name: "Bemobi",
    url: "https://bemobi.com",
    tickerSymbol: "BMOB3",
  },
  homeLocation: {
    "@type": "Place",
    name: "Rio de Janeiro, Brazil",
  },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "PUC-Rio" },
    { "@type": "CollegeOrUniversity", name: "Harvard Business School" },
    { "@type": "CollegeOrUniversity", name: "Singularity University" },
  ],
  knowsAbout: [
    "Artificial intelligence",
    "AI agents",
    "Personal AI systems",
    "Digital payments",
    "Fintech",
    "Enterprise software",
    "Brazilian technology companies",
    "Technology leadership",
    "Company building",
    "Books and learning",
  ],
  sameAs: [
    "https://linkedin.com/in/pedroripper",
    "https://x.com/ripper_pedro",
    "https://bemobi.com",
  ],
  nationality: { "@type": "Country", name: "Brazil" },
};

export const WEBSITE_LD = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: "Pedro Ripper",
  url: SITE_URL,
  description:
    "Pedro Ripper's personal website on AI, digital payments, books, talks and technology.",
  publisher: { "@id": PERSON_ID },
};

/** Root layout graph — Person + WebSite, anchored by stable @ids. */
export const GLOBAL_LD = {
  "@context": "https://schema.org",
  "@graph": [WEBSITE_LD, PERSON_LD],
};

/** ProfilePage graph for /pedro-ripper. */
export const PROFILE_PAGE_LD = {
  "@context": "https://schema.org",
  "@graph": [
    PERSON_LD,
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/pedro-ripper#profile`,
      url: `${SITE_URL}/pedro-ripper`,
      name: "Pedro Ripper — Profile",
      inLanguage: "en",
      mainEntity: { "@id": PERSON_ID },
      isPartOf: { "@id": WEBSITE_ID },
    },
  ],
};
