export function SwarDivider() {
  return (
    <div
      className="my-10 flex items-center justify-center gap-4 text-[#C89B54]/50 sm:my-14"
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C89B54]/30" />
      <svg
        width="64"
        height="16"
        viewBox="0 0 64 16"
        fill="none"
        className="shrink-0"
      >
        <path
          d="M2 8H18M46 8H62"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M22 8C25.5 3.5 28.5 3.5 32 8C35.5 12.5 38.5 12.5 42 8"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="32" cy="8" r="2" fill="#F2B866" fillOpacity="0.85" />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C89B54]/30" />
    </div>
  );
}
