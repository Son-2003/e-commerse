import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

interface LoadingSpinnerProps {
  size?: "small" | "default" | "large";
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "large",
  color = "black",
}) => {
  return (
    <div className="flex justify-center">
      <Spin
        indicator={<LoadingOutlined spin style={{ color }} />}
        size={size}
      />
    </div>
  );
};

export default LoadingSpinner;
