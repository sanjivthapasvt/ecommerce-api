import { injectable, singleton } from 'tsyringe';
import ProductRepository from '../repository/product.repository';
import { AddProductDto, UpdateProductDto } from '../types';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../../../shared/utils/logger';
import { ServiceStatus } from '../../../shared/utils/constants';
import ServiceException from '../../../shared/utils/serverException';

@injectable()
@singleton()
export default class ProductService {
    constructor(private productRepository: ProductRepository) { }

    async createProduct(data: AddProductDto) {
        try {
            const product = await this.productRepository.create(data);
            return {
                message: 'Product created successfully',
                product,
            };
        } catch (error: any) {
            logger.error('Error in create product:', error);
            throw error;
        }
    }

    async getAllProducts() {
        try {
            return await this.productRepository.findAll();
        } catch (error: any) {
            logger.error('Error in get all products:', error);
            throw error;
        }
    }

    async getProduct(id: number) {
        try {
            const product = await this.productRepository.findById(id);
            if (!product) {
                throw new ServiceException(
                    StatusCodes.NOT_FOUND,
                    ServiceStatus.FAILURE,
                    'Product not found',
                );
            }
            return product;
        } catch (error: any) {
            logger.error('Error in get product:', error);
            throw error;
        }
    }

    async updateProduct(id: number, data: UpdateProductDto) {
        try {
            const existingProduct = await this.productRepository.findById(id);
            if (!existingProduct) {
                throw new ServiceException(
                    StatusCodes.NOT_FOUND,
                    ServiceStatus.FAILURE,
                    'Product not found',
                );
            }
            const updatedProduct = await this.productRepository.update(id, data);
            return {
                message: 'Product updated successfully',
                product: updatedProduct,
            };
        } catch (error: any) {
            logger.error('Error in update product:', error);
            throw error;
        }
    }

    async deleteProduct(id: number) {
        try {
            const existingProduct = await this.productRepository.findById(id);
            if (!existingProduct) {
                throw new ServiceException(
                    StatusCodes.NOT_FOUND,
                    ServiceStatus.FAILURE,
                    'Product not found',
                );
            }
            await this.productRepository.delete(id);
            return {
                message: 'Product deleted successfully',
            };
        } catch (error: any) {
            logger.error('Error in delete product:', error);
            throw error;
        }
    }
}
