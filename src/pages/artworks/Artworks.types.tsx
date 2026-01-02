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
  imageURL?: string;
  file: File;
  title: string;
  description?: string;
  category: string;
  date: Date;
}

export interface IUpdatePayload {
  id: string;
  title: string;
  description?: string;
  category: string;
  date: Date;
  file?: File;
  imageURL: string;
}

export interface IArtworksQuery {
  category: string;
}
