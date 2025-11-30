import { QueryRunner } from "typeorm";
import { injectable } from "tsyringe";

import AppDataSource from "../config/database";

@injectable()
export default class SharedRepository {
  private datasource: typeof AppDataSource;

  constructor() {
    this.datasource = AppDataSource;
  }

  async getTransaction<T>(callback: (queryRunner: QueryRunner) => Promise<T>) {
    //get query runner
    const queryRunner = this.datasource.createQueryRunner();
    try {
      await queryRunner.connect();

      await queryRunner.startTransaction();

      const result = await callback(queryRunner);

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
