export interface IMenuItem {
  menu_item_id: number;
  menu_section_id: number;
  product_id: number;
  sort_order: number;
  price_override: number;
  is_active: boolean;
}

export interface IMenuItemNew extends Omit<IMenuItem, "menu_item_id"> {}
export interface IMenuItemUpdate extends Partial<IMenuItem> {}
