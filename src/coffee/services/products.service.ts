import { ParentService } from "../../system/service";

export class ProductsService extends ParentService {
  constructor() {
    super("/coffee/products");
  }
}
