// src/components/Dashboard/StatusBadge.jsx
import React from "react";

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "completed":
        return {
          label: "Paid",
          bgColor: "bg-green-50",
          textColor: "text-green-700",
          dotColor: "bg-green-500",
        };
      case "pending":
        return {
          label: "Pending",
          bgColor: "bg-yellow-50",
          textColor: "text-yellow-700",
          dotColor: "bg-yellow-500",
        };
      case "unpaid":
      case "overdue":
        return {
          label: "Unpaid",
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          dotColor: "bg-red-500",
        };
      case "processing":
        return {
          label: "Processing",
          bgColor: "bg-blue-50",
          textColor: "text-blue-700",
          dotColor: "bg-blue-500",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          dotColor: "bg-gray-500",
        };
      default:
        return {
          label: status || "Unknown",
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          dotColor: "bg-gray-500",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className="inline-flex items-center">
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`}></div>
        {config.label}
      </div>
    </div>
  );
};

export default StatusBadge;
