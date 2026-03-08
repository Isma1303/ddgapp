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
  return { categories, fetchCategories };
};
