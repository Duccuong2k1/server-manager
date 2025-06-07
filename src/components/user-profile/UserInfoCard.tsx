"use client";
import React from "react";

interface InfoFieldProps {
  label: string;
  value: string;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value }) => {
  return (
    <div>
      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
        {value}
      </p>
    </div>
  );
};

export default function UserInfoCard() {


  const userInfo = {
    fullName: "Đỗ Đức Cường",
   
    email: "duccuongdo10@gmail.com",
    phone: "+0964 696 070",
    address: "Quận Tân bình, Tp Hồ Chí Minh"
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <InfoField label="Full Name" value={userInfo.fullName} />
           
            <InfoField label="Email address" value={userInfo.email} />
            <InfoField label="Phone" value={userInfo.phone} />
            <InfoField label="Address" value={userInfo.address} />
          </div>
        </div>
      </div>
    </div>
  );
}
