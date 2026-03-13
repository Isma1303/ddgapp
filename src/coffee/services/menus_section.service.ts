import { ParentService } from "../../system/service";

export class MenusSectionsService extends ParentService {
  constructor() {
    super("/coffee/menu-sections");
  }
}
