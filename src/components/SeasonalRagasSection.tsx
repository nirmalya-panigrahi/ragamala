import type {SeasonalRaga} from '../types/prahar';
import {AudioSection} from './AudioSection';
import {RagamalaFrame} from './RagamalaFrame';

interface SeasonalRagasSectionProps {
  seasonalRagas: SeasonalRaga[];
}

export function SeasonalRagasSection({
  seasonalRagas,
}: SeasonalRagasSectionProps) {
  if (seasonalRagas.length === 0) {
    return null;
  }

  return (
    <section
      id="seasonal-ragas"
      aria-labelledby="seasonal-ragas-heading"
      className="space-y-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#C89B54]/15 pb-4">
        <div>
          <p className="text-xs font-medium tracking-widest text-[#C89B54] uppercase">
            Ritu Ragas
          </p>
          <h2
            id="seasonal-ragas-heading"
            className="mt-1 font-serif text-3xl font-medium text-[#FAF3E6] sm:text-4xl"
          >
            Seasonal Ragas
          </h2>
        </div>
        <p className="max-w-xl text-sm text-[#B6AA99]">
          Beyond the daily eight-prahar cycle, monsoon and spring ragas belong to specific seasons and may be performed across hours during their ritu.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {seasonalRagas.map((item) => (
          <article
            key={`${item.season}-${item.raga}`}
            className="flex flex-col gap-5 rounded-xl border border-[#C89B54]/20 bg-[#130E0C]/85 p-4 sm:p-6"
          >
            <div className="space-y-1 border-b border-[#C89B54]/15 pb-3">
              <p className="text-xs font-medium tracking-wider text-[#C89B54] uppercase">
                {item.season}
              </p>
              <h3 className="font-serif text-3xl font-medium text-[#FAF3E6]">
                {item.raga}
              </h3>
            </div>

            <RagamalaFrame artwork={item.artwork} subtitle={item.season} />

            <AudioSection audio={item.audio} ragaName={item.raga} />
          </article>
        ))}
      </div>
    </section>
  );
}
