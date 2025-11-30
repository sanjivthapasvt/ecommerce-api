import { Repository } from 'typeorm';
import { injectable, singleton } from 'tsyringe';
import { Note } from '../models/note.model';
import AppDataSource from '../../../config/database';
import { NoteFilter, TNote } from '../types';
import { logger } from '../../../shared/utils/logger';
import ServiceException from '../../../shared/utils/serverException';
import { getDatabaseExceptionStatusCode } from '../../../shared/utils/helper';
import { ServiceStatus } from '../../../shared/utils/constants';
import { buildPaginatedResult } from '../../../shared/utils/pagination';

@injectable()
@singleton()
export default class NoteRepository {
  private repository: Repository<Note>;

  constructor() {
    this.repository = AppDataSource.getRepository(Note);
  }

  async findNoteByTitle(title: string): Promise<Note | null> {
    try {
      return await this.repository.findOne({ where: { title } });
    } catch (error: any) {
      logger.error('Unable to find the note by title.', error);
      throw new ServiceException(
        getDatabaseExceptionStatusCode(error),
        ServiceStatus.FAILURE,
        'Unable to find note by title.',
      );
    }
  }

  async findNoteById(id: number): Promise<Note | null> {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (error: any) {
      logger.error('Unable to find Note by id.', error);
      throw new ServiceException(
        getDatabaseExceptionStatusCode(error),
        ServiceStatus.FAILURE,
        'Unable to find Note by id.',
      );
    }
  }

  async createNote(data: Partial<TNote>): Promise<Note> {
    try {
      const newNote = this.repository.create(data);
      return await this.repository.save(newNote);
    } catch (error: any) {
      logger.error('Unable to create Note.', error);
      throw new ServiceException(
        getDatabaseExceptionStatusCode(error),
        ServiceStatus.FAILURE,
        'Unable to create Note.',
      );
    }
  }

  async updateNote(id: number, data: Partial<TNote>): Promise<Note | null> {
    try {
      await this.repository.update(id, data);
      return this.findNoteById(id);
    } catch (error: any) {
      logger.error('Unable to update Note.', error);
      throw new ServiceException(
        getDatabaseExceptionStatusCode(error),
        ServiceStatus.FAILURE,
        'Unable to update note.',
      );
    }
  }

  async deleteNote(id: number) {
    try {
      const note = await this.findNoteById(id);
      await this.repository.delete(id);
      return note?.title;
    } catch (error: any) {
      logger.error('Unable to delete note.', error);
      throw new ServiceException(
        getDatabaseExceptionStatusCode(error),
        ServiceStatus.FAILURE,
        'Unable to delete note.',
      );
    }
  }

  async getNotes(filters: NoteFilter) {
    try {
      const { page = 1, limit = 10, search } = filters;
      const skip = (page - 1) * limit;

      const queryBuilder = this.repository.createQueryBuilder('note');

      queryBuilder.where('note.isPrivate = false');

      if (search) {
        queryBuilder.andWhere('(note.title ILIKE :search)', { search: `%${search}%` });
      }

      const [Notes, total] = await queryBuilder
        .skip(skip)
        .take(limit)
        .orderBy('note.createdAt', 'DESC')
        .getManyAndCount();

      return buildPaginatedResult(Notes, total, page, limit);
    } catch (error: any) {
      logger.error('Unable to get Notes.', error);
      throw new ServiceException(
        getDatabaseExceptionStatusCode(error),
        ServiceStatus.FAILURE,
        'Unable to get Notes.',
      );
    }
  }

  async getPrivateNotes(filters: NoteFilter) {
    try {
      const { page = 1, limit = 10, search } = filters;
      const skip = (page - 1) * limit;

      const queryBuilder = this.repository.createQueryBuilder('note');

      queryBuilder.where('note.isPrivate = true');

      if (search) {
        queryBuilder.andWhere('(note.title ILIKE :search)', { search: `%${search}%` });
      }

      const [Notes, total] = await queryBuilder
        .skip(skip)
        .take(limit)
        .orderBy('note.createdAt', 'DESC')
        .getManyAndCount();

      return buildPaginatedResult(Notes, total, page, limit);
    } catch (error: any) {
      logger.error('Unable to get Notes.', error);
      throw new ServiceException(
        getDatabaseExceptionStatusCode(error),
        ServiceStatus.FAILURE,
        'Unable to get Notes.',
      );
    }
  }
}
