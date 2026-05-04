import React from "react";
import {
  HelpCircle,
  Mail,
  FileText,
  MessageCircle,
  ExternalLink,
} from "lucide-react";

const HelpPage = () => {
  const helpTopics = [
    {
      title: "Getting Started",
      description: "Learn the basics of Maglo",
      icon: FileText,
    },
    {
      title: "Invoice Guide",
      description: "How to create and manage invoices",
      icon: FileText,
    },
    {
      title: "Payment Processing",
      description: "Understanding payments and fees",
      icon: MessageCircle,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Get support and find answers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {helpTopics.map((topic) => (
          <div
            key={topic.title}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-[#C8F000]/10 rounded-xl flex items-center justify-center mb-4">
              <topic.icon size={24} className="text-gray-700" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{topic.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{topic.description}</p>
            <button className="text-sm text-[#2D7A4F] font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Learn More <ExternalLink size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-[#C8F000]/10 to-transparent rounded-2xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Still need help?
            </h3>
            <p className="text-sm text-gray-500">
              Our support team is ready to assist you
            </p>
          </div>
          <button className="flex items-center gap-2 bg-[#2D7A4F] text-white px-5 py-2.5 rounded-xl hover:bg-[#1E5435] transition-colors">
            <Mail size={16} />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
