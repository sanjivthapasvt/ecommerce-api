import { Request, Response, NextFunction } from 'express';
import { injectable, singleton } from 'tsyringe';
import ProductService from '../services/product.service';
import { StatusCodes } from 'http-status-codes';
import { ServerResponse } from '../../../shared/utils/serverResponse';
import { AddProductDto, UpdateProductDto } from '../types';

@injectable()
@singleton()
export default class ProductController {
    constructor(private productService: ProductService) { }

    async create(req: Request<{}, {}, AddProductDto>, res: Response, next: NextFunction) {
        try {
            const result = await this.productService.createProduct(req.body);
            res.status(StatusCodes.CREATED).json(ServerResponse.success(result).toJson());
        } catch (error) {
            next(error);
        }
    }

    async getAll(_req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.productService.getAllProducts();
            res.status(StatusCodes.OK).json(ServerResponse.success(result).toJson());
        } catch (error) {
            next(error);
        }
    }

    async getOne(req: Request<{ id: string }>, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const result = await this.productService.getProduct(id);
            res.status(StatusCodes.OK).json(ServerResponse.success(result).toJson());
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request<{ id: string }, {}, UpdateProductDto>, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const result = await this.productService.updateProduct(id, req.body);
            res.status(StatusCodes.OK).json(ServerResponse.success(result).toJson());
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request<{ id: string }>, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const result = await this.productService.deleteProduct(id);
            res.status(StatusCodes.OK).json(ServerResponse.success(result).toJson());
        } catch (error) {
            next(error);
        }
    }
}
