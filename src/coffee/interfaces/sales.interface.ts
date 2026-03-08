export interface ISale {
  sale_id: number;
  sold_at: string;
  total_amount: number;
  notes: string;
}

export interface ISaleNew extends Omit<ISale, "sale_id"> {}
export interface ISaleUpdate extends Partial<ISale> {}
