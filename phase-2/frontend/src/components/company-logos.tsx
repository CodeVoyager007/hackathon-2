export function CompanyLogos() {
  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
      {/* Acme Corp */}
      <div className="flex items-center gap-2 font-bold text-xl">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
           <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2-1 8 4-10 5-10-5 8-4 2 1z" />
           <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
        <span>Acme</span>
      </div>

      {/* GlobalTech */}
      <div className="flex items-center gap-2 font-bold text-xl">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
         </svg>
         <span>GlobalTech</span>
      </div>

      {/* Nebula */}
      <div className="flex items-center gap-2 font-bold text-xl">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
            <path d="M12 2L9 9l-7 3 7 3 3 7 3-7 7-3-7-3-3-7z" />
         </svg>
         <span>Nebula</span>
      </div>

      {/* FoxRun */}
      <div className="flex items-center gap-2 font-bold text-xl">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <path d="M12 4v16M4 10h16M4 14h16" />
         </svg>
         <span>FoxRun</span>
      </div>

      {/* Circle */}
      <div className="flex items-center gap-2 font-bold text-xl">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-primary">
            <circle cx="12" cy="12" r="9" />
         </svg>
         <span>Circle</span>
      </div>
    </div>
  );
}
