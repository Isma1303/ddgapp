import { useState } from "react";
import { ProductsService } from "../services/products.service";
import type { IProduct, IProductNew } from "../interfaces/products.interface";

export const useProducts = () => {
  const service = new ProductsService();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data: any = await service.getAll<IProduct>();
      setProducts(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const create = async (product: IProductNew) => {
    try {
      setLoading(true);
      const newProduct: any = await service.post<IProductNew>(product);
      setLoading(false);
      return newProduct.data;
    } catch (error) {
      setLoading(false);
      console.error("Error creating product:", error);
    }
  };

  const update = async (product_id: number, product: IProductNew) => {
    try {
      setLoading(true);
      const updatedProduct: any = await service.put<IProductNew>(
        product_id,
        product,
      );
      setLoading(false);
      return updatedProduct.data;
    } catch (error) {
      setLoading(false);
      console.error("Error updating product:", error);
    }
  };

  const remove = async (product_id: number) => {
    try {
      setLoading(true);
      await service.delete(product_id);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error deleting product:", error);
    }
  };

  return { products, loading, fetchProducts, create, update, remove };
};
