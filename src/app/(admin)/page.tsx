import CustomerMapWrapper from "@/components/servers/CustomerMapWrapper";
import ServerRecentActivities from '@/components/servers/ServerRecentActivities';
import ServerStatistics from '@/components/servers/ServerStatistics';
import type { Metadata } from "next";


export const metadata: Metadata = {
  title:
    "Admin Dashboard | server manager",
  description: "Do Duc Cuong",
};

export default function Dashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6">
        <ServerStatistics />
      </div>

      <div className="col-span-12">
        <CustomerMapWrapper />
      </div> 
      <div className="col-span-12 ">
        <ServerRecentActivities />
     
      </div> 
    </div>
  );
}
