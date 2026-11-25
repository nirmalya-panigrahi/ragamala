import type {Prahar, PraharAtmosphere} from '../types/prahar';
import {CLASSICAL_TIMING_GUIDELINE} from '../utils/themeUtils';
import {AudioSection} from './AudioSection';
import {RagamalaFrame} from './RagamalaFrame';

interface ActivePraharStageProps {
  prahar: Prahar;
  isLivePrahar: boolean;
  atmosphere: PraharAtmosphere;
}

export function ActivePraharStage({
  prahar,
  isLivePrahar,
  atmosphere,
}: ActivePraharStageProps) {
  return (
    <section
      id="stage"
      aria-labelledby="stage-raga-heading"
      className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10"
    >
      <div className="lg:col-span-5">
        <RagamalaFrame
          artwork={prahar.artwork}
          subtitle={`Ragamala Folio · Prahar 0${prahar.id}`}
        />
      </div>

      <div className="space-y-6 lg:col-span-7">
        <header className="space-y-2 border-b border-[#C89B54]/20 pb-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium tracking-wider text-[#C89B54] uppercase">
            <span className="tabular-nums">{prahar.time_range}</span>
            <span aria-hidden="true">·</span>
            <span>{prahar.prahar_name}</span>
            <span aria-hidden="true">·</span>
            <span className={atmosphere.accentTextClass}>
              {isLivePrahar ? 'Active Local Prahar' : 'Selected Time Slot'}
            </span>
          </div>

          <h2
            id="stage-raga-heading"
            className="font-serif text-4xl leading-tight font-semibold tracking-tight text-[#FAF3E6] sm:text-5xl"
          >
            Raga {prahar.primary_raga}
          </h2>
          <p className="text-base leading-relaxed text-[#D8CEBF]">
            {prahar.mood_rasa}
          </p>
        </header>

        <dl className="grid grid-cols-1 gap-4 border-b border-[#C89B54]/20 pb-6 sm:grid-cols-3">
          <div>
            <dt className="text-xs tracking-wider text-[#9E9180] uppercase">
              Thaat
            </dt>
            <dd className="mt-1 font-serif text-xl font-medium text-[#F6EFE2]">
              {prahar.thaat}
            </dd>
          </div>

          <div>
            <dt className="text-xs tracking-wider text-[#9E9180] uppercase">
              Vadi / Samvadi
            </dt>
            <dd className="mt-1 font-serif text-xl font-medium text-[#F6EFE2]">
              {prahar.vadi_samvadi}
            </dd>
          </div>

          <div>
            <dt className="text-xs tracking-wider text-[#9E9180] uppercase">
              Prahar Window
            </dt>
            <dd className="mt-1 font-serif text-xl font-medium text-[#F6EFE2] tabular-nums">
              {prahar.time_range}
            </dd>
          </div>
        </dl>

        <div className="space-y-2.5">
          <h3 className="font-sans text-xs font-medium tracking-wider text-[#9E9180] uppercase">
            Alternate Ragas for This Prahar
          </h3>
          <ul className="flex flex-wrap gap-2" aria-label="Alternate ragas">
            {prahar.alternate_ragas.map((raga) => (
              <li
                key={raga}
                className="rounded-sm border border-[#C89B54]/25 bg-[#19120F] px-3 py-1.5 text-sm text-[#EDE2D0]"
              >
                {raga}
              </li>
            ))}
          </ul>
        </div>

        <AudioSection audio={prahar.audio} ragaName={prahar.primary_raga} />

        <p className="border-y border-[#C89B54]/15 py-3.5 text-xs leading-relaxed text-[#A89C8C]">
          {CLASSICAL_TIMING_GUIDELINE}
        </p>
      </div>
    </section>
  );
}
