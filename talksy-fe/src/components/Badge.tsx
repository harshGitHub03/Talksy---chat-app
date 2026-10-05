interface Props {
  icon: string;
  label: string;
  color: 'coral' | 'mint' | 'lavender';
}

const COLORS = {
  coral: 'bg-[#FFE1D6] text-[#B5542C]',
  mint: 'bg-[#DDF6EC] text-[#2F8A66]',
  lavender: 'bg-[#EEE3FA] text-[#6B4B9A]',
};

export default function Badge({ icon, label, color }: Props) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${COLORS[color]}`}>
      <span>{icon}</span>
      {label}
    </span>
  );
}
