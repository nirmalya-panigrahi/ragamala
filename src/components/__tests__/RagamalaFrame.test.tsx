import {fireEvent, render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {RagamalaFrame} from '../RagamalaFrame';

describe('RagamalaFrame', () => {
  const sampleArtwork = {
    title: 'Bhairava Raga, Ragamala, Chunar, 1591',
    school_origin: 'Mughal / Chunar (near Varanasi), 1591',
    commons_page:
      'https://commons.wikimedia.org/wiki/File:Bhairava_raga,_Ragamala,_Chunar,_1591.jpg',
    direct_image_url:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Bhairava_raga,_Ragamala,_Chunar,_1591.jpg',
    license: 'Public Domain (PD-Art)',
    credit: 'Victoria and Albert Museum / Wikimedia Commons',
  };

  it('renders fallback with title and Wikimedia Commons link on image error', () => {
    render(<RagamalaFrame artwork={sampleArtwork} />);

    const img = screen.getByRole('img', {
      name: /Bhairava Raga, Ragamala, Chunar, 1591/i,
    });
    fireEvent.error(img);

    expect(
      screen.getByRole('link', {name: /View on Wikimedia Commons/i})
    ).toHaveAttribute('href', sampleArtwork.commons_page);
  });
});
