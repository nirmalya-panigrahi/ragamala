import {useEffect, useState} from 'react';
import {ExternalLink, ImageOff} from 'lucide-react';
import type {Artwork} from '../types/prahar';

interface RagamalaFrameProps {
  artwork: Artwork;
  subtitle?: string;
}

export function RagamalaFrame({artwork, subtitle}: RagamalaFrameProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [artwork.direct_image_url]);

  return (
    <figure className="rounded-lg border border-[#C89B54]/30 bg-[#15100D] p-3 sm:p-4">
      <div className="rounded border border-[#C89B54]/20 bg-[#0F0B09] p-2 sm:p-3">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#120D0A]">
          {!hasError ? (
            <>
              {!isLoaded && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 animate-pulse bg-gradient-to-b from-[#1E1612] to-[#120D0A]"
                />
              )}
              <img
                src={artwork.direct_image_url}
                alt={`${artwork.title}${artwork.school_origin ? ` — ${artwork.school_origin}` : ''}`}
                referrerPolicy="no-referrer"
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                  setHasError(true);
                  setIsLoaded(true);
                }}
                className={`h-full w-full object-contain transition-opacity duration-300 ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#1C1410] via-[#130E0B] to-[#0C0908] p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C89B54]/30 bg-[#1A130F] text-[#C89B54]">
                <ImageOff className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="max-w-xs space-y-2">
                <p className="font-serif text-xl font-medium text-[#F4EFE6]">
                  {artwork.title}
                </p>
                {artwork.school_origin && (
                  <p className="text-xs text-[#B6AA99]">{artwork.school_origin}</p>
                )}
                <p className="text-xs leading-relaxed text-[#9C9080]">
                  The direct folio preview could not be loaded here. You can inspect the original archival painting on Wikimedia Commons.
                </p>
              </div>
              <a
                href={artwork.commons_page}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded border border-[#C89B54]/40 bg-[#1D1510] px-4 py-2 text-xs font-medium text-[#F2B866] transition-colors hover:border-[#F2B866] hover:bg-[#271C15] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B866]"
              >
                <span>View on Wikimedia Commons</span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      </div>

      <figcaption className="mt-4 space-y-2 px-1">
        {subtitle && (
          <p className="text-xs font-medium tracking-wider text-[#C89B54] uppercase">
            {subtitle}
          </p>
        )}
        <h3 className="font-serif text-xl leading-snug font-medium text-[#F7F1E5]">
          {artwork.title}
        </h3>
        {artwork.school_origin && (
          <p className="text-sm text-[#CFC5B4]">{artwork.school_origin}</p>
        )}
        {artwork.note && (
          <p className="text-xs leading-relaxed text-[#A79B8B] italic">
            {artwork.note}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-[#C89B54]/15 pt-3 text-xs text-[#B6AA99]">
          <p className="leading-relaxed">
            {artwork.credit ? `${artwork.credit} · ` : ''}
            <span className="text-[#E6D5B8]">{artwork.license}</span>
          </p>
          <a
            href={artwork.commons_page}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[36px] items-center gap-1.5 text-[#E8BC72] underline decoration-[#C89B54]/40 underline-offset-4 transition-colors hover:text-[#F8D08B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B866]"
          >
            <span>Commons folio</span>
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </figcaption>
    </figure>
  );
}
