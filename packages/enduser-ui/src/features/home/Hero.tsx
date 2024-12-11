import { FullWidthContainer } from "../../common/components/layout/Container";
import Heading from "../../common/components/ui/Heading";
import { Icon } from "../../common/components/ui/Icon";
import Paragraph from "../../common/components/ui/Paragraph";
import { GoToQuestionnaireButton } from "../questionnaire/GoToQuestionnaireButton";
import { AbstractLogo } from "./AbstractLogo";
import { randomInt } from "@pslifestyle/common/src/helpers/securedMathjs";
import * as FeatherIcon from "react-feather";

export type HeroSubtitle = {
  iconName: keyof typeof FeatherIcon;
  subTitle: string;
};

type HeroProps = {
  logoText?: string;
  subtitles?: HeroSubtitle[];
};

const ListItem = ({ iconName, subTitle }: HeroSubtitle) => (
  <div className="flex items-start">
    <div style={{ position: "relative", top: "-4px" }}>
      <Icon size="large" type={iconName} className="pr-1 text-neutral-white" />
    </div>
    <Paragraph className="text-neutral-white" type="body-lg-b">
      {subTitle}
    </Paragraph>
  </div>
);

const Hero = ({ logoText, subtitles = [] }: HeroProps) => {
  const themes = [
    "bg-orange-100",
    "bg-green-100",
    "bg-pink-100",
    "bg-cyan-100",
  ];
  const theme = themes[randomInt(4)];

  return (
    <div data-testid="theme-div" className={`py-8 ${theme}`}>
      <FullWidthContainer className="gap-3" data-testid="container-div">
        <div data-testid="logo-div" className="flex justify-center">
          <AbstractLogo />
        </div>
        {logoText && (
          <div
            data-testid="rounded-div"
            className="flex flex-col justify-around"
          >
            <Heading
              level={1}
              type="headline-lg-eb"
              className="text-neutral-white mb-2"
            >
              {logoText}
            </Heading>
          </div>
        )}
        {subtitles &&
          subtitles.map((subtitle) => (
            <div key={subtitle.subTitle}>
              <ListItem
                subTitle={subtitle.subTitle}
                iconName={subtitle.iconName}
              />
            </div>
          ))}

        <GoToQuestionnaireButton />
      </FullWidthContainer>
    </div>
  );
};

export default Hero;
