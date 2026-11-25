import {describe, expect, it} from 'vitest';
import datasetJson from '../../../public/assets/aistudio/details_3be763b5.json';
import {isPlaceholderAudioTitle, parsePraharDataset} from '../dataParser';

describe('dataParser — Blue Pill (Happy Path)', () => {
  it('parses the refined JSON dataset verbatim with 8 prahars and 2 seasonal ragas', () => {
    const parsed = parsePraharDataset(datasetJson);
    expect(parsed.project).toBe('RaagChakra — A 24-Hour Indian Classical Raga Clock');
    expect(parsed.prahars).toHaveLength(8);
    expect(parsed.seasonal_bonus_ragas).toHaveLength(2);

    expect(parsed.prahars[0].primary_raga).toBe('Lalit');
    expect(parsed.prahars[0].audio.direct_audio_url).toContain('Rag_Lalit_-_NCERT.ogg');
    expect(parsed.prahars[1].primary_raga).toBe('Bhairavi');
    expect(parsed.prahars[1].audio.direct_audio_url).toContain('Art_song_from_Meerut');
    expect(parsed.prahars[2].primary_raga).toBe('Sarang');
    expect(parsed.prahars[4].primary_raga).toBe('Puriya Dhanashree');
    expect(parsed.prahars[5].primary_raga).toBe('Kedar');
    expect(parsed.prahars[6].time_range).toBe('22:00 - 01:00');
    expect(parsed.prahars[7].primary_raga).toBe('Sohini');
  });

  it('detects placeholder archival audio titles accurately', () => {
    expect(isPlaceholderAudioTitle('NO_VERIFIED_FREESOUND_OR_ARCHIVE_MATCH')).toBe(true);
    expect(isPlaceholderAudioTitle('AUDIO_URL_NEEDED')).toBe(true);
    expect(isPlaceholderAudioTitle('  ')).toBe(true);
    expect(isPlaceholderAudioTitle('Rag Desi - NCERT')).toBe(false);
  });
});

describe('dataParser — Red Pill (Adversarial & Malformed Inputs)', () => {
  it('throws on non-object or missing prahars array', () => {
    expect(() => parsePraharDataset(null)).toThrow();
    expect(() => parsePraharDataset([])).toThrow();
    expect(() => parsePraharDataset({project: 'Bad'})).toThrow();
  });

  it('throws on invalid start_hour or missing artwork URL', () => {
    const brokenHour = {
      project: 'Test',
      prahars: [
        {
          ...datasetJson.prahars[0],
          start_hour: 26,
        },
      ],
    };
    expect(() => parsePraharDataset(brokenHour)).toThrow();

    const brokenArtwork = {
      project: 'Test',
      prahars: [
        {
          ...datasetJson.prahars[0],
          artwork: {
            title: 'Missing URL',
            commons_page: 'https://commons.wikimedia.org/wiki/Example',
            license: 'Public Domain',
          },
        },
      ],
    };
    expect(() => parsePraharDataset(brokenArtwork)).toThrow();
  });

  it('throws when direct_audio_url is a non-string, non-null type', () => {
    const brokenAudio = {
      project: 'Test',
      prahars: [
        {
          ...datasetJson.prahars[0],
          audio: {
            title: 'Bad Audio',
            direct_audio_url: 12345,
          },
        },
      ],
    };
    expect(() => parsePraharDataset(brokenAudio)).toThrow();
  });
});
