import { useState } from "react";
import { ProductsCategoriesService } from "../services/products_categories.service";
import type { IProductCategory } from "../interfaces/product_categorie.interface";

export const useProductCategories = () => {
  const service = new ProductsCategoriesService();
  const [categories, setCategories] = useState<IProductCategory[]>([]);

  const fetchCategories = async () => {
    try {
      const response: any = await service.getAll<IProductCategory>();
      const normalizedCategories = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : [];

      setCategories(normalizedCategories);
    } catch (error) {
      setCategories([]);
      console.error("Error fetching product categories:", error);
    }
  };

  const createCategory = async (categoryData: Partial<IProductCategory>) => {
    try {
      const response: any = await service.post<IProductCategory>(categoryData);
      const newCategory = response?.data || response;
      setCategories((prevCategories) => [...prevCategories, newCategory]);
    } catch (error) {
      console.error("Error creating product category:", error);
    }
  };

  const updateCategory = async (
    id: number,
    categoryData: Partial<IProductCategory>,
  ) => {
    try {
      const response: any = await service.put<IProductCategory>(
        id,
        categoryData,
      );
      const updatedCategory = response?.data || response;
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.product_category_id === id ? updatedCategory : category,
        ),
      );
    } catch (error) {
      console.error("Error updating product category:", error);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await service.delete(id);
      setCategories((prevCategories) =>
        prevCategories.filter(
          (category) => category.product_category_id !== id,
        ),
      );
    } catch (error) {
      console.error("Error deleting product category:", error);
    }
  };

  return {
    categories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
