import { FC } from "react";

interface BoxProps {
  icon: React.ReactNode;
  count: number;
  describe: string;
  textColor: string;
  borderColor: string;
}

const Box: FC<BoxProps> = ({ icon, count, describe, textColor, borderColor }) => {
  return (
    <div className={`flex flex-col items-center bg-white rounded-lg border-2 ${borderColor} shadow-lg p-2`}>
      <div className="w-14 h-42 flex items-center justify-center flex-1">
        {icon}
      </div>
      <div className="text-center">
        <p className={`text-sm font-medium ${textColor} mb-1`}>{describe}</p>
        <p className="text-xl font-semibold text-gray-800">{count}</p>
      </div>
    </div>
  );
};

export default Box;
