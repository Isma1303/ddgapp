import { ParentService } from "../../system/service";

export class MenusService extends ParentService {
  constructor() {
    super("/coffee/menus");
  }
}
