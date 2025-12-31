// Category: drawings, doghead comics, other comics

export interface IArtwork {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  category: string;
  date: Date;
}

export interface IUploadPayload {
  file: File;
  title: string;
  description?: string;
  category: string;
  date: Date;
}

export interface IArtworksQuery {
  category?: string;
}
