import {ChevronLeft, ChevronRight, RotateCcw} from 'lucide-react';
import type {Prahar, PraharAtmosphere} from '../types/prahar';
import {
  describeArcSector,
  formatClockReadout,
  getDialHandEndpoint,
  hourToDialAngle,
  polarToCartesian,
} from '../utils/timeUtils';

interface PraharDialProps {
  prahars: Prahar[];
  selectedPrahar: Prahar;
  livePrahar: Prahar | null;
  currentDate: Date;
  atmosphere: PraharAtmosphere;
  onSelectPrahar: (id: number) => void;
  onPrevPrahar: () => void;
  onNextPrahar: () => void;
  onJumpToNow: () => void;
}

const DIAL_CENTER = 210;
const SECTOR_INNER_R = 104;
const SECTOR_OUTER_R = 164;

export function PraharDial({
  prahars,
  selectedPrahar,
  livePrahar,
  currentDate,
  atmosphere,
  onSelectPrahar,
  onPrevPrahar,
  onNextPrahar,
  onJumpToNow,
}: PraharDialProps) {
  const clock = formatClockReadout(currentDate);
  const isViewingLive = livePrahar?.id === selectedPrahar.id;
  const handTip = getDialHandEndpoint(DIAL_CENTER, DIAL_CENTER, 156, currentDate);
  const handTail = getDialHandEndpoint(
    DIAL_CENTER,
    DIAL_CENTER,
    -24,
    currentDate
  );

  const boundaryHours = [4, 7, 10, 13, 16, 19, 22, 1];
  const all24Hours = Array.from({length: 24}, (_, hour) => hour);

  return (
    <section
      id="dial"
      aria-labelledby="dial-heading"
      className="grid grid-cols-1 items-center gap-8 rounded-xl border border-[#C89B54]/20 bg-[#130E0C]/85 p-5 sm:p-8 lg:grid-cols-12 lg:gap-10"
    >
      <div className="flex flex-col items-center lg:col-span-6">
        <div className="relative w-full max-w-[390px]">
          <svg
            viewBox="0 0 420 420"
            className="h-auto w-full select-none"
            role="img"
            aria-label="24-hour circular Ashtaprahar clock divided into eight 3-hour prahars"
          >
            {/* Outer architectural rings */}
            <circle
              cx={DIAL_CENTER}
              cy={DIAL_CENTER}
              r="184"
              fill="none"
              stroke="#C89B54"
              strokeOpacity="0.18"
              strokeWidth="1"
            />
            <circle
              cx={DIAL_CENTER}
              cy={DIAL_CENTER}
              r="168"
              fill="none"
              stroke="#C89B54"
              strokeOpacity="0.28"
              strokeWidth="0.75"
            />

            {/* 24-hour perimeter tick marks */}
            {all24Hours.map((hour) => {
              const isBoundary = boundaryHours.includes(hour);
              const angle = hourToDialAngle(hour);
              const inner = polarToCartesian(
                DIAL_CENTER,
                DIAL_CENTER,
                isBoundary ? 168 : 172,
                angle
              );
              const outer = polarToCartesian(
                DIAL_CENTER,
                DIAL_CENTER,
                isBoundary ? 181 : 177,
                angle
              );
              return (
                <line
                  key={`tick-${hour}`}
                  x1={inner.x}
                  y1={inner.y}
                  x2={outer.x}
                  y2={outer.y}
                  stroke="#C89B54"
                  strokeOpacity={isBoundary ? 0.72 : 0.3}
                  strokeWidth={isBoundary ? 1.5 : 1}
                />
              );
            })}

            {/* Boundary hour numerals (tabular-nums) */}
            {boundaryHours.map((hour) => {
              const angle = hourToDialAngle(hour);
              const pos = polarToCartesian(DIAL_CENTER, DIAL_CENTER, 196, angle);
              return (
                <text
                  key={`hour-label-${hour}`}
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#B6A894"
                  fontSize="11"
                  fontWeight="500"
                  className="tabular-nums"
                >
                  {String(hour).padStart(2, '0')}
                </text>
              );
            })}

            {/* 8 interactive Prahar sectors */}
            {prahars.map((prahar) => {
              const pathData = describeArcSector(
                DIAL_CENTER,
                DIAL_CENTER,
                SECTOR_INNER_R,
                SECTOR_OUTER_R,
                prahar.start_hour,
                prahar.end_hour,
                1.8
              );
              const isSelected = prahar.id === selectedPrahar.id;
              const isLive = prahar.id === livePrahar?.id;

              const spanHours =
                prahar.end_hour <= prahar.start_hour
                  ? prahar.end_hour + 24 - prahar.start_hour
                  : prahar.end_hour - prahar.start_hour;
              const midHour = (prahar.start_hour + spanHours / 2) % 24;
              const midPoint = polarToCartesian(
                DIAL_CENTER,
                DIAL_CENTER,
                134,
                hourToDialAngle(midHour)
              );

              const liveArcPath = isLive
                ? describeArcSector(
                    DIAL_CENTER,
                    DIAL_CENTER,
                    95,
                    100,
                    prahar.start_hour,
                    prahar.end_hour,
                    2.2
                  )
                : '';

              return (
                <g
                  key={prahar.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`${prahar.prahar_name}, ${prahar.time_range}, primary raga ${prahar.primary_raga}${isLive ? ' (current local time prahar)' : ''}`}
                  onClick={() => onSelectPrahar(prahar.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onSelectPrahar(prahar.id);
                    }
                  }}
                  className="cursor-pointer focus:outline-none"
                >
                  <path
                    d={pathData}
                    fill={isSelected ? atmosphere.accentHex : '#1F1713'}
                    fillOpacity={isSelected ? 0.24 : isLive ? 0.72 : 0.55}
                    stroke={
                      isSelected
                        ? atmosphere.accentHex
                        : isLive
                          ? '#C89B54'
                          : '#433429'
                    }
                    strokeOpacity={isSelected ? 0.95 : isLive ? 0.7 : 0.5}
                    strokeWidth={isSelected ? 1.75 : 1}
                    className="transition-colors duration-200 hover:fill-[#D98A3C]/30 hover:stroke-[#F2B866]"
                  />

                  {isLive && liveArcPath && (
                    <path
                      d={liveArcPath}
                      fill="#F2B866"
                      fillOpacity="0.9"
                      pointerEvents="none"
                    />
                  )}

                  <text
                    x={midPoint.x}
                    y={midPoint.y - 6}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isSelected ? '#FFF4E0' : '#D2C5B4'}
                    fontSize="11"
                    fontWeight={isSelected ? '700' : '500'}
                    pointerEvents="none"
                    className="tabular-nums"
                  >
                    {`0${prahar.id}`}
                  </text>
                  <text
                    x={midPoint.x}
                    y={midPoint.y + 8}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isSelected ? '#F5D399' : '#9C8E7C'}
                    fontSize="9.5"
                    pointerEvents="none"
                  >
                    {prahar.primary_raga.split(' ')[0]}
                  </text>
                </g>
              );
            })}

            {/* Inner dial frame */}
            <circle
              cx={DIAL_CENTER}
              cy={DIAL_CENTER}
              r="88"
              fill="#0E0A08"
              stroke="#C89B54"
              strokeOpacity="0.32"
              strokeWidth="1"
            />
            <circle
              cx={DIAL_CENTER}
              cy={DIAL_CENTER}
              r="81"
              fill="none"
              stroke="#C89B54"
              strokeOpacity="0.14"
              strokeWidth="0.75"
              strokeDasharray="2 4"
            />

            {/* Live local time clock hand */}
            <line
              x1={handTail.x}
              y1={handTail.y}
              x2={handTip.x}
              y2={handTip.y}
              stroke="#F2B866"
              strokeOpacity="0.92"
              strokeWidth="1.75"
              strokeLinecap="round"
              pointerEvents="none"
            />
            <circle
              cx={handTip.x}
              cy={handTip.y}
              r="4"
              fill="#F2B866"
              stroke="#0C0908"
              strokeWidth="1.25"
              pointerEvents="none"
            />

            {/* Center readout */}
            <circle
              cx={DIAL_CENTER}
              cy={DIAL_CENTER}
              r="72"
              fill="#0E0A08"
              fillOpacity="0.88"
              pointerEvents="none"
            />
            <text
              x={DIAL_CENTER}
              y={DIAL_CENTER - 22}
              textAnchor="middle"
              fill="#C89B54"
              fontSize="10"
              letterSpacing="1.8"
              pointerEvents="none"
            >
              LOCAL TIME
            </text>
            <text
              x={DIAL_CENTER}
              y={DIAL_CENTER + 4}
              textAnchor="middle"
              fill="#FAF3E6"
              fontSize="24"
              fontWeight="600"
              pointerEvents="none"
              className="tabular-nums"
            >
              {clock.time24}
            </text>
            <text
              x={DIAL_CENTER}
              y={DIAL_CENTER + 25}
              textAnchor="middle"
              fill="#B6A894"
              fontSize="11"
              pointerEvents="none"
              className="tabular-nums"
            >
              {`${clock.time12} · ${clock.dateLabel}`}
            </text>
          </svg>
        </div>
      </div>

      <div className="space-y-6 lg:col-span-6">
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-widest text-[#C89B54] uppercase">
            {atmosphere.periodLabel} · {atmosphere.glowDescription}
          </p>
          <h1
            id="dial-heading"
            className="font-serif text-4xl leading-tight font-medium tracking-tight text-[#FAF3E6] sm:text-5xl"
          >
            Eight Prahars of the Classical Day
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-[#C9BEB0] sm:text-base">
            Select any three-hour prahar on the 24-hour dial to explore its traditional Hindustani raga, Ragamala miniature painting, and archival recital recording.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 border-y border-[#C89B54]/20 py-4 sm:grid-cols-2">
          <div>
            <p className="text-xs tracking-wider text-[#9E9180] uppercase">
              Current Local Prahar
            </p>
            <p className="mt-1 font-serif text-xl font-medium text-[#F7EFE1]">
              {livePrahar ? livePrahar.primary_raga : 'Unavailable'}
            </p>
            <p className="mt-0.5 text-xs text-[#BFB3A2] tabular-nums">
              {livePrahar ? `${livePrahar.prahar_name} · ${livePrahar.time_range}` : ''}
            </p>
          </div>

          <div>
            <p className="text-xs tracking-wider text-[#9E9180] uppercase">
              Selected on Stage
            </p>
            <p className="mt-1 font-serif text-xl font-medium text-[#F2B866]">
              {selectedPrahar.primary_raga}
            </p>
            <p className="mt-0.5 text-xs text-[#BFB3A2] tabular-nums">
              {selectedPrahar.prahar_name} · {selectedPrahar.time_range}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onPrevPrahar}
            aria-label="Previous prahar"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[#C89B54]/30 bg-[#1B1410] px-4 py-2 text-sm font-medium text-[#EFE6D8] whitespace-nowrap shrink-0 transition-colors hover:border-[#C89B54] hover:bg-[#251B16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B866]"
          >
            <ChevronLeft className="h-4 w-4 text-[#C89B54]" aria-hidden="true" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={onNextPrahar}
            aria-label="Next prahar"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[#C89B54]/30 bg-[#1B1410] px-4 py-2 text-sm font-medium text-[#EFE6D8] whitespace-nowrap shrink-0 transition-colors hover:border-[#C89B54] hover:bg-[#251B16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B866]"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4 text-[#C89B54]" aria-hidden="true" />
          </button>

          {!isViewingLive && livePrahar && (
            <button
              type="button"
              onClick={onJumpToNow}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[#F2B866]/55 bg-[#2A1D12] px-4 py-2 text-sm font-medium text-[#FBE9CA] whitespace-nowrap shrink-0 transition-colors hover:border-[#F2B866] hover:bg-[#382617] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B866]"
            >
              <RotateCcw className="h-4 w-4 text-[#F2B866]" aria-hidden="true" />
              <span>Jump to Now</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
