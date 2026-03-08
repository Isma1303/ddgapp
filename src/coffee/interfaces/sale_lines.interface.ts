export interface ISaleLine {
  sale_line_id: number;
  sale_id: number;
  product_id: number;
  menu_item_id: number;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface ISaleLineNew extends Omit<ISaleLine, "sale_line_id"> {}
export interface ISaleLineUpdate extends Partial<ISaleLine> {}
