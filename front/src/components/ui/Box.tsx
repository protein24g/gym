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
    <div className="flex bg-white">
      <div className={`border-2 ${borderColor}`}></div>
      <div className="flex flex-1 justify-between items-center p-4">
        <div>
          <p className={`font-bold ${textColor}`}>{describe}</p>
          <p className="text-black text-2xl font-bold">{count}</p>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
};

export default Box;
