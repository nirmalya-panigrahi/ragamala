export interface Artwork {
  title: string;
  school_origin?: string;
  commons_page: string;
  direct_image_url: string;
  license: string;
  credit?: string;
  note?: string;
}

export interface AudioTrack {
  title: string;
  source_page?: string | null;
  commons_page?: string | null;
  direct_audio_url: string | null;
  license?: string | null;
  credit?: string | null;
  notes?: string | null;
}

export interface Prahar {
  id: number;
  prahar_name: string;
  time_range: string;
  start_hour: number;
  end_hour: number;
  primary_raga: string;
  alternate_ragas: string[];
  thaat: string;
  vadi_samvadi: string;
  mood_rasa: string;
  artwork: Artwork;
  audio: AudioTrack;
}

export interface SeasonalRaga {
  season: string;
  raga: string;
  artwork: Artwork;
  audio: AudioTrack;
}

export interface PraharDataset {
  project: string;
  note_for_builder?: string;
  prahars: Prahar[];
  seasonal_bonus_ragas: SeasonalRaga[];
}

export interface PraharAtmosphere {
  periodLabel: string;
  spotlightClass: string;
  accentTextClass: string;
  accentHex: string;
  ringAccent: string;
  glowDescription: string;
}
