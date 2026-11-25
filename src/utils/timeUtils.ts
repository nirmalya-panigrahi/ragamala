import type {Prahar} from '../types/prahar';

export interface CartesianPoint {
  x: number;
  y: number;
}

export interface FormattedClock {
  time24: string;
  time12: string;
  dateLabel: string;
}

/**
 * Checks whether a 24-hour clock value falls within [startHour, endHour).
 * Properly handles overnight wrap-around windows where endHour < startHour
 * (for example, 22:00 - 01:00).
 */
export function isHourInPrahar(
  hour: number,
  startHour: number,
  endHour: number
): boolean {
  if (
    !Number.isFinite(hour) ||
    !Number.isFinite(startHour) ||
    !Number.isFinite(endHour)
  ) {
    return false;
  }

  if (hour < 0 || hour >= 24 || startHour < 0 || startHour >= 24 || endHour < 0 || endHour >= 24) {
    return false;
  }

  if (startHour === endHour) {
    return false;
  }

  if (startHour < endHour) {
    return hour >= startHour && hour < endHour;
  }

  // Overnight wrap (e.g., 22 -> 1)
  return hour >= startHour || hour < endHour;
}

/**
 * Returns the active Prahar matching the given local Date, or null if none match
 * or the date is invalid.
 */
export function getPraharForDate(
  date: Date,
  prahars: Prahar[]
): Prahar | null {
  if (!(date instanceof Date) || Number.isNaN(date.getTime()) || prahars.length === 0) {
    return null;
  }

  const fractionalHour =
    date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;

  return (
    prahars.find((prahar) =>
      isHourInPrahar(fractionalHour, prahar.start_hour, prahar.end_hour)
    ) ?? null
  );
}

/**
 * Maps an hour on a 24-hour clock [0, 24) to an SVG angle in degrees,
 * placing 00:00 (midnight) at the 12 o'clock top (-90 deg) and proceeding clockwise.
 */
export function hourToDialAngle(hourFloat: number): number {
  const normalized = ((hourFloat % 24) + 24) % 24;
  return (normalized / 24) * 360 - 90;
}

export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDegrees: number
): CartesianPoint {
  const radians = (angleDegrees * Math.PI) / 180;
  return {
    x: Number((cx + radius * Math.cos(radians)).toFixed(3)),
    y: Number((cy + radius * Math.sin(radians)).toFixed(3)),
  };
}

/**
 * Generates an SVG path string for an annular sector on the 24-hour dial.
 * Handles overnight wrap where endHour <= startHour cleanly.
 */
export function describeArcSector(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startHour: number,
  endHour: number,
  gapDegrees = 1.4
): string {
  const effectiveEnd = endHour <= startHour ? endHour + 24 : endHour;
  const startAngle = hourToDialAngle(startHour) + gapDegrees / 2;
  const endAngle = hourToDialAngle(startHour) + ((effectiveEnd - startHour) / 24) * 360 - gapDegrees / 2;

  const span = endAngle - startAngle;
  if (span <= 0 || innerRadius <= 0 || outerRadius <= innerRadius) {
    return '';
  }

  const largeArcFlag = span > 180 ? 1 : 0;

  const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerRadius, endAngle);
  const innerEnd = polarToCartesian(cx, cy, innerRadius, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle);

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
}

export function getDialHandEndpoint(
  cx: number,
  cy: number,
  radius: number,
  date: Date
): CartesianPoint {
  const safeDate =
    date instanceof Date && !Number.isNaN(date.getTime()) ? date : new Date(0);
  const hourFloat =
    safeDate.getHours() + safeDate.getMinutes() / 60 + safeDate.getSeconds() / 3600;
  return polarToCartesian(cx, cy, radius, hourToDialAngle(hourFloat));
}

export function formatClockReadout(date: Date): FormattedClock {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return {
      time24: '--:--:--',
      time12: '--:-- --',
      dateLabel: 'Invalid local time',
    };
  }

  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');

  const time12 = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const dateLabel = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return {
    time24: `${hh}:${mm}:${ss}`,
    time12,
    dateLabel,
  };
}

export function formatHourLabel(hour: number): string {
  const normalized = ((Math.floor(hour) % 24) + 24) % 24;
  return `${String(normalized).padStart(2, '0')}:00`;
}

export function getAdjacentPraharId(
  prahars: Prahar[],
  currentId: number,
  direction: 'prev' | 'next'
): number | null {
  if (prahars.length === 0) {
    return null;
  }

  const currentIndex = prahars.findIndex((p) => p.id === currentId);
  if (currentIndex === -1) {
    return prahars[0].id;
  }

  const offset = direction === 'next' ? 1 : -1;
  const nextIndex = (currentIndex + offset + prahars.length) % prahars.length;
  return prahars[nextIndex].id;
}
