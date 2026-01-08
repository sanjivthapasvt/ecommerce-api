import { Review } from "../models/review.model";

export type TProduct = {
  id: number;
  name: string;
  description: string;
  brand: string;
  price: number;
  reviews: Review[];
  createdAt: Date;
  updatedAt: Date;
};

// DTOs
export type AddProductDto = {
  name: string;
  description: string;
  brand: string;
  price: number;
};

export type UpdateProductDto = {
  name: string;
  description: string;
  brand: string;
  price: number;
};
