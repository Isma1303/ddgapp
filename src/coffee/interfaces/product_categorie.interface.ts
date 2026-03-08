export interface IProductCategory {
  product_category_id: number;
  product_category_nm: string;
  sort_order: number;
  is_active: boolean;
}

export interface IProductCategoryNew extends Omit<
  IProductCategory,
  "product_category_id"
> {}
export interface IProductCategoryUpdate extends Partial<IProductCategoryNew> {}
