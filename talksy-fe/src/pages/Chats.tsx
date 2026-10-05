// Open Doodles (CC0), recolored to the app palette
import layingImg from '../assets/illustrations/laying.svg';

// Shown beside the people list until someone is picked
export default function Chats() {
  return (
    <div className="min-h-[calc(100dvh-4rem)] md:min-h-dvh flex flex-col items-center justify-center text-center gap-4 p-8">
      <div className="relative w-80 max-w-full pt-10">
        <div className="absolute inset-x-4 top-10 bottom-0 rounded-full bg-[#D6F5E8] blur-2xl" />
        {/* Decorative bubbles hint at a conversation */}
        <span className="absolute top-0 left-2 bg-white text-slate-600 text-xs font-medium px-3 py-1.5 rounded-2xl rounded-bl-md shadow-sm">
          hey! 👋
        </span>
        <span className="absolute top-6 right-0 bg-[#EEE3FA] text-[#6B4B9A] text-xs font-medium px-3 py-1.5 rounded-2xl rounded-br-md shadow-sm">
          how's your day? 🌸
        </span>
        <img src={layingImg} alt="Person lying on a pillow texting on their phone" className="relative w-full" />
      </div>
      <h2 className="text-lg font-semibold text-slate-800">Pick someone to chat with</h2>
      <p className="text-sm text-slate-400 max-w-xs">No rush. Take a breath, then say hi when you're ready. 🌿</p>
    </div>
  );
}
