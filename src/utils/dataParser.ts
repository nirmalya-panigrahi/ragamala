import type {Artwork, AudioTrack, Prahar, PraharDataset, SeasonalRaga} from '../types/prahar';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asRequiredString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Invalid or missing string field: ${fieldName}`);
  }
  return value;
}

function asOptionalNullableString(value: unknown): string | null | undefined {
  if (value === undefined || value === null) {
    return value;
  }
  if (typeof value === 'string') {
    return value;
  }
  return null;
}

function asValidHour(value: unknown, fieldName: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value >= 24) {
    throw new Error(`Invalid hour value for ${fieldName}`);
  }
  return value;
}

function parseArtwork(raw: unknown, context: string): Artwork {
  if (!isRecord(raw)) {
    throw new Error(`Missing artwork object for ${context}`);
  }
  return {
    title: asRequiredString(raw.title, `${context}.artwork.title`),
    school_origin:
      typeof raw.school_origin === 'string' ? raw.school_origin : undefined,
    commons_page: asRequiredString(raw.commons_page, `${context}.artwork.commons_page`),
    direct_image_url: asRequiredString(
      raw.direct_image_url,
      `${context}.artwork.direct_image_url`
    ),
    license: asRequiredString(raw.license, `${context}.artwork.license`),
    credit: typeof raw.credit === 'string' ? raw.credit : undefined,
    note: typeof raw.note === 'string' ? raw.note : undefined,
  };
}

function parseAudio(raw: unknown, context: string): AudioTrack {
  if (!isRecord(raw)) {
    throw new Error(`Missing audio object for ${context}`);
  }

  const directUrl = raw.direct_audio_url;
  if (directUrl !== null && directUrl !== undefined && typeof directUrl !== 'string') {
    throw new Error(`Invalid direct_audio_url for ${context}`);
  }

  return {
    title: typeof raw.title === 'string' ? raw.title : 'Archival Reference',
    source_page: asOptionalNullableString(raw.source_page),
    commons_page: asOptionalNullableString(raw.commons_page),
    direct_audio_url: typeof directUrl === 'string' && directUrl.trim().length > 0 ? directUrl : null,
    license: asOptionalNullableString(raw.license),
    credit: asOptionalNullableString(raw.credit),
    notes: asOptionalNullableString(raw.notes),
  };
}

function parsePrahar(raw: unknown, index: number): Prahar {
  if (!isRecord(raw)) {
    throw new Error(`Invalid prahar entry at index ${index}`);
  }

  const id = typeof raw.id === 'number' && Number.isFinite(raw.id) ? raw.id : index + 1;
  const context = `prahar[${id}]`;

  const alternateRagas = Array.isArray(raw.alternate_ragas)
    ? raw.alternate_ragas.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];

  return {
    id,
    prahar_name: asRequiredString(raw.prahar_name, `${context}.prahar_name`),
    time_range: asRequiredString(raw.time_range, `${context}.time_range`),
    start_hour: asValidHour(raw.start_hour, `${context}.start_hour`),
    end_hour: asValidHour(raw.end_hour, `${context}.end_hour`),
    primary_raga: asRequiredString(raw.primary_raga, `${context}.primary_raga`),
    alternate_ragas: alternateRagas,
    thaat: asRequiredString(raw.thaat, `${context}.thaat`),
    vadi_samvadi: asRequiredString(raw.vadi_samvadi, `${context}.vadi_samvadi`),
    mood_rasa: asRequiredString(raw.mood_rasa, `${context}.mood_rasa`),
    artwork: parseArtwork(raw.artwork, context),
    audio: parseAudio(raw.audio, context),
  };
}

function parseSeasonalRaga(raw: unknown, index: number): SeasonalRaga {
  if (!isRecord(raw)) {
    throw new Error(`Invalid seasonal raga at index ${index}`);
  }

  const context = `seasonal[${index}]`;
  return {
    season: asRequiredString(raw.season, `${context}.season`),
    raga: asRequiredString(raw.raga, `${context}.raga`),
    artwork: parseArtwork(raw.artwork, context),
    audio: parseAudio(raw.audio, context),
  };
}

export function parsePraharDataset(raw: unknown): PraharDataset {
  if (!isRecord(raw)) {
    throw new Error('Prahar dataset must be a valid JSON object.');
  }

  if (!Array.isArray(raw.prahars)) {
    throw new Error('Prahar dataset is missing the prahars array.');
  }

  const prahars = raw.prahars.map((entry, idx) => parsePrahar(entry, idx));
  const seasonal = Array.isArray(raw.seasonal_bonus_ragas)
    ? raw.seasonal_bonus_ragas.map((entry, idx) => parseSeasonalRaga(entry, idx))
    : [];

  return {
    project: typeof raw.project === 'string' ? raw.project : 'Astha prahar',
    note_for_builder:
      typeof raw.note_for_builder === 'string' ? raw.note_for_builder : undefined,
    prahars,
    seasonal_bonus_ragas: seasonal,
  };
}

/**
 * Formats audio placeholder tokens from the archive JSON into clean UI labels
 * without fabricating external URLs or hiding notes.
 */
export function isPlaceholderAudioTitle(title: string): boolean {
  const normalized = title.trim().toUpperCase();
  return (
    normalized === 'NO_VERIFIED_FREESOUND_OR_ARCHIVE_MATCH' ||
    normalized === 'AUDIO_URL_NEEDED' ||
    normalized.length === 0
  );
}
