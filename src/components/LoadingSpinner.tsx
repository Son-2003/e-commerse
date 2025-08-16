import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center">
      <Spin
        indicator={<LoadingOutlined spin />}
        size="large"
        className="text-black"
      />
    </div>
  );
}
