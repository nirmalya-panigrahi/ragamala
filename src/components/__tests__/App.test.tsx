import {fireEvent, render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import datasetJson from '../../../public/assets/aistudio/details_3be763b5.json';
import App from '../../App';

function mockSuccessfulFetch(payload: unknown = datasetJson) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => payload,
  } as Response);
}

describe('Astha prahar App — Blue Pill (Integration Flows)', () => {
  beforeEach(() => {
    vi.useFakeTimers({toFake: ['Date']});
    // 08:30 local time -> Dwitiya Prahar (07:00 - 10:00, Raga Bhairavi)
    vi.setSystemTime(new Date(2026, 10, 25, 8, 30, 15));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('loads the active local prahar, displays its Ragamala artwork, metadata, and audio player', async () => {
    mockSuccessfulFetch();
    render(<App />);

    expect(screen.getByRole('status')).toBeInTheDocument();

    const stage = await screen.findByRole('region', {name: /Raga Bhairavi/i});
    expect(stage).toBeInTheDocument();
    expect(within(stage).getByText('Dwitiya Prahar (Morning)')).toBeInTheDocument();
    expect(within(stage).getByText('Ma / Sa')).toBeInTheDocument();
    expect(
      within(stage).getByText(/Bhairavi Ragini, Bundi School/i)
    ).toBeInTheDocument();
    expect(
      within(stage).getByText(/Yale University Art Gallery \/ Wikimedia Commons/i)
    ).toBeInTheDocument();

    const audioEl = within(stage).getByLabelText(/Play Art song from Meerut/i);
    expect(audioEl.tagName).toBe('AUDIO');
    expect(audioEl).toHaveAttribute(
      'src',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Art_song_from_Meerut_Raga_Bhairavi_(1931).ogg'
    );
  });

  it('allows inspecting another prahar via the 8-card grid and returning via Jump to Now', async () => {
    const user = userEvent.setup();
    mockSuccessfulFetch();
    render(<App />);

    await screen.findByRole('region', {name: /Raga Bhairavi/i});

    const grid = screen.getByRole('region', {name: /All Eight Prahars/i});
    const puriyaCard = within(grid).getByRole('button', {
      name: /Puriya Dhanashree/i,
    });
    await user.click(puriyaCard);

    const stage = await screen.findByRole('region', {
      name: /Raga Puriya Dhanashree/i,
    });
    expect(within(stage).getAllByText('16:00 - 19:00').length).toBeGreaterThan(0);
    expect(within(stage).getByText('Selected Time Slot')).toBeInTheDocument();
    expect(
      within(stage).getByLabelText(/Play Rag Puriya Dhanashree - NCERT/i)
    ).toHaveAttribute(
      'src',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Rag_Puriya_Dhanashree_-_NCERT.ogg'
    );

    const jumpButtons = screen.getAllByRole('button', {name: /Jump to Now/i});
    await user.click(jumpButtons[0]);

    await screen.findByRole('region', {name: /Raga Bhairavi/i});
  });

  it('cycles prahars using Previous and Next buttons and renders refined Seasonal Ragas', async () => {
    const user = userEvent.setup();
    mockSuccessfulFetch();
    render(<App />);

    await screen.findByRole('region', {name: /Raga Bhairavi/i});

    await user.click(screen.getByRole('button', {name: /Next prahar/i}));
    const sarangStage = await screen.findByRole('region', {name: /Raga Sarang/i});
    expect(
      within(sarangStage).getByText(/Raga Sarang \(Deccani Ragamala/i)
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', {name: /Previous prahar/i}));
    await screen.findByRole('region', {name: /Raga Bhairavi/i});

    const seasonal = screen.getByRole('region', {name: /Seasonal Ragas/i});
    expect(within(seasonal).getByText('Megh Malhar')).toBeInTheDocument();
    expect(within(seasonal).getByText('Basant')).toBeInTheDocument();
    expect(
      within(seasonal).getByLabelText(/Play Rag Basant - NCERT/i)
    ).toHaveAttribute(
      'src',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Rag_Basant_-_NCERT.ogg'
    );
  });

  it('resolves overnight and late-night prahars (23:45 -> Malkauns, 02:15 -> Sohini)', async () => {
    vi.setSystemTime(new Date(2026, 10, 25, 23, 45, 0));
    mockSuccessfulFetch();
    const {unmount} = render(<App />);

    const midnightStage = await screen.findByRole('region', {
      name: /Raga Malkauns/i,
    });
    expect(within(midnightStage).getByText('Active Local Prahar')).toBeInTheDocument();
    unmount();

    vi.setSystemTime(new Date(2026, 10, 25, 2, 15, 0));
    mockSuccessfulFetch();
    render(<App />);

    const preDawnStage = await screen.findByRole('region', {
      name: /Raga Sohini/i,
    });
    expect(within(preDawnStage).getByText('Dha / Ga')).toBeInTheDocument();
    expect(
      within(preDawnStage).getByLabelText(/Play Sohini Qawwali/i)
    ).toHaveAttribute(
      'src',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Sohini_Qawwali.ogg'
    );
  });
});

describe('Astha prahar App — Red Pill (Fallbacks, Null Audio, Errors)', () => {
  beforeEach(() => {
    vi.useFakeTimers({toFake: ['Date']});
    // 05:15 local time -> Pratham Prahar (Lalit)
    vi.setSystemTime(new Date(2026, 10, 25, 5, 15, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders transparent null-audio state with notes and source_page link without inventing an <audio> URL', async () => {
    const datasetWithNullAudio = {
      ...datasetJson,
      prahars: datasetJson.prahars.map((p, idx) =>
        idx === 0
          ? {
              ...p,
              audio: {
                title: 'Archival Reference Only',
                source_page: 'https://archive.org/details/example-item',
                direct_audio_url: null,
                license: 'CC BY-NC 4.0',
                credit: 'Archival Collection',
                notes: 'Direct audio stream intentionally omitted for test.',
              },
            }
          : p
      ),
    };

    mockSuccessfulFetch(datasetWithNullAudio);
    render(<App />);

    const stage = await screen.findByRole('region', {name: /Raga Lalit/i});
    expect(stage.querySelector('audio')).toBeNull();
    expect(
      within(stage).getByText(/Direct stream not attached yet/i)
    ).toBeInTheDocument();
    expect(
      within(stage).getByText(/Direct audio stream intentionally omitted for test/i)
    ).toBeInTheDocument();

    const sourceLink = within(stage).getByRole('link', {
      name: /Open archival source/i,
    });
    expect(sourceLink).toHaveAttribute(
      'href',
      'https://archive.org/details/example-item'
    );
  });

  it('handles placeholder audio titles and null metadata without crashing or rendering broken links', async () => {
    const datasetWithPlaceholderAudio = {
      ...datasetJson,
      prahars: datasetJson.prahars.map((p, idx) =>
        idx === 0
          ? {
              ...p,
              audio: {
                title: 'NO_VERIFIED_FREESOUND_OR_ARCHIVE_MATCH',
                source_page: null,
                direct_audio_url: null,
                license: null,
                credit: null,
                notes: 'Placeholder reference record.',
              },
            }
          : p
      ),
    };

    mockSuccessfulFetch(datasetWithPlaceholderAudio);
    render(<App />);

    const stage = await screen.findByRole('region', {name: /Raga Lalit/i});
    expect(stage.querySelector('audio')).toBeNull();
    expect(
      within(stage).getByText(/Direct stream not attached yet/i)
    ).toBeInTheDocument();
    expect(
      within(stage).queryByText('NO_VERIFIED_FREESOUND_OR_ARCHIVE_MATCH')
    ).not.toBeInTheDocument();
    expect(
      within(stage).queryByRole('link', {name: /Open archival source/i})
    ).not.toBeInTheDocument();
  });

  it('displays artwork title and Commons link fallback when a Ragamala image fails to load', async () => {
    mockSuccessfulFetch();
    render(<App />);

    const stage = await screen.findByRole('region', {name: /Raga Lalit/i});
    const img = within(stage).getByRole('img', {
      name: /Bhairava Raga, Ragamala, Chunar, 1591/i,
    });

    fireEvent.error(img);

    const fallbackLink = await within(stage).findByRole('link', {
      name: /View on Wikimedia Commons/i,
    });
    expect(fallbackLink).toHaveAttribute(
      'href',
      'https://commons.wikimedia.org/wiki/File:Bhairava_raga,_Ragamala,_Chunar,_1591.jpg'
    );
  });

  it('renders an explicit error state on fetch failure and recovers when Retry is clicked', async () => {
    const user = userEvent.setup();
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => datasetJson,
      } as Response);

    render(<App />);

    const alert = await screen.findByRole('alert');
    expect(
      within(alert).getByText(/Unable to load the prahar archive/i)
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', {name: /Retry/i}));

    await screen.findByRole('region', {name: /Raga Lalit/i});
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it('renders an explicit empty state when the archive contains zero prahars', async () => {
    mockSuccessfulFetch({
      project: 'RaagChakra',
      prahars: [],
      seasonal_bonus_ragas: [],
    });

    render(<App />);

    await screen.findByText(/No prahars available in archive/i);
  });
});
