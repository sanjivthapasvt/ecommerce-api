import { Request, Response, NextFunction } from 'express';
import { injectable, singleton } from 'tsyringe';
import NoteService from '../services/note.service';
import { StatusCodes } from 'http-status-codes';
import { ServerResponse } from '../../../shared/utils/serverResponse';
import { NoteDto, NoteFilter } from '../types';

@injectable()
@singleton()
export default class NoteController {
  constructor(private noteService: NoteService) {}

  async createNote(req: Request<{}, {}, NoteDto>, res: Response, next: NextFunction) {
    try {
      const result = await this.noteService.createNote(req.body);
      res.status(StatusCodes.CREATED).json(ServerResponse.success(result).toJson());
    } catch (error) {
      next(error);
    }
  }

  async updateNote(
    req: Request<{ noteId: number }, {}, NoteDto>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await this.noteService.updateNote(req.params.noteId, req.body);
      res.status(StatusCodes.OK).json(ServerResponse.success(result).toJson());
    } catch (error) {
      next(error);
    }
  }

  async deleteNote(req: Request<{ noteId: number }, {}, {}>, res: Response, next: NextFunction) {
    try {
      const result = await this.noteService.deleteNote(req.params.noteId);
      res.status(StatusCodes.OK).json(ServerResponse.success(result).toJson());
    } catch (error) {
      next(error);
    }
  }

  async getNotes(req: Request<{}, {}, {}, NoteFilter>, res: Response, next: NextFunction) {
    try {
      const result = await this.noteService.getNotes(req.query);
      res.status(StatusCodes.OK).json(ServerResponse.success(result).toJson());
    } catch (error) {
      next(error);
    }
  }

  async getNoteById(req: Request<{ noteId: number }>, res: Response, next: NextFunction) {
    try {
      const result = await this.noteService.getNoteById(req.params.noteId);

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

  async getPrivateNotes(req: Request<{}, {}, {}, NoteFilter>, res: Response, next: NextFunction) {
    try {
      const result = await this.noteService.getPrivateNotes(req.query);
      res.status(StatusCodes.OK).json(ServerResponse.success(result).toJson());
    } catch (error) {
      next(error);
    }
  }
}
