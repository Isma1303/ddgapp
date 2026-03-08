import { ParentService } from "../../system/service";

export class ProductsCategoriesService extends ParentService {
  constructor() {
    super("/coffee/product-categories");
  }
}
