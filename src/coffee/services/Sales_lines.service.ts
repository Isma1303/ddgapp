import { ParentService } from "../../system/service";

export class SalesLinesService extends ParentService {
  constructor() {
    super("/coffee/sale-lines");
  }
}
