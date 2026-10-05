interface Props {
  color?: string;
  className?: string;
}

export default function Mascot({ color = '#FFB4A2', className = '' }: Props) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M100 18c40 0 68 16 76 48 7 28 2 56-18 76-22 22-54 30-82 22-26-8-46-30-52-58-6-30 2-58 24-76 14-11 32-12 52-12Z"
        fill={color}
      />
      <circle cx="74" cy="96" r="7" fill="#3A2E2E" />
      <circle cx="128" cy="96" r="7" fill="#3A2E2E" />
      <path d="M80 122c8 10 32 10 40 0" stroke="#3A2E2E" strokeWidth="5" strokeLinecap="round" />
      <circle cx="60" cy="112" r="9" fill="#fff" opacity="0.35" />
      <circle cx="142" cy="112" r="9" fill="#fff" opacity="0.35" />
    </svg>
  );
}
