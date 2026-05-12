export interface Theme {
  id: string;
  label: string;
  flavour: string;
  preview: string;
}

export const themes: Theme[] = [
  {
    id: "default",
    label: "Default",
    flavour: "For fans of vanilla. Nothing wrong with a classic.",
    preview: `<svg viewBox="0 0 160 80" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="80" fill="#1f2937"/>
      <rect width="160" height="16" fill="#111827"/>
      <rect x="8" y="5" width="20" height="6" rx="2" fill="#374151"/>
      <rect x="90" y="5" width="12" height="5" rx="1" fill="#374151"/>
      <rect x="106" y="5" width="12" height="5" rx="1" fill="#374151"/>
      <rect x="122" y="5" width="12" height="5" rx="1" fill="#374151"/>
      <rect x="138" y="5" width="12" height="5" rx="1" fill="#374151"/>
      <rect x="8" y="26" width="80" height="8" rx="2" fill="#4b5563"/>
      <rect x="8" y="40" width="144" height="4" rx="1" fill="#374151"/>
      <rect x="8" y="48" width="136" height="4" rx="1" fill="#374151"/>
      <rect x="8" y="56" width="120" height="4" rx="1" fill="#374151"/>
      <rect x="8" y="64" width="44" height="12" rx="3" fill="#111827" stroke="#374151" stroke-width="1"/>
      <rect x="58" y="64" width="44" height="12" rx="3" fill="#111827" stroke="#374151" stroke-width="1"/>
      <rect x="108" y="64" width="44" height="12" rx="3" fill="#111827" stroke="#374151" stroke-width="1"/>
    </svg>`,
  },
  {
    id: "ceefax",
    label: "Ceefax",
    flavour:
      "As seen between the test card and a snooker repeat on BBC Two. Your TV licence has never looked this good.",
    preview: `<svg viewBox="0 0 160 80" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="80" fill="#000"/>
      <rect width="160" height="14" fill="#ff0000"/>
      <rect x="4" y="4" width="60" height="6" fill="#fff" opacity="0.9"/>
      <rect x="130" y="4" width="26" height="6" fill="#ffff00"/>
      <rect x="4" y="22" width="100" height="6" fill="#00ffff"/>
      <rect x="4" y="32" width="152" height="4" fill="#00ffff" opacity="0.7"/>
      <rect x="4" y="40" width="144" height="4" fill="#00ffff" opacity="0.7"/>
      <rect x="4" y="48" width="136" height="4" fill="#00ffff" opacity="0.7"/>
      <rect x="4" y="56" width="120" height="4" fill="#00ffff" opacity="0.7"/>
      <rect x="0" y="66" width="40" height="14" fill="#ff0000"/>
      <rect x="40" y="66" width="40" height="14" fill="#00ff00"/>
      <rect x="80" y="66" width="40" height="14" fill="#ffff00"/>
      <rect x="120" y="66" width="40" height="14" fill="#00ffff"/>
    </svg>`,
  },
];

export const validThemeIds = themes.map((t) => t.id);
