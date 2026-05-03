import { Leaf } from "lucide-react"

export function EcoIllustration() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sky gradient background */}
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e8f5e9" />
          <stop offset="100%" stopColor="#c8e6c9" />
        </linearGradient>
        <linearGradient id="earthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#81c784" />
          <stop offset="100%" stopColor="#66bb6a" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="400" height="400" fill="url(#skyGradient)" />

      {/* Wind turbines */}
      <g opacity="0.6">
        <line x1="280" y1="200" x2="280" y2="320" stroke="#a1887f" strokeWidth="8" />
        <circle cx="280" cy="180" r="40" fill="none" stroke="#a1887f" strokeWidth="4" />
        <line x1="280" y1="140" x2="320" y2="180" stroke="#a1887f" strokeWidth="3" />
        <line x1="280" y1="140" x2="240" y2="180" stroke="#a1887f" strokeWidth="3" />
        <line x1="280" y1="180" x2="280" y2="220" stroke="#a1887f" strokeWidth="3" />
      </g>

      {/* Mountains/hills */}
      <ellipse cx="200" cy="280" rx="150" ry="80" fill="#a1887f" opacity="0.3" />
      <ellipse cx="350" cy="300" rx="100" ry="60" fill="#a1887f" opacity="0.2" />

      {/* Earth */}
      <circle cx="200" cy="200" r="90" fill="url(#earthGradient)" />
      
      {/* Continents on earth */}
      <path
        d="M 150 170 Q 140 180 150 190 Q 160 195 165 185 Z"
        fill="#558b2f"
        opacity="0.8"
      />
      <path
        d="M 220 160 Q 210 165 215 175 Q 230 180 235 170 Z"
        fill="#558b2f"
        opacity="0.8"
      />
      <path
        d="M 180 220 Q 170 225 175 235 Q 190 240 195 230 Z"
        fill="#558b2f"
        opacity="0.8"
      />

      {/* Large leaf - left */}
      <g transform="translate(80, 150)">
        <ellipse cx="0" cy="0" rx="35" ry="50" fill="#81c784" transform="rotate(-30)" />
        <line x1="0" y1="-30" x2="0" y2="30" stroke="#558b2f" strokeWidth="2" />
        <path d="M -5 -10 Q -10 0 -5 10 M 5 -10 Q 10 0 5 10" stroke="#558b2f" strokeWidth="1" fill="none" />
      </g>

      {/* Large leaf - right */}
      <g transform="translate(320, 180)">
        <ellipse cx="0" cy="0" rx="30" ry="45" fill="#81c784" transform="rotate(30)" />
        <line x1="0" y1="-25" x2="0" y2="25" stroke="#558b2f" strokeWidth="2" />
        <path d="M -5 -10 Q -10 0 -5 10 M 5 -10 Q 10 0 5 10" stroke="#558b2f" strokeWidth="1" fill="none" />
      </g>

      {/* Small leaves scattered */}
      <g opacity="0.7">
        <ellipse cx="100" cy="240" rx="8" ry="12" fill="#81c784" transform="rotate(-20)" />
        <ellipse cx="320" cy="260" rx="7" ry="11" fill="#81c784" transform="rotate(25)" />
        <ellipse cx="150" cy="300" rx="6" ry="10" fill="#66bb6a" transform="rotate(-15)" />
        <ellipse cx="280" cy="310" rx="8" ry="12" fill="#66bb6a" transform="rotate(35)" />
      </g>

      {/* Flying birds */}
      <g opacity="0.6">
        <text x="120" y="120" fontSize="20" fill="#558b2f">
          ✓ ✓ ✓
        </text>
        <text x="280" y="140" fontSize="18" fill="#558b2f">
          ✓ ✓
        </text>
      </g>

      {/* Plant/sprout at bottom left */}
      <g transform="translate(60, 320)">
        <line x1="0" y1="20" x2="0" y2="0" stroke="#558b2f" strokeWidth="3" />
        <ellipse cx="-8" cy="5" rx="6" ry="10" fill="#81c784" transform="rotate(-40)" />
        <ellipse cx="8" cy="5" rx="6" ry="10" fill="#81c784" transform="rotate(40)" />
        <ellipse cx="0" cy="-5" rx="7" ry="12" fill="#a1887f" />
      </g>
    </svg>
  )
}
