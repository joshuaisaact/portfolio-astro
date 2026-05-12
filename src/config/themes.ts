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
      <!-- Page background: MySpace gray -->
      <rect width="160" height="80" fill="#d2d2d2"/>
      <!-- Dark blue topbar -->
      <rect width="160" height="11" fill="#1a3a5c"/>
      <!-- "mySpace" logo text simulation -->
      <rect x="4" y="3" width="10" height="5" fill="#ffffff" opacity="0.9"/>
      <rect x="15" y="3" width="14" height="5" fill="#aaccff" opacity="0.85"/>
      <!-- Search bar stub -->
      <rect x="90" y="3" width="40" height="5" fill="#ffffff" opacity="0.5"/>
      <rect x="133" y="3" width="18" height="5" fill="#5580a4"/>
      <!-- Nav strip -->
      <rect y="11" width="160" height="8" fill="#3b5f82"/>
      <rect x="4" y="13" width="14" height="3" fill="#ffffff" opacity="0.8"/>
      <rect x="22" y="13" width="14" height="3" fill="#ffffff" opacity="0.8"/>
      <rect x="40" y="13" width="18" height="3" fill="#ffffff" opacity="0.8"/>
      <rect x="62" y="13" width="60" height="3" fill="#ffffff" opacity="0.4"/>
      <rect x="126" y="13" width="26" height="3" fill="#ffffff" opacity="0.8"/>
      <!-- Gap -->
      <rect y="19" width="160" height="2" fill="#d2d2d2"/>
      <!-- Left sidebar (white box) -->
      <rect x="0" y="21" width="50" height="53" fill="#ffffff" stroke="#999999" stroke-width="0.5"/>
      <!-- Sidebar: section header -->
      <rect x="0" y="21" width="50" height="6" fill="#c8d8e8"/>
      <rect x="2" y="23" width="30" height="2" fill="#000000" opacity="0.5"/>
      <!-- Sidebar: avatar placeholder -->
      <rect x="5" y="29" width="40" height="22" fill="#3b5f82" opacity="0.6"/>
      <!-- Sidebar: info lines -->
      <rect x="2" y="53" width="35" height="2" fill="#000000" opacity="0.35"/>
      <rect x="2" y="57" width="28" height="2" fill="#000000" opacity="0.25"/>
      <rect x="2" y="61" width="32" height="2" fill="#000000" opacity="0.25"/>
      <rect x="2" y="65" width="24" height="2" fill="#000000" opacity="0.25"/>
      <!-- Sidebar: contacting box header (blue) -->
      <rect x="0" y="69" width="50" height="5" fill="#5d8cb0"/>
      <rect x="2" y="71" width="28" height="2" fill="#ffffff" opacity="0.7"/>
      <!-- Main column (white) -->
      <rect x="52" y="21" width="108" height="53" fill="#ffffff" stroke="#999999" stroke-width="0.5"/>
      <!-- Main: profile header bar -->
      <rect x="52" y="21" width="108" height="7" fill="#c8d8e8"/>
      <rect x="55" y="23" width="50" height="3" fill="#000000" opacity="0.45"/>
      <rect x="130" y="23" width="26" height="3" fill="#336600" opacity="0.6"/>
      <!-- Main: h2 section header -->
      <rect x="52" y="30" width="108" height="6" fill="#c8d8e8"/>
      <rect x="55" y="32" width="35" height="2" fill="#000000" opacity="0.5"/>
      <!-- Main: body text lines -->
      <rect x="55" y="39" width="100" height="2" fill="#000000" opacity="0.25"/>
      <rect x="55" y="43" width="90" height="2" fill="#000000" opacity="0.25"/>
      <rect x="55" y="47" width="95" height="2" fill="#000000" opacity="0.25"/>
      <!-- Main: second section header -->
      <rect x="52" y="53" width="108" height="6" fill="#c8d8e8"/>
      <rect x="55" y="55" width="40" height="2" fill="#000000" opacity="0.5"/>
      <!-- Main: more text -->
      <rect x="55" y="62" width="85" height="2" fill="#000000" opacity="0.25"/>
      <rect x="55" y="66" width="75" height="2" fill="#000000" opacity="0.25"/>
      <!-- Footer -->
      <rect y="74" width="160" height="6" fill="#1a3a5c"/>
      <rect x="4" y="76" width="60" height="2" fill="#aaaaaa" opacity="0.6"/>
      <rect x="90" y="76" width="65" height="2" fill="#aaccff" opacity="0.5"/>
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
