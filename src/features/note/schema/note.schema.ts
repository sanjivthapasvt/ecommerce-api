import { z } from 'zod';

export const noteSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title must not be empty'),
    content: z.string().min(0),
    isPrivate: z.boolean().default(false)
  }),
});

export const updateNoteSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title must not be empty').optional(),
    content: z.string().min(0).optional(),
    isPrivate: z.boolean().optional()
  }),
  params: z.object({
    noteId: z.string().transform((val) => parseInt(val, 10)),
  }),
});
