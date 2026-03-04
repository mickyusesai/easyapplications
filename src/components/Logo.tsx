export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3C3CE6" />
          <stop offset="100%" stopColor="#66C7FF" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#brandGradient)" />
      <text
        x="50"
        y="68"
        textAnchor="middle"
        fill="white"
        fontSize="52"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        EA
      </text>
    </svg>
  );
}
