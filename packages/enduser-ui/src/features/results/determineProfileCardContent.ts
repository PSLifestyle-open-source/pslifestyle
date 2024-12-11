import { OrdinaryQuestionCategory } from "@pslifestyle/common/src/types/genericTypes";

const profileCardFootprintLogicTick: {
  [countryCode: string]: { low: number; high: number };
} = {
  FI: { low: 3000, high: 14700 },
  EE: { low: 3000, high: 12000 },
  DE: { low: 3000, high: 11600 },
  GR: { low: 3000, high: 9200 },
  IT: { low: 3000, high: 11600 },
  PT: { low: 3000, high: 12900 },
  SI: { low: 3000, high: 8700 },
  TR: { low: 3000, high: 7100 },
  PL: { low: 3000, high: 8700 },
  EU: { low: 3000, high: 14700 },
};

enum ProfileCardTitleTranslationKeyEnum {
  HERO_OF_SUSTAINABLE_EVERYDAY_LIVING = "heroOfSustainableEverydayLiving",
  WONDERFUL_OPPORTUNITY = "wonderfulOpportunity",
  WISE_HOME_LOVER = "wiseHomeLover",
  RESPONSIBLE_TRAVELER = "responsibleTraveler",
  GREEN_GOURMET = "greenGourmet",
  QUALITY_CONSCIOUS_INDULGER = "qualityConsciousIndulger",
}

const profileCardImagePaths: Record<
  ProfileCardTitleTranslationKeyEnum,
  string
> = {
  heroOfSustainableEverydayLiving: "/images/icons/trophy.png",
  wonderfulOpportunity: "/images/icons/stairs.png",
  wiseHomeLover: "/images/icons/sofa.png",
  responsibleTraveler: "/images/icons/backpack.png",
  greenGourmet: "/images/icons/food.png",
  qualityConsciousIndulger: "/images/icons/bag.png",
};

const lowestCategorySpecificProfileCardTitleTranslationKey: Record<
  OrdinaryQuestionCategory,
  ProfileCardTitleTranslationKeyEnum
> = {
  housing: ProfileCardTitleTranslationKeyEnum.WISE_HOME_LOVER,
  transport: ProfileCardTitleTranslationKeyEnum.RESPONSIBLE_TRAVELER,
  food: ProfileCardTitleTranslationKeyEnum.GREEN_GOURMET,
  purchases: ProfileCardTitleTranslationKeyEnum.QUALITY_CONSCIOUS_INDULGER,
};

const profileCardDescriptionVariantTree: {
  [lowestCategoryBasedTitleTranslationKey in ProfileCardTitleTranslationKeyEnum]?: {
    [highestCategoryLabel: string]: string;
  };
} = {
  [ProfileCardTitleTranslationKeyEnum.WISE_HOME_LOVER]: {
    transport: "variant1",
    food: "variant2",
    purchases: "variant3",
  },
  [ProfileCardTitleTranslationKeyEnum.RESPONSIBLE_TRAVELER]: {
    housing: "variant1",
    food: "variant2",
    purchases: "variant3",
  },
  [ProfileCardTitleTranslationKeyEnum.GREEN_GOURMET]: {
    housing: "variant1",
    transport: "variant2",
    purchases: "variant3",
  },
  [ProfileCardTitleTranslationKeyEnum.QUALITY_CONSCIOUS_INDULGER]: {
    housing: "variant1",
    transport: "variant2",
    food: "variant3",
  },
};

export const determineProfileCardContent = (
  countryCode: string,
  lowestCategoryLabel: OrdinaryQuestionCategory,
  highestCategoryLabel: OrdinaryQuestionCategory,
  totalFootprint: number,
) => {
  let titleTranslationKey: string;

  // If total footprint is below or equal to low tick, we go with generic content for it
  if (totalFootprint <= profileCardFootprintLogicTick[countryCode].low) {
    titleTranslationKey =
      ProfileCardTitleTranslationKeyEnum.HERO_OF_SUSTAINABLE_EVERYDAY_LIVING;
  } else if (
    // If total footprint is higher or equal to high tick, we go with generic content for it
    totalFootprint >= profileCardFootprintLogicTick[countryCode].high
  ) {
    titleTranslationKey =
      ProfileCardTitleTranslationKeyEnum.WONDERFUL_OPPORTUNITY;
  } else {
    // If total footprint is in between low and high tick, we determine content based on lowest and highest category labels
    titleTranslationKey =
      lowestCategorySpecificProfileCardTitleTranslationKey[lowestCategoryLabel];
  }

  const descriptionScope =
    profileCardDescriptionVariantTree[
      titleTranslationKey as ProfileCardTitleTranslationKeyEnum
    ];
  const imagePath = new URL(
    profileCardImagePaths[
      titleTranslationKey as ProfileCardTitleTranslationKeyEnum
    ],
    import.meta.url,
  ).href;
  const descriptionTranslationKey: string = descriptionScope
    ? descriptionScope[highestCategoryLabel]
    : "variant1";

  return { titleTranslationKey, imagePath, descriptionTranslationKey };
};
