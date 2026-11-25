import type {Prahar} from '../types/prahar';

interface PraharGridProps {
  prahars: Prahar[];
  selectedId: number;
  liveId: number | null;
  onSelectPrahar: (id: number) => void;
}

export function PraharGrid({
  prahars,
  selectedId,
  liveId,
  onSelectPrahar,
}: PraharGridProps) {
  return (
    <section id="all-prahars" aria-labelledby="all-prahars-heading" className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#C89B54]/15 pb-4">
        <div>
          <p className="text-xs font-medium tracking-widest text-[#C89B54] uppercase">
            24-Hour Cycle
          </p>
          <h2
            id="all-prahars-heading"
            className="mt-1 font-serif text-3xl font-medium text-[#FAF3E6] sm:text-4xl"
          >
            All Eight Prahars
          </h2>
        </div>
        <p className="text-sm text-[#B6AA99]">
          Select any window to bring its raga and Ragamala folio onto the main stage.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {prahars.map((prahar) => {
          const isSelected = prahar.id === selectedId;
          const isLive = prahar.id === liveId;
          const hasAudio = Boolean(prahar.audio.direct_audio_url);

          return (
            <button
              key={prahar.id}
              type="button"
              onClick={() => onSelectPrahar(prahar.id)}
              aria-pressed={isSelected}
              className={`group flex min-h-[152px] flex-col justify-between rounded-lg border p-4 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B866] ${
                isSelected
                  ? 'border-[#F2B866]/75 bg-[#221812]'
                  : 'border-[#C89B54]/20 bg-[#140F0D] hover:border-[#C89B54]/50 hover:bg-[#1B1410]'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-xs text-[#C89B54] tabular-nums">
                  <span>{`0${prahar.id} · ${prahar.time_range}`}</span>
                  {isLive && (
                    <span className="font-medium text-[#F2B866]">Now</span>
                  )}
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#FAF3E6] group-hover:text-[#F8D08B]">
                  {prahar.primary_raga}
                </h3>
                <p className="text-xs leading-relaxed text-[#BFB3A2]">
                  {prahar.prahar_name}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#C89B54]/15 pt-2.5 text-xs text-[#A39686]">
                <span>Thaat {prahar.thaat}</span>
                <span>{hasAudio ? 'Stream ready' : 'Source ref'}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
