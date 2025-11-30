import { Router } from 'express';
import { container } from 'tsyringe';
import NoteController from '../controller/note.controller';
import { validate } from '@/middleware/validateRequest';
import { noteSchema, updateNoteSchema } from '../schema/note.schema';

const router = Router();
const userController = container.resolve(NoteController);

// routes
router.get('', userController.getNotes.bind(userController));
router.get('/private', userController.getPrivateNotes.bind(userController));
router.post('', validate(noteSchema), userController.createNote.bind(userController));
router.get('/:noteId', userController.getNoteById.bind(userController));
router.patch('/:noteId', validate(updateNoteSchema), userController.updateNote.bind(userController));
router.delete('/:noteId', userController.updateNote.bind(userController));

export const noteRoutes = router;
