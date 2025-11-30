export type TNote = {
  id: number;
  title: string;
  content: string;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type NoteFilter = {
  page?: number;
  limit?: number;
  search?: string;
}; 

export type NoteDto = {
  title: string;
  content: string;
  isPrivate: boolean;
};
