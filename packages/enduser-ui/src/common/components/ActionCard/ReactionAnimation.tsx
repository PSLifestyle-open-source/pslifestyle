/* eslint-disable react/no-array-index-key */
import HeartColor from "../../../assets/icons/heart-color.svg?react";
import SmileFaceColor from "../../../assets/icons/smile-face-color.svg?react";
import ThumbUp from "../../../assets/icons/thumb-up-color.svg?react";
import { randomInt } from "@pslifestyle/common/src/helpers/securedMathjs";

const reactionComponents = {
  heartColor: HeartColor,
  smileColor: SmileFaceColor,
  thumbUpColor: ThumbUp,
};

interface IProps {
  show: boolean;
  reactionType: keyof typeof reactionComponents;
  count?: number;
}

export const ReactionAnimation = ({
  show,
  reactionType,
  count = 3,
}: IProps): JSX.Element => {
  const Reaction = reactionComponents[reactionType];

  return (
    <div className="relative w-full">
      <div className="absolute w-full">
        {[...Array(count)].map((_, index) => (
          <Reaction
            key={index}
            style={{
              height: "180px",
              animationDelay: `${index * 300}ms`,
              width: "180px",
              [randomInt(0, 2) ? "left" : "right"]: `${randomInt(10, 30)}%`,
            }}
            className={
              show
                ? "move-and-wave-animation"
                : "move-and-wave-animation-disabled"
            }
          />
        ))}
      </div>
    </div>
  );
};
