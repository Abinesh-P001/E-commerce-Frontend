import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.resolve(__dirname, '../uploads/360');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Generate 36 frames for Milk Bottle
for (let i = 1; i <= 36; i++) {
  const angle = (i - 1) * 10;
  const rad = (angle * Math.PI) / 180;
  // Calculate label shift and specular highlight shift based on rotation angle
  const labelOffset = Math.sin(rad) * 60;
  const labelScaleX = Math.cos(rad);
  const isFront = Math.cos(rad) > -0.2;
  const highlightX = 140 + Math.sin(rad + 0.5) * 20;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E0F2FE" stop-opacity="0.8"/>
      <stop offset="25%" stop-color="#FFFFFF" stop-opacity="0.95"/>
      <stop offset="60%" stop-color="#BAE6FD" stop-opacity="0.7"/>
      <stop offset="90%" stop-color="#38BDF8" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#0284C7" stop-opacity="0.8"/>
    </linearGradient>
    <linearGradient id="milkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F1F5F9"/>
      <stop offset="30%" stop-color="#FFFFFF"/>
      <stop offset="70%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="25" stdDeviation="20" flood-color="#0F172A" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Clean Background -->
  <rect width="400" height="600" fill="url(#bgGrad)" rx="24"/>

  <!-- Pedestal Shadow -->
  <ellipse cx="200" cy="530" rx="110" ry="24" fill="#0F172A" opacity="0.12" filter="blur(8px)"/>

  <!-- Bottle Silhouette Group -->
  <g filter="url(#dropShadow)">
    <!-- Bottle Cap -->
    <rect x="175" y="60" width="50" height="28" rx="6" fill="#059669"/>
    <rect x="170" y="85" width="60" height="12" rx="3" fill="#047857"/>

    <!-- Bottle Neck -->
    <path d="M 180 97 L 180 150 Q 180 190 140 220 L 130 240 L 130 500 Q 130 520 150 520 L 250 520 Q 270 520 270 500 L 270 240 L 260 220 Q 220 190 220 150 L 220 97 Z" fill="url(#glassGrad)"/>

    <!-- Fresh Milk Liquid Body -->
    <path d="M 183 145 Q 183 185 145 215 L 135 235 L 135 496 Q 135 514 154 514 L 246 514 Q 265 514 265 496 L 265 235 L 255 215 Q 217 185 217 145 Z" fill="url(#milkGrad)"/>

    <!-- 360 Degree Rotational Label -->
    ${
      isFront
        ? `<g transform="translate(${200 + labelOffset}, 330) scale(${Math.max(0.1, labelScaleX)}, 1)">
        <rect x="-65" y="-60" width="130" height="120" rx="10" fill="#065F46" opacity="0.92"/>
        <rect x="-60" y="-55" width="120" height="110" rx="8" fill="#FFFFFF"/>
        <circle cx="0" cy="-22" r="18" fill="#ECFDF5"/>
        <path d="M -8 -22 Q 0 -34 8 -22 Q 0 -14 -8 -22 Z" fill="#059669"/>
        <text x="0" y="10" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="900" fill="#065F46" text-anchor="middle">DAIRYFRESH</text>
        <text x="0" y="24" font-family="'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="700" fill="#059669" text-anchor="middle">A2 ORGANIC MILK</text>
        <text x="0" y="38" font-family="'Segoe UI', Roboto, sans-serif" font-size="8" fill="#64748B" text-anchor="middle">100% PURE FARM FRESH</text>
      </g>`
        : `<g transform="translate(${200 - labelOffset}, 330) scale(${Math.max(0.1, Math.abs(labelScaleX))}, 1)">
        <rect x="-60" y="-50" width="120" height="100" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1"/>
        <text x="0" y="-25" font-family="'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="700" fill="#334155" text-anchor="middle">NUTRITION FACTS</text>
        <line x1="-50" y1="-18" x2="50" y2="-18" stroke="#94A3B8" stroke-width="1"/>
        <text x="-45" y="-5" font-family="'Segoe UI', Roboto, sans-serif" font-size="8" fill="#475569">Energy: 65 kcal</text>
        <text x="-45" y="8" font-family="'Segoe UI', Roboto, sans-serif" font-size="8" fill="#475569">Protein: 3.4g</text>
        <text x="-45" y="21" font-family="'Segoe UI', Roboto, sans-serif" font-size="8" fill="#475569">Calcium: 120mg</text>
        <text x="-45" y="34" font-family="'Segoe UI', Roboto, sans-serif" font-size="8" fill="#475569">Batch: DF-2026-A2</text>
      </g>`
    }

    <!-- Glass Specular Reflection Curves -->
    <path d="M 148 240 L 148 490 Q 148 505 160 505" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.6"/>
    <path d="M ${highlightX} 160 Q ${highlightX} 200 ${highlightX - 15} 230" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.7"/>
  </g>

  <!-- Rotation Angle Indicator Overlay -->
  <g transform="translate(200, 565)">
    <rect x="-60" y="-14" width="120" height="26" rx="13" fill="#0F172A" opacity="0.75"/>
    <text x="0" y="4" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">360° VIEW • ${angle}°</text>
  </g>
</svg>`;

  const filename = `milk-360-${String(i).padStart(2, '0')}.svg`;
  fs.writeFileSync(path.join(targetDir, filename), svg);
}

// Generate 36 frames for Ghee Jar
for (let i = 1; i <= 36; i++) {
  const angle = (i - 1) * 10;
  const rad = (angle * Math.PI) / 180;
  const labelOffset = Math.sin(rad) * 65;
  const labelScaleX = Math.cos(rad);
  const isFront = Math.cos(rad) > -0.2;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">
  <defs>
    <linearGradient id="gheeBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB"/>
      <stop offset="100%" stop-color="#FEF3C7"/>
    </linearGradient>
    <linearGradient id="goldenGhee" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="35%" stop-color="#FDE68A"/>
      <stop offset="70%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
    <linearGradient id="goldCap" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D97706"/>
      <stop offset="50%" stop-color="#FDE68A"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
    <filter id="shadowGhee" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="25" stdDeviation="18" flood-color="#78350F" flood-opacity="0.2"/>
    </filter>
  </defs>

  <rect width="400" height="600" fill="url(#gheeBg)" rx="24"/>
  <ellipse cx="200" cy="515" rx="115" ry="22" fill="#78350F" opacity="0.15" filter="blur(8px)"/>

  <g filter="url(#shadowGhee)">
    <!-- Golden Jar Lid -->
    <rect x="150" y="140" width="100" height="35" rx="6" fill="url(#goldCap)"/>
    <line x1="150" y1="155" x2="250" y2="155" stroke="#78350F" stroke-width="1.5" opacity="0.4"/>

    <!-- Glass Jar Body -->
    <path d="M 160 175 L 130 220 L 130 470 Q 130 495 155 495 L 245 495 Q 270 495 270 470 L 270 220 L 240 175 Z" fill="#FFFFFF" fill-opacity="0.25" stroke="#FDE68A" stroke-width="2"/>

    <!-- Rich Golden Ghee Content -->
    <path d="M 134 240 L 134 466 Q 134 490 157 490 L 243 490 Q 266 490 266 466 L 266 240 Q 200 250 134 240 Z" fill="url(#goldenGhee)"/>

    <!-- Jar Label -->
    ${
      isFront
        ? `<g transform="translate(${200 + labelOffset}, 360) scale(${Math.max(0.1, labelScaleX)}, 1)">
        <rect x="-65" y="-55" width="130" height="110" rx="10" fill="#78350F"/>
        <rect x="-60" y="-50" width="120" height="100" rx="8" fill="#FFFBEB"/>
        <text x="0" y="-20" font-family="'Georgia', serif" font-size="11" font-weight="bold" fill="#B45309" text-anchor="middle">DAIRYFRESH</text>
        <text x="0" y="0" font-family="'Georgia', serif" font-size="14" font-weight="900" fill="#78350F" text-anchor="middle">VEDIC A2 GHEE</text>
        <text x="0" y="18" font-family="'Segoe UI', sans-serif" font-size="8" font-weight="700" fill="#D97706" text-anchor="middle">BILONA CHURNED • 500ml</text>
        <circle cx="0" cy="32" r="5" fill="#F59E0B"/>
      </g>`
        : `<g transform="translate(${200 - labelOffset}, 360) scale(${Math.max(0.1, Math.abs(labelScaleX))}, 1)">
        <rect x="-60" y="-45" width="120" height="90" rx="6" fill="#FFFBEB" stroke="#D97706" stroke-width="1"/>
        <text x="0" y="-22" font-family="'Segoe UI', sans-serif" font-size="9" font-weight="bold" fill="#78350F" text-anchor="middle">PURITY & TRADITION</text>
        <text x="-45" y="-4" font-family="'Segoe UI', sans-serif" font-size="8" fill="#78350F">100% Desi Grass-Fed</text>
        <text x="-45" y="10" font-family="'Segoe UI', sans-serif" font-size="8" fill="#78350F">No Preservatives</text>
        <text x="-45" y="24" font-family="'Segoe UI', sans-serif" font-size="8" fill="#78350F">Rich Granular Texture</text>
      </g>`
    }

    <!-- Glass Highlights -->
    <path d="M 142 230 L 142 460" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.6"/>
  </g>

  <g transform="translate(200, 560)">
    <rect x="-60" y="-14" width="120" height="26" rx="13" fill="#78350F" opacity="0.85"/>
    <text x="0" y="4" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">360° VIEW • ${angle}°</text>
  </g>
</svg>`;

  const filename = `ghee-360-${String(i).padStart(2, '0')}.svg`;
  fs.writeFileSync(path.join(targetDir, filename), svg);
}

console.log('✅ Generated 72 total 360-degree sequence frames (36 for milk, 36 for ghee) in backend/uploads/360/');
