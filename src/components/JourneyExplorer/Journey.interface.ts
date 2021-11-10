export interface Journey {
  path: string;
}

export interface JourneyDTO {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

export interface RawJourney {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  photos: RawPhoto[];
}

export interface ProcessedJourney extends RawJourney {
  thumbNailPath: string;
}

export interface RawPhoto {
  id: number;
  filename: string;
  latitude: number;
  longitude: number;
  modifyDate: string;
  path: string;
}

export const photos = [
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
  { path: "/images/IMG_0050.JPG" },
];
