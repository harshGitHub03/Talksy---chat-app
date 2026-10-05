import Mascot from './Mascot';

const COLORS = ['#FFB4A2', '#B5EAD7', '#CDB4DB', '#FFD6A5', '#A8DADC', '#F7C6D9'];

// Same person always gets the same mascot color
function colorFor(id: string) {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function ChatAvatar({ id, size = 'md' }: { id: string; size?: 'sm' | 'md' }) {
  const box = size === 'sm' ? 'w-10 h-10' : 'w-12 h-12';
  const color = colorFor(id);
  return (
    <div className={`shrink-0 ${box} rounded-full flex items-center justify-center`} style={{ backgroundColor: `${color}55` }}>
      <Mascot color={color} className="w-4/5 h-4/5" />
    </div>
  );
}
