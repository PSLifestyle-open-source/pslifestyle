import { FullWidthContainer } from "../../common/components/layout/Container";
import Heading from "../../common/components/ui/Heading";
import { Icon } from "../../common/components/ui/Icon";
import Paragraph from "../../common/components/ui/Paragraph";
import { GoToQuestionnaireButton } from "../questionnaire/GoToQuestionnaireButton";
import * as FeatherIcon from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type Props = {
  iconName: keyof typeof FeatherIcon;
  generalTranslKey: string;
  paragraphTranslKeys: string[];
  imgSrc: string;
  flexReverse?: boolean;
};

const LandingPageArticleRow = ({
  iconName,
  generalTranslKey,
  paragraphTranslKeys,
  imgSrc,
  flexReverse = false,
}: Props) => {
  const { t } = useTranslation(["frontpage", "common"]);
  return (
    <section
      className={`flex flex-start ${
        flexReverse ? "flex-row-reverse" : ""
      } gap-3 child:md:basis-1/2 pb-6`}
    >
      <div className="my-auto space-y-2">
        <div className="flex items-center">
          <Heading
            level={2}
            type="headline-md-b"
            className="text-green-dark grow"
          >
            {t(`${generalTranslKey}.title`)}
          </Heading>
          <div>
            <Icon
              size="extralarge"
              type={iconName}
              className="pr-1 text-green-dark"
            />
          </div>
        </div>

        {paragraphTranslKeys.map((par) =>
          t(`${generalTranslKey}.${par}`)
            .split("\n")
            .filter((item) => item)
            .map((segment) => (
              <Paragraph
                type="body-lg"
                key={segment}
                className="first:mt-0 mt-4"
              >
                {segment}
              </Paragraph>
            )),
        )}
      </div>
      <img
        className="hidden md:block h-[250px] my-auto"
        alt=""
        src={`/images/${imgSrc}`}
      />
    </section>
  );
};

const LandingPageArticle = () => {
  const { t } = useTranslation(["frontpage"]);
  return (
    <FullWidthContainer className="px-6 py-8">
      <article>
        <div className="even:flex-row-reverse">
          <LandingPageArticleRow
            iconName="PieChart"
            generalTranslKey="contentPart1"
            paragraphTranslKeys={["text"]}
            imgSrc="frontpage_1.jpg"
          />
          <LandingPageArticleRow
            iconName="Heart"
            generalTranslKey="contentPart2"
            paragraphTranslKeys={["text"]}
            imgSrc="frontpage_2.jpg"
            flexReverse
          />
          <LandingPageArticleRow
            iconName="TrendingUp"
            generalTranslKey="contentPart3"
            paragraphTranslKeys={["text"]}
            imgSrc="frontpage_3.jpg"
          />
          <LandingPageArticleRow
            iconName="Compass"
            generalTranslKey="contentPart4"
            paragraphTranslKeys={["text"]}
            imgSrc="forest.jpeg"
            flexReverse
          />
        </div>

        <div className="flex flex-col md:flex-row bg-orange-100 px-6 py-8 md:px-12 md:py-16 text-center rounded-lg md:rounded-2xl items-center mb-8">
          <Heading
            level={2}
            type="headline-lg-eb"
            className="mb-4 md:mb-0 text-neutral-white md:mr-6"
          >
            {t("readyToGetStarted")}
          </Heading>

          <GoToQuestionnaireButton buttonClassName="flex-grow" />
        </div>

        <div className="bg-neutral-white px-6 py-8 md:px-10 md:py-11 rounded-lg md:rounded-2xl items-center bg-windmillPattern bg-no-repeat bg-right-top bg-contain mb-8">
          <Heading
            level={2}
            type="headline-md-b"
            className="mb-3 text-neutral-100 md:mr-6"
          >
            {t("feedback.footer.title", { ns: "common" })}
          </Heading>
          <Paragraph type="body-md">
            {" "}
            <Trans
              i18nKey="feedback.footer.description"
              ns="common"
              components={{
                Link: (
                  <Link
                    to="mailto:change@me.domain"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="body-md-b"
                  />
                ),
              }}
            />
          </Paragraph>
        </div>
        <div className="py-8 flex flex-col md:flex-row md:items-center">
          <img
            src="/images/flags/EU-flag.svg"
            height="107px"
            width="170px"
            alt="Flag of European Union"
          />
          <Paragraph type="body-md" className="md:ml-5 md:mt-0 mt-5">
            {t("fundingInfo", { ns: "common" })}
          </Paragraph>
        </div>
      </article>
    </FullWidthContainer>
  );
};

export default LandingPageArticle;
