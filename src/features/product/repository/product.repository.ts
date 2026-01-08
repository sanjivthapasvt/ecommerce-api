import { Repository } from 'typeorm';
import { injectable, singleton } from 'tsyringe';
import { Product } from '../models/products.models';
import AppDataSource from '../../../config/database';
import { AddProductDto, UpdateProductDto } from '../types';
import { logger } from '../../../shared/utils/logger';
import ServiceException from '../../../shared/utils/serverException';
import { getDatabaseExceptionStatusCode } from '../../../shared/utils/helper';
import { ServiceStatus } from '../../../shared/utils/constants';

@injectable()
@singleton()
export default class ProductRepository {
    private repository: Repository<Product>;

    constructor() {
        this.repository = AppDataSource.getRepository(Product);
    }

    async create(data: AddProductDto): Promise<Product> {
        try {
            const product = this.repository.create(data);
            return await this.repository.save(product);
        } catch (error: any) {
            logger.error('Unable to create product.', error);
            throw new ServiceException(
                getDatabaseExceptionStatusCode(error),
                ServiceStatus.FAILURE,
                'Unable to create product.',
            );
        }
    }

    async findAll(): Promise<Product[]> {
        try {
            return await this.repository.find({ relations: ['reviews'] });
        } catch (error: any) {
            logger.error('Unable to fetch products.', error);
            throw new ServiceException(
                getDatabaseExceptionStatusCode(error),
                ServiceStatus.FAILURE,
                'Unable to fetch products.',
            );
        }
    }

    async findById(id: number): Promise<Product | null> {
        try {
            return await this.repository.findOne({ where: { id }, relations: ['reviews'] });
        } catch (error: any) {
            logger.error('Unable to find product by id.', error);
            throw new ServiceException(
                getDatabaseExceptionStatusCode(error),
                ServiceStatus.FAILURE,
                'Unable to find product by id.',
            );
        }
    }

    async update(id: number, data: UpdateProductDto): Promise<Product | null> {
        try {
            await this.repository.update(id, data);
            return this.findById(id);
        } catch (error: any) {
            logger.error('Unable to update product.', error);
            throw new ServiceException(
                getDatabaseExceptionStatusCode(error),
                ServiceStatus.FAILURE,
                'Unable to update product.',
            );
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await this.repository.delete(id);
        } catch (error: any) {
            logger.error('Unable to delete product.', error);
            throw new ServiceException(
                getDatabaseExceptionStatusCode(error),
                ServiceStatus.FAILURE,
                'Unable to delete product.',
            );
        }
    }
}
