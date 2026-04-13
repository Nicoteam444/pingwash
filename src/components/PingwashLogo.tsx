export default function PingwashLogo({ className = "h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 50"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Penguin icon */}
      <ellipse cx="20" cy="28" rx="12" ry="16" fill="#0c1e2c" />
      <ellipse cx="20" cy="30" rx="8" ry="11" fill="white" />
      <circle cx="16" cy="23" r="2" fill="#0ea5e9" />
      <circle cx="24" cy="23" r="2" fill="#0ea5e9" />
      <ellipse cx="20" cy="27" rx="2" ry="1" fill="#f97316" />
      {/* Water droplet */}
      <path
        d="M35 20 Q38 14 41 20 Q41 24 38 25 Q35 24 35 20Z"
        fill="#0ea5e9"
        opacity="0.7"
      />
      {/* Text */}
      <text
        x="50"
        y="35"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize="24"
        fill="#0c1e2c"
      >
        PING
        <tspan fill="#0ea5e9">WASH</tspan>
      </text>
    </svg>
  );
}
