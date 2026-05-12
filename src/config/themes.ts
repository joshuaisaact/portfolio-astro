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
    id: "myspace",
    label: "MySpace",
    flavour:
      "It's 2006. Your profile CSS breaks on every browser, Tom is in your Top 8, and someone's about to steal your layout code.",
    preview: `<svg viewBox="0 0 160 80" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="80" fill="#0a0010"/>
      <ellipse cx="20" cy="15" rx="50" ry="30" fill="#ff00ff" opacity="0.06"/>
      <ellipse cx="140" cy="65" rx="50" ry="30" fill="#ff69b4" opacity="0.06"/>
      <rect width="160" height="13" fill="#120020"/>
      <rect y="13" width="160" height="1.5" fill="#ff69b4" opacity="0.9"/>
      <rect x="5" y="4" width="18" height="5" rx="1" fill="#ff69b4" opacity="0.8"/>
      <rect x="27" y="4" width="14" height="5" rx="1" fill="#ff69b4" opacity="0.4"/>
      <rect x="45" y="4" width="14" height="5" rx="1" fill="#ff69b4" opacity="0.4"/>
      <rect x="5" y="18" width="95" height="7" rx="1" fill="#ff69b4" opacity="0.85"/>
      <rect x="104" y="19" width="5" height="5" fill="#ff00ff" opacity="0.9"/>
      <rect x="113" y="18" width="4" height="4" fill="#ff69b4" opacity="0.6"/>
      <rect x="121" y="20" width="3" height="3" fill="#ff00ff" opacity="0.5"/>
      <rect x="5" y="29" width="150" height="26" fill="#120020" stroke="#ff69b4" stroke-width="1" stroke-dasharray="4,3" opacity="0.8"/>
      <rect x="9" y="34" width="3" height="3" fill="#ff69b4" opacity="0.9"/>
      <rect x="14" y="34" width="130" height="3" rx="0" fill="#c0c0c0" opacity="0.45"/>
      <rect x="9" y="40" width="3" height="3" fill="#ff69b4" opacity="0.9"/>
      <rect x="14" y="40" width="110" height="3" rx="0" fill="#c0c0c0" opacity="0.45"/>
      <rect x="9" y="46" width="3" height="3" fill="#ff69b4" opacity="0.9"/>
      <rect x="14" y="46" width="120" height="3" rx="0" fill="#c0c0c0" opacity="0.45"/>
      <rect x="25" y="57" width="110" height="2" fill="#ff69b4" opacity="0.3"/>
      <text x="5" y="61" font-size="5" fill="#ff69b4" opacity="0.8">✦ ♥ ✦ ♥ ✦</text>
      <rect y="67" width="160" height="13" fill="#120020"/>
      <rect y="67" width="160" height="1.5" fill="#ff69b4" opacity="0.9"/>
      <rect x="5" y="73" width="6" height="5" fill="#ff69b4" opacity="0.9"/>
      <rect x="14" y="73" width="75" height="4" rx="0" fill="#ff69b4" opacity="0.7"/>
      <rect x="94" y="74" width="40" height="2" fill="rgba(255,105,180,0.25)"/>
      <rect x="94" y="74" width="22" height="2" fill="#ff69b4" opacity="0.7"/>
      <rect x="138" y="73" width="18" height="4" rx="0" fill="#c0c0c0" opacity="0.35"/>
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
