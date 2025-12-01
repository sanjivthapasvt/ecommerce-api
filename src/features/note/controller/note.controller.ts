import { Response, NextFunction } from 'express';
import { injectable, singleton } from 'tsyringe';
import NoteService from '../services/note.service';
import { StatusCodes } from 'http-status-codes';
import { ServerResponse } from '../../../shared/utils/serverResponse';
import { NoteFilter } from '../types';
import { CreateNoteDTO, UpdateNoteDTO } from '../dto';
import { AuthenticatedRequest } from '@/shared/types';

@injectable()
@singleton()
export default class NoteController {
  constructor(private noteService: NoteService) {}

  async createNote(req: AuthenticatedRequest<{}, {}, CreateNoteDTO>, res: Response, next: NextFunction) {
    try {
      const result = await this.noteService.createNote(req.body, req.user.id);
      res.status(StatusCodes.CREATED).json(ServerResponse.success(result).toJson());
    } catch (error) {
      next(error);
    }
  }

  async updateNote(
    req: AuthenticatedRequest<{ noteId: number }, {}, UpdateNoteDTO>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await this.noteService.updateNote(req.params.noteId, req.user?.id, req.body);
      res.status(StatusCodes.OK).json(ServerResponse.success(result).toJson());
    } catch (error) {
      next(error);
    }
  }

  async deleteNote(req: AuthenticatedRequest<{ noteId: number }, {}, {}>, res: Response, next: NextFunction) {
    try {
      const result = await this.noteService.deleteNote(req.params.noteId, req.user.id);
      res.status(StatusCodes.OK).json(ServerResponse.success(result).toJson());
    } catch (error) {
      next(error);
    }
  }

  async getNotes(req: AuthenticatedRequest<{}, {}, {}, NoteFilter>, res: Response, next: NextFunction) {
    try {
      const result = await this.noteService.getNotes(req.query, req.user.id);
      res.status(StatusCodes.OK).json(ServerResponse.success(result).toJson());
    } catch (error) {
      next(error);
    }
  }

  async getNoteById(req: AuthenticatedRequest<{ noteId: number }>, res: Response, next: NextFunction) {
    try {
      const result = await this.noteService.getNoteById(req.params.noteId, req.user.id);

      if (!result) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(ServerResponse.failure('Note not found').toJson());
      }

      return res.status(StatusCodes.OK).json(ServerResponse.success(result).toJson());
    } catch (error) {
      next(error);
      return;
    }
  }

  async getPrivateNotes(req: AuthenticatedRequest<{}, {}, {}, NoteFilter>, res: Response, next: NextFunction) {
    try {
      const result = await this.noteService.getPrivateNotes(req.query, req.user.id);
      res.status(StatusCodes.OK).json(ServerResponse.success(result).toJson());
    } catch (error) {
      next(error);
    }
  }
  
  async getPrivateNoteById(req: AuthenticatedRequest<{noteId: number}, {}, {}>, res: Response, next: NextFunction) {
    try {
      const result = await this.noteService.getPrivateNoteById(req.params.noteId, req.user.id);
      res.status(StatusCodes.OK).json(ServerResponse.success(result).toJson());
    } catch (error) {
      next(error);
    }
  }
}
