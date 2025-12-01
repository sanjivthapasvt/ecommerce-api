import { injectable, singleton } from 'tsyringe';
import NoteRepository from '../repository/note.reposotory';
import { NoteFilter } from '../types';
import { CreateNoteDTO, UpdateNoteDTO } from '../dto';
import { logger } from '../../../shared/utils/logger';
import { Note } from '../models/note.model';
import { User } from '@/features/user/models/user.model';
import { ServiceStatus } from '@/shared/utils/constants';
import { StatusCodes } from 'http-status-codes';
import ServiceException from '@/shared/utils/serverException';

@injectable()
@singleton()
export default class NoteService {
  constructor(private noteRepository: NoteRepository) {}

  private ensureOwnership(note: Note, userId: number) {
    if (note.userId !== userId) {
      throw new Error('Unauthorized: You do not own this note');
    }
  }

  async createNote(data: CreateNoteDTO, userId: number) {
    try {
      const note = await this.noteRepository.createNote({
        title: data.title,
        content: data.content,
        isPrivate: data.isPrivate,
        user: { id: userId } as User,
      });

      return {
        message: 'Note created successfully.',
        noteTitle: note.title,
      };
    } catch (error: any) {
      logger.error('Error while creating note:', error);
      throw error;
    }
  }

  async updateNote(id: number, userId: number, data: UpdateNoteDTO) {
    try {
      let note = await this.noteRepository.findNoteById(id);
      if (note) {
        this.ensureOwnership(note, userId);
      }
      note = await this.noteRepository.updateNote(id, data);
      return {
        message: 'Note updated successfully.',
        noteTitle: note?.title,
      };
    } catch (error: any) {
      logger.error('Error while creating note:', error);
      throw error;
    }
  }

  async deleteNote(id: number, userId: number) {
    try {
      let note = await this.noteRepository.findNoteById(id);
      if (!note) {
        throw new ServiceException(StatusCodes.NOT_FOUND, ServiceStatus.FAILURE, 'Note not found');
      }
      this.ensureOwnership(note, userId);

      const noteTitle = await this.noteRepository.deleteNote(id);

      return {
        message: ` ${noteTitle} deleted successfully`,
      };
    } catch (error: any) {
      logger.error('Error while deleting note:', error);
      throw error;
    }
  }

  async getNoteById(id: number, userId: number) {
    try {
      const note = await this.noteRepository.findPublicNoteById(id);
      if (note) {
        this.ensureOwnership(note, userId);
      }
      return note;
    } catch (error: any) {
      logger.error('Error while deleting note:', error);
      throw error;
    }
  }

  async getNotes(filters: NoteFilter, userId: number) {
    try {
      return await this.noteRepository.getNotes(filters, userId);
    } catch (error: any) {
      logger.error('Error in getting notes:', error);
      throw error;
    }
  }

  async getPrivateNotes(filters: NoteFilter, userId: number) {
    try {
      return await this.noteRepository.getPrivateNotes(filters, userId);
    } catch (error: any) {
      logger.error('Error while getting private notes:', error);
      throw error;
    }
  }
  async getPrivateNoteById(id: number, userId: number) {
    try {
      const note = await this.noteRepository.findPrivateNoteById(id);
      if (!note) {
        throw new ServiceException(StatusCodes.NOT_FOUND, ServiceStatus.FAILURE, 'Note not found');
      }
      this.ensureOwnership(note, userId);
      return note;
    } catch (error: any) {
      logger.error('Error while getting private notes:', error);
      throw error;
    }
  }
}
