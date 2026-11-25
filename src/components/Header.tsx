import {Clock} from 'lucide-react';

interface HeaderProps {
  isViewingLive: boolean;
  onJumpToNow: () => void;
  hasData: boolean;
}

export function Header({isViewingLive, onJumpToNow, hasData}: HeaderProps) {
  return (
    <header className="border-b border-[#C89B54]/15 bg-[#0C0908]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="font-serif text-2xl font-semibold tracking-tight text-[#F6EFE2] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B866]"
        >
          Astha prahar
        </a>

        <nav
          aria-label="Primary sections"
          className="hidden items-center gap-6 text-sm font-medium text-[#C8BEAE] md:flex"
        >
          <a
            href="#dial"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#F2B866] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B866]"
          >
            Prahar Dial
          </a>
          <a
            href="#stage"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#F2B866] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B866]"
          >
            Recital Stage
          </a>
          <a
            href="#all-prahars"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#F2B866] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B866]"
          >
            Eight Prahars
          </a>
          <a
            href="#seasonal-ragas"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#F2B866] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2B866]"
          >
            Seasonal Ragas
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onJumpToNow}
            disabled={!hasData}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-md border border-[#C89B54]/40 bg-[#1B1410] px-4 py-2 text-xs font-medium tracking-wide text-[#F5E6CC] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[#F2B866] hover:bg-[#261B14] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B866] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Clock className="h-3.5 w-3.5 text-[#F2B866]" aria-hidden="true" />
            <span>{isViewingLive ? 'Now Playing Slot' : 'Jump to Now'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
