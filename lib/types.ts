
export type Version = {
  id: string;
  timestamp: number;
  content: string;
  summary?: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  versions: Version[];
};
