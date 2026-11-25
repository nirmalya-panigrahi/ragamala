import {AlertCircle, RefreshCw} from 'lucide-react';

interface StatusViewProps {
  mode: 'loading' | 'error' | 'empty';
  errorMessage?: string | null;
  onRetry?: () => void;
}

export function StatusView({mode, errorMessage, onRetry}: StatusViewProps) {
  if (mode === 'loading') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="h-96 animate-pulse rounded-lg border border-[#C89B54]/15 bg-[#16100E] lg:col-span-5" />
          <div className="space-y-4 lg:col-span-7">
            <div className="h-8 w-48 animate-pulse rounded bg-[#1E1613]" />
            <div className="h-14 w-3/4 animate-pulse rounded bg-[#1E1613]" />
            <div className="h-44 animate-pulse rounded-lg border border-[#C89B54]/15 bg-[#16100E]" />
          </div>
        </div>
        <span className="sr-only">Loading Astha prahar archive...</span>
      </div>
    );
  }

  return (
    <div
      role={mode === 'error' ? 'alert' : 'status'}
      className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6"
    >
      <div className="rounded-lg border border-[#C89B54]/30 bg-[#16100E] p-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#C89B54]/30 bg-[#1F1612] text-[#F2B866]">
          <AlertCircle className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2 className="font-serif text-2xl font-medium text-[#F7F1E5]">
          {mode === 'error'
            ? 'Unable to load the prahar archive'
            : 'No prahars available in archive'}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#BFB3A2]">
          {mode === 'error'
            ? errorMessage || 'The Ragamala and raga archive file could not be read.'
            : 'The loaded dataset contains no prahar records to display.'}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[#C89B54]/45 bg-[#221914] px-5 py-2.5 text-sm font-medium text-[#F5E6CC] transition-colors hover:border-[#F2B866] hover:bg-[#2C2019] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B866]"
          >
            <RefreshCw className="h-4 w-4 text-[#F2B866]" aria-hidden="true" />
            <span>Retry</span>
          </button>
        )}
      </div>
    </div>
  );
}
