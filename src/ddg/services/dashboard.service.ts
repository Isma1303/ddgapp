import { ParentService } from "../../system/service";

export class DashboardService extends ParentService{
    constructor(){
        super('/ddg/dashboard')
    }

    async dashboardSummary(){
        const response =  await this.axiosInstance.get('/')
        return response.data
    }

}