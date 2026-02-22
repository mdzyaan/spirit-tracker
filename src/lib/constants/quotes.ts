export type QuoteItem = { text: string; attribution: string };

/** Curated verses about Ramadan or Allah's love. Rotate by day of year. */
export const RAMADAN_QUOTES: QuoteItem[] = [
  {
    text: "Allah does not look at your forms or your wealth, but He looks at your hearts and your actions.",
    attribution: "— Sahih Muslim",
  },
  {
    text: "O you who have believed, decreed upon you is fasting as it was decreed upon those before you that you may become righteous.",
    attribution: "— Surah Al-Baqarah, 2:183",
  },
  {
    text: "The month of Ramadan in which was revealed the Quran, a guidance for mankind and clear proofs for the guidance and the criterion.",
    attribution: "— Surah Al-Baqarah, 2:185",
  },
  {
    text: "And when My servants ask you concerning Me, indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.",
    attribution: "— Surah Al-Baqarah, 2:186",
  },
  {
    text: "Indeed, with hardship comes ease.",
    attribution: "— Surah Ash-Sharh, 94:6",
  },
  {
    text: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
    attribution: "— Surah Al-Baqarah, 2:152",
  },
  {
    text: "Verily, the reward of fasting is with Allah. He will give it on the Day of Resurrection.",
    attribution: "— Hadith (Bukhari & Muslim)",
  },
  {
    text: "Whoever prays at night in Ramadan out of faith and hope for reward, his previous sins will be forgiven.",
    attribution: "— Sahih Bukhari",
  },
];

export function getQuoteForToday(): QuoteItem {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return RAMADAN_QUOTES[dayOfYear % RAMADAN_QUOTES.length];
}
