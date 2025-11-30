import { injectable, singleton } from 'tsyringe';
import NoteRepository from '../repository/note.reposotory';
import { NoteDto, NoteFilter } from '../types';
import { logger } from '../../../shared/utils/logger';

@injectable()
@singleton()
export default class NoteService {
  constructor(private noteRepository: NoteRepository) {}

  async createNote(data: NoteDto) {
    try {
      const note = await this.noteRepository.createNote(data);
      return {
        message: 'Note created successfully.',
        noteTitle: note.title,
      };
    } catch (error: any) {
      logger.error('Error while creating note:', error);
      throw error;
    }
  }

  async updateNote(id: number, data: NoteDto) {
    try {
      const note = await this.noteRepository.updateNote(id, data);
      return {
        message: 'Note updated successfully.',
        noteTitle: note?.title,
      };
    } catch (error: any) {
      logger.error('Error while creating note:', error);
      throw error;
    }
  }

  async deleteNote(id: number) {
    try {
      const note = await this.noteRepository.deleteNote(id);
      return {
        message: `${note} deleted successfully`,
      };
    } catch (error: any) {
      logger.error('Error while deleting note:', error);
      throw error;
    }
  }

  async getNoteById(id: number) {
    try {
      return await this.noteRepository.findNoteById(id);
    } catch (error: any) {
      logger.error('Error while deleting note:', error);
      throw error;
    }
  }

  async getNotes(filters: NoteFilter) {
    try {
      return await this.noteRepository.getNotes(filters);
    } catch (error: any) {
      logger.error('Error in getting notes:', error);
      throw error;
    }
  }

  async getPrivateNotes(filters: NoteFilter) {
    try {
      return await this.noteRepository.getPrivateNotes(filters);
    } catch (error: any) {
      logger.error('Error while getting private notes:', error);
      throw error;
    }
  }
}
