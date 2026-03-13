import { ParentService } from "../../system/service";

export class SalesService extends ParentService {
  constructor() {
    super("/coffee/sales");
  }
}
