/* eslint-disable react/no-array-index-key */
import { randomInt } from "@pslifestyle/common/src/helpers/securedMathjs";

export type Corner = "tr" | "tl" | "bl" | "br";
const CORNER: Corner[] = ["tr", "tl", "bl", "br"];

interface QuarterCircleProps {
  corner: Corner;
  className?: string;
}

const QuarterCircle = ({ corner, className }: QuarterCircleProps) => (
  <div className="border-b border-r border-transparent">
    <div
      className={`w-full h-full rounded-${corner}-full ${className ?? ""}`}
    />
  </div>
);

interface BrokenSlotProps {
  corner: Corner;
  className?: string;
}

const BrokenSlot = ({ corner, className }: BrokenSlotProps) => {
  const emptySlots: number[] = [randomInt(8), randomInt(8)];

  const slots = new Array(9)
    .fill("")
    .map((_, i) =>
      emptySlots.includes(i) ? `opacity-0 ${className}` : className,
    );

  return (
    <div className="grid grid-cols-3">
      {slots.map((val, i) => (
        <QuarterCircle
          key={`${val}_${i}`}
          className={`${val}`}
          corner={corner}
        />
      ))}
    </div>
  );
};

export const AbstractLogo = () => {
  const brokenSlot = randomInt(6);
  const elements = new Array(6).fill(true).map((_, i) => i !== brokenSlot);

  return (
    <div className="grid grid-cols-3 w-[calc(3*15vw)] h-[calc(2*15vw)] max-h-[calc(2*15vh)] max-w-[calc(3*15vh)] mb-4">
      {elements.map((val, i) => {
        const Component = val ? QuarterCircle : BrokenSlot;
        return (
          <Component
            key={`abstract_${i}`}
            className="bg-yellow-100"
            corner={CORNER[randomInt(4)]}
          />
        );
      })}
    </div>
  );
};
