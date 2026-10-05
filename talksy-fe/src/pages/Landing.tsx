import { Link } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useCurrentUser';
import BreathingCircle from '../components/BreathingCircle';
// Open Doodles by Pablo Stanley (CC0, opendoodles.com), recolored to the app palette
import selfieImg from '../assets/illustrations/selfie.svg';
import layingImg from '../assets/illustrations/laying.svg';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Landing() {
  const {user} = useCurrentUser();
  const firstName = (user.name || user.email.split('@')[0]).split(' ')[0];

  return (
    <div className="overflow-x-hidden">
      <section className="max-w-5xl mx-auto px-4 sm:px-8 pt-8 md:pt-12 pb-10 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-3">
            {greeting()}, {firstName} 👋
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold text-slate-800 leading-tight">
            Ready to
            <span className="text-[#B5542C]"> catch up?</span>
          </h1>
          <p className="mt-4 text-slate-500 text-lg max-w-md">
            Your people are a click away. Pick someone from Chats and say hi. No rush, no noise.
          </p>
          <div className="mt-8">
            <Link
              to="/chats"
              className="inline-block px-6 py-3 rounded-full bg-[#FFB4A2] text-white font-medium shadow-sm hover:shadow-md hover:bg-[#ff9d86] transition-all"
            >
              Open chats
            </Link>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="absolute inset-8 rounded-full bg-[#FFE1D6] blur-3xl" />
          <img src={selfieImg} alt="Person waving hi while taking a selfie" className="relative w-full max-w-sm" />
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-8 pb-16 grid md:grid-cols-2 gap-6">
        <Link
          to="/chats"
          className="group rounded-3xl bg-[#D6F5E8] p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex-1">
            <h2 className="font-semibold text-slate-800">Your chats</h2>
            <p className="text-sm text-slate-600 mt-1">Find someone in your space and start a conversation.</p>
            <span className="inline-block mt-4 text-sm font-medium text-[#2F8A66] group-hover:translate-x-0.5 transition-transform">
              Open chats →
            </span>
          </div>
          <img src={layingImg} alt="" className="w-36 sm:w-44 shrink-0" />
        </Link>

        <div className="rounded-3xl bg-white border border-[#EEE3FA] p-6 flex flex-col lg:flex-row items-center gap-6 text-center lg:text-left shadow-sm">
          <div className="flex-1">
            <h2 className="font-semibold text-slate-800">Take a breath</h2>
            <p className="text-sm text-slate-600 mt-1">
              Follow the circle for a few rounds before you dive in. Your chats will still be there. 🌿
            </p>
          </div>
          <div className="shrink-0">
            <BreathingCircle />
          </div>
        </div>
      </section>
    </div>
  );
}
