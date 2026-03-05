import { useEffect, useState } from "react"
import { DashboardService } from "../services/dashboard.service"

export const useDashboard = ()=>{
  const dashboardService = new DashboardService();
  const [ data, setData] = useState<any[]>()

  useEffect(() => {
    const response: any = dashboardService.dashboardSummary();
    if(data){
        setData(response.data)
    }
    console.log(data)
  });

  return {
    data,
  };
}