export type TNote = {
  id: number;
  title: string;
  content: string;
  userId: number;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
};


export type NoteFilter = {
  page?: number;
  limit?: number;
  search?: string;
}; 