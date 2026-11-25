import {useCallback, useEffect, useState} from 'react';
import type {PraharDataset} from '../types/prahar';
import {parsePraharDataset} from '../utils/dataParser';

export interface UsePraharDataResult {
  data: PraharDataset | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const DEFAULT_DATA_PATH = 'assets/aistudio/details_3be763b5.json';

export function resolvePraharDataUrl(): string {
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${DEFAULT_DATA_PATH}`;
}

export function usePraharData(): UsePraharDataResult {
  const [data, setData] = useState<PraharDataset | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState<number>(0);

  const refetch = useCallback(() => {
    setReloadToken((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(resolvePraharDataUrl(), {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Unable to load prahar archive (${response.status})`);
        }
        const rawJson: unknown = await response.json();
        const parsed = parsePraharDataset(rawJson);
        if (active) {
          setData(parsed);
        }
      } catch (err) {
        if (!active || (err instanceof DOMException && err.name === 'AbortError')) {
          return;
        }
        const message =
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while loading the prahar archive.';
        setError(message);
        setData(null);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
      controller.abort();
    };
  }, [reloadToken]);

  return {data, isLoading, error, refetch};
}
