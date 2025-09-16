import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: "up" | "down";
  isProduct?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  trend,
  isProduct,
}) => (
  <>
    {!isProduct ? (
      <div className="py-3 px-5 rounded-sm border shadow-lg border-gray-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-4 rounded-xl bg-black items-center flex`}>
            <Icon className="text-white text-xl" />
          </div>
          <div
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
              trend === "up"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {trend === "up" ? (
              <ArrowUpOutlined className="w-4 h-4" />
            ) : (
              <ArrowDownOutlined className="w-4 h-4" />
            )}
            <span>{change}</span>
          </div>
        </div>
        <h3 className="text-lg font-bold text-black mb-1">{value}</h3>
        <p className="text-gray-500 font-medium">{title}</p>
      </div>
    ) : (
      <div className="p-5 rounded-sm border shadow-lg border-gray-100">
        <div className="flex items-center justify-between">
          <div
            className={`items-center py-1 rounded-full text-sm font-medium`}
          >
            <p className="text-gray-500 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-black">{value}</h3>
          </div>
          <div className={`p-4 rounded-xl bg-black items-center flex`}>
            <Icon className="text-white text-xl" />
          </div>
        </div>
      </div>
    )}
  </>
);
