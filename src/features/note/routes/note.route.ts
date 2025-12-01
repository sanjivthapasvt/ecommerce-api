import { Router } from 'express';
import { container } from 'tsyringe';
import NoteController from '../controller/note.controller';
import { authenticate } from '@/middleware/auth';
import { CreateNoteDTO, UpdateNoteDTO } from '../dto';
import { validateDto } from '@/middleware/validateDto';

const router = Router();
const userController = container.resolve(NoteController);

// routes
router.use(authenticate)

router.post('', validateDto(CreateNoteDTO), userController.createNote.bind(userController)); //Create Note

router.get('', userController.getNotes.bind(userController)); // Get Notes
router.get('/private', userController.getPrivateNotes.bind(userController)); // Get Private Notes
router.get('/private/:noteId', userController.getPrivateNoteById.bind(userController)); // Get Private Note
router.get('/:noteId', userController.getNoteById.bind(userController)); //Get Note detail
router.patch('/:noteId', validateDto(UpdateNoteDTO), userController.updateNote.bind(userController)); // Update Note
router.delete('/:noteId', userController.deleteNote.bind(userController)); // Delete Note

export const noteRoutes = router;
