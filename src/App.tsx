import {useEffect, useMemo, useState} from 'react';
import {ActivePraharStage} from './components/ActivePraharStage';
import {Header} from './components/Header';
import {PraharDial} from './components/PraharDial';
import {PraharGrid} from './components/PraharGrid';
import {SeasonalRagasSection} from './components/SeasonalRagasSection';
import {StatusView} from './components/StatusView';
import {SwarDivider} from './components/SwarDivider';
import {useLiveClock} from './hooks/useLiveClock';
import {usePraharData} from './hooks/usePraharData';
import {getPraharAtmosphere} from './utils/themeUtils';
import {getAdjacentPraharId, getPraharForDate} from './utils/timeUtils';

export default function App() {
  const {data, isLoading, error, refetch} = usePraharData();
  const currentDate = useLiveClock();
  const [selectedPraharId, setSelectedPraharId] = useState<number | null>(null);

  const prahars = useMemo(() => data?.prahars ?? [], [data]);
  const livePrahar = useMemo(
    () => getPraharForDate(currentDate, prahars),
    [currentDate, prahars]
  );

  useEffect(() => {
    if (prahars.length === 0) {
      return;
    }
    setSelectedPraharId((prev) => {
      if (prev !== null && prahars.some((p) => p.id === prev)) {
        return prev;
      }
      return livePrahar?.id ?? prahars[0].id;
    });
  }, [prahars, livePrahar]);

  const selectedPrahar = useMemo(() => {
    if (prahars.length === 0) {
      return null;
    }
    return (
      prahars.find((p) => p.id === selectedPraharId) ??
      livePrahar ??
      prahars[0]
    );
  }, [prahars, selectedPraharId, livePrahar]);

  const atmosphere = useMemo(
    () => getPraharAtmosphere(selectedPrahar ?? livePrahar),
    [selectedPrahar, livePrahar]
  );

  const isViewingLive =
    selectedPrahar !== null &&
    livePrahar !== null &&
    selectedPrahar.id === livePrahar.id;

  const handleJumpToNow = () => {
    if (livePrahar) {
      setSelectedPraharId(livePrahar.id);
    }
  };

  const handlePrevPrahar = () => {
    if (!selectedPrahar) return;
    const prevId = getAdjacentPraharId(prahars, selectedPrahar.id, 'prev');
    if (prevId !== null) {
      setSelectedPraharId(prevId);
    }
  };

  const handleNextPrahar = () => {
    if (!selectedPrahar) return;
    const nextId = getAdjacentPraharId(prahars, selectedPrahar.id, 'next');
    if (nextId !== null) {
      setSelectedPraharId(nextId);
    }
  };

  return (
    <div
      id="top"
      className={`relative min-h-screen bg-[#0C0908] text-[#F4EFE6] transition-colors duration-500 ${atmosphere.spotlightClass}`}
    >
      <Header
        isViewingLive={isViewingLive}
        onJumpToNow={handleJumpToNow}
        hasData={prahars.length > 0}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {isLoading && <StatusView mode="loading" />}

        {!isLoading && error && (
          <StatusView mode="error" errorMessage={error} onRetry={refetch} />
        )}

        {!isLoading && !error && prahars.length === 0 && (
          <StatusView mode="empty" onRetry={refetch} />
        )}

        {!isLoading && !error && selectedPrahar && (
          <>
            <PraharDial
              prahars={prahars}
              selectedPrahar={selectedPrahar}
              livePrahar={livePrahar}
              currentDate={currentDate}
              atmosphere={atmosphere}
              onSelectPrahar={setSelectedPraharId}
              onPrevPrahar={handlePrevPrahar}
              onNextPrahar={handleNextPrahar}
              onJumpToNow={handleJumpToNow}
            />

            <SwarDivider />

            <ActivePraharStage
              prahar={selectedPrahar}
              isLivePrahar={isViewingLive}
              atmosphere={atmosphere}
            />

            <SwarDivider />

            <PraharGrid
              prahars={prahars}
              selectedId={selectedPrahar.id}
              liveId={livePrahar?.id ?? null}
              onSelectPrahar={setSelectedPraharId}
            />

            {data && data.seasonal_bonus_ragas.length > 0 && (
              <>
                <SwarDivider />
                <SeasonalRagasSection
                  seasonalRagas={data.seasonal_bonus_ragas}
                />
              </>
            )}
          </>
        )}
      </main>

      <footer className="mt-16 border-t border-[#C89B54]/15 bg-[#0A0706]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-8 text-xs text-[#9C9080] sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <p className="font-serif text-base text-[#E4D8C4]">Astha prahar</p>
          <p className="leading-relaxed">
            Archival Ragamala paintings via Wikimedia Commons and public museum collections; audio links and licensing preserved verbatim from the dataset.
          </p>
        </div>
      </footer>
    </div>
  );
}
