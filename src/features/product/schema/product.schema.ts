import { z } from 'zod';

export const AddProductSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        description: z.string().min(1, 'Description is required'),
        brand: z.string().min(1, 'Brand is required'),
        price: z.number().min(0, 'Price must be greater than or equal to 0'),
    }),
});

export const UpdateProductSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        brand: z.string().optional(),
        price: z.number().min(0).optional(),
    }),
});
