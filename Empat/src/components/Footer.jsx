import { LOGO_URL } from "../js/constants";

export default function Footer(){
    return(
        <footer className="relative z-10 border-t border-slate-200 py-10 text-center text-sm text-slate-500 mt-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={LOGO_URL} alt="Empat" className="w-7 h-7" />
            <span className="font-display font-bold text-slate-900">Empat.</span>
          </div>
          <div>© {new Date().getFullYear()} Empat. Soft skills pelo desporto.</div>
        </div>
      </footer>
    )
}