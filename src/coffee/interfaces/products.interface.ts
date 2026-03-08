export interface IProduct {
  product_id: number;
  product_category_id: number;
  product_nm: string;
  product_description: string;
  product_price: number;
  stock: number;
  product_img?: string;
  is_active: boolean;
}

export interface IProductNew extends Omit<IProduct, "product_id"> {}
export interface IProductUpdate extends Partial<IProduct> {}
