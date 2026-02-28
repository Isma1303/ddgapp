import { ParentService } from "../../system/service";

export class DepartmentService extends ParentService{
    constructor(){
        super("/ddg/departments");
    }

    async getAll() {
        const response = await this.axiosInstance.get("/");
        return response.data;
    }
}