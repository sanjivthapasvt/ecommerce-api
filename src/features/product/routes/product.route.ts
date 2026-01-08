import { Router } from 'express';
import { container } from 'tsyringe';
import ProductController from '../controller/product.controller';
import { validate } from '../../../middleware/validateRequest';
import { AddProductSchema, UpdateProductSchema } from '../schema/product.schema';
import { authenticate } from '../../../middleware/auth';

const router = Router();
const productController = container.resolve(ProductController);


// Protected routes
router.use(authenticate);

router.post(
    '/',
    validate(AddProductSchema),
    productController.create.bind(productController)
);

router.get('/', productController.getAll.bind(productController));
router.get('/:id', productController.getOne.bind(productController));

router.patch(
    '/:id',
    validate(UpdateProductSchema),
    productController.update.bind(productController)
);

router.delete('/:id', productController.delete.bind(productController));

export const productRoutes = router;
