import {describe, expect, it} from 'vitest';
import datasetJson from '../../../public/assets/aistudio/details_3be763b5.json';
import {parsePraharDataset} from '../dataParser';
import {
  describeArcSector,
  formatClockReadout,
  getAdjacentPraharId,
  getPraharForDate,
  hourToDialAngle,
  isHourInPrahar,
} from '../timeUtils';

const dataset = parsePraharDataset(datasetJson);

describe('timeUtils — Blue Pill (Happy Path)', () => {
  it('matches daytime prahars accurately at start, midpoint, and just before end', () => {
    expect(isHourInPrahar(4, 4, 7)).toBe(true);
    expect(isHourInPrahar(5.5, 4, 7)).toBe(true);
    expect(isHourInPrahar(6.999, 4, 7)).toBe(true);
    expect(isHourInPrahar(7, 4, 7)).toBe(false);
  });

  it('handles overnight prahar wrap-around (22:00 - 01:00) cleanly', () => {
    expect(isHourInPrahar(22, 22, 1)).toBe(true);
    expect(isHourInPrahar(23.75, 22, 1)).toBe(true);
    expect(isHourInPrahar(0, 22, 1)).toBe(true);
    expect(isHourInPrahar(0.99, 22, 1)).toBe(true);
    expect(isHourInPrahar(1, 22, 1)).toBe(false);
    expect(isHourInPrahar(21.99, 22, 1)).toBe(false);
  });

  it('resolves the active prahar across all 8 windows from a Date object', () => {
    const sampleHours = [
      {hour: 4, expectedId: 1},
      {hour: 8, expectedId: 2},
      {hour: 11, expectedId: 3},
      {hour: 14, expectedId: 4},
      {hour: 17, expectedId: 5},
      {hour: 20, expectedId: 6},
      {hour: 23, expectedId: 7},
      {hour: 0, expectedId: 7},
      {hour: 2, expectedId: 8},
    ];

    for (const sample of sampleHours) {
      const date = new Date(2026, 10, 25, sample.hour, 30, 0);
      const matched = getPraharForDate(date, dataset.prahars);
      expect(matched?.id).toBe(sample.expectedId);
    }
  });

  it('computes SVG arc paths for both standard and overnight prahars', () => {
    const standardArc = describeArcSector(210, 210, 104, 164, 4, 7);
    const overnightArc = describeArcSector(210, 210, 104, 164, 22, 1);

    expect(standardArc.startsWith('M ')).toBe(true);
    expect(standardArc.endsWith('Z')).toBe(true);
    expect(overnightArc.startsWith('M ')).toBe(true);
    expect(overnightArc.endsWith('Z')).toBe(true);
  });

  it('wraps adjacent prahar navigation cleanly in both directions', () => {
    expect(getAdjacentPraharId(dataset.prahars, 1, 'prev')).toBe(8);
    expect(getAdjacentPraharId(dataset.prahars, 8, 'next')).toBe(1);
    expect(getAdjacentPraharId(dataset.prahars, 4, 'next')).toBe(5);
    expect(getAdjacentPraharId(dataset.prahars, 4, 'prev')).toBe(3);
  });

  it('maps 00:00 to top (-90 deg) and 12:00 to bottom (+90 deg)', () => {
    expect(hourToDialAngle(0)).toBe(-90);
    expect(hourToDialAngle(6)).toBe(0);
    expect(hourToDialAngle(12)).toBe(90);
    expect(hourToDialAngle(18)).toBe(180);
  });

  it('formats 24-hour clock readout cleanly with padded digits', () => {
    const formatted = formatClockReadout(new Date(2026, 10, 25, 7, 8, 5));
    expect(formatted.time24).toBe('07:08:05');
  });
});

describe('timeUtils — Red Pill (Adversarial & Edge Cases)', () => {
  it('rejects out-of-range, NaN, and Infinity hour inputs', () => {
    expect(isHourInPrahar(Number.NaN, 4, 7)).toBe(false);
    expect(isHourInPrahar(Infinity, 4, 7)).toBe(false);
    expect(isHourInPrahar(-0.1, 4, 7)).toBe(false);
    expect(isHourInPrahar(24, 4, 7)).toBe(false);
    expect(isHourInPrahar(5, -1, 7)).toBe(false);
    expect(isHourInPrahar(5, 4, 25)).toBe(false);
    expect(isHourInPrahar(5, 5, 5)).toBe(false);
  });

  it('handles invalid Date and empty prahars array gracefully', () => {
    expect(getPraharForDate(new Date('not-a-date'), dataset.prahars)).toBeNull();
    expect(getPraharForDate(new Date(), [])).toBeNull();
    expect(getAdjacentPraharId([], 1, 'next')).toBeNull();
    expect(formatClockReadout(new Date('invalid')).time24).toBe('--:--:--');
  });

  it('returns empty path for degenerate SVG sector radii or zero span', () => {
    expect(describeArcSector(210, 210, 100, 90, 4, 7)).toBe('');
    expect(describeArcSector(210, 210, 0, 100, 4, 7)).toBe('');
    expect(describeArcSector(210, 210, 100, 160, 4, 4, 500)).toBe('');
  });
});
