export interface IMenuSection {
  menu_section_id: number;
  menu_id: number;
  section_nm: string;
  sort_order: number;
  is_active: boolean;
}

export interface IMenuSectionNew extends Omit<
  IMenuSection,
  "menu_section_id"
> {}
export interface IMenuSectionUpdate extends Partial<IMenuSection> {}
