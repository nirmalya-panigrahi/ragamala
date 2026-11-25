import {ExternalLink, Music2, Volume2} from 'lucide-react';
import type {AudioTrack} from '../types/prahar';
import {isPlaceholderAudioTitle} from '../utils/dataParser';

interface AudioSectionProps {
  audio: AudioTrack;
  ragaName: string;
}

export function AudioSection({audio, ragaName}: AudioSectionProps) {
  const hasDirectAudio =
    typeof audio.direct_audio_url === 'string' &&
    audio.direct_audio_url.trim().length > 0;
  const externalSourceUrl = audio.source_page || audio.commons_page || null;
  const externalSourceLabel = audio.commons_page
    ? 'Open on Wikimedia Commons'
    : 'Open archival source';
  const showTitle = !isPlaceholderAudioTitle(audio.title);

  return (
    <section
      aria-label={`Audio and archival attribution for ${ragaName}`}
      className="rounded-lg border border-[#C89B54]/25 bg-[#16100D]/90 p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium tracking-wider text-[#C89B54] uppercase">
            {hasDirectAudio ? (
              <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Music2 className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span>
              {hasDirectAudio ? 'Archival Recital Stream' : 'Archival Audio Reference'}
            </span>
          </div>
          {showTitle ? (
            <h4 className="font-serif text-xl font-medium text-[#F6EFE2]">
              {audio.title}
            </h4>
          ) : (
            <h4 className="font-serif text-xl font-medium text-[#E5DAC8]">
              {ragaName} — Archival Recording Status
            </h4>
          )}
        </div>
      </div>

      {hasDirectAudio && audio.direct_audio_url ? (
        <div className="mt-4">
          <audio
            key={audio.direct_audio_url}
            controls
            preload="none"
            src={audio.direct_audio_url}
            aria-label={`Play ${audio.title}`}
            className="baithak-audio w-full rounded"
          >
            Your browser does not support embedded audio playback.
          </audio>
        </div>
      ) : (
        <div className="mt-4 rounded border border-[#C89B54]/20 bg-[#100C0A] p-3.5">
          <p className="text-sm font-medium text-[#E8C58E]">
            Direct stream not attached yet
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[#B6AA99]">
            No direct audio file is bundled for this slot. Refer to the archival notes and source record below for verified listening links.
          </p>
        </div>
      )}

      <div className="mt-4 space-y-2 border-t border-[#C89B54]/15 pt-3 text-xs leading-relaxed text-[#BFB3A2]">
        {(audio.credit || audio.license) && (
          <p>
            {audio.credit ? (
              <>
                <span className="text-[#9E9282]">Credit:</span>{' '}
                <span className="text-[#EFE6D8]">{audio.credit}</span>
              </>
            ) : null}
            {audio.credit && audio.license ? ' · ' : ''}
            {audio.license ? (
              <>
                <span className="text-[#9E9282]">License:</span>{' '}
                <span className="text-[#E6D5B8]">{audio.license}</span>
              </>
            ) : null}
          </p>
        )}

        {audio.notes && <p className="text-[#AEA292]">{audio.notes}</p>}

        {externalSourceUrl && (
          <div className="pt-1">
            <a
              href={externalSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center gap-2 rounded border border-[#C89B54]/35 bg-[#1D1510] px-3.5 py-2 text-xs font-medium text-[#F2B866] transition-colors hover:border-[#F2B866] hover:bg-[#261B15] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B866]"
            >
              <span>{externalSourceLabel}</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
