import { ButtonLarge } from "../../common/components/ui/buttons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const GoToRecommendationBar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["results"]);
  const [showBar, setShowBar] = useState<boolean>(false);

  const displayGoToRecommendationBar = (event: Event) => {
    const window = event.currentTarget as unknown as Window;
    if (window.scrollY > 150) {
      setShowBar(true);
    } else {
      setShowBar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", displayGoToRecommendationBar);
    return () => {
      window.removeEventListener("scroll", displayGoToRecommendationBar);
    };
  }, []);

  return (
    <>
      <div className="h-[74px]" />
      <div
        className={`fixed bottom-0 bg-yellow-40 w-full text-center py-3.5 px-4 z-50 ${showBar ? "block" : "hidden"}`}
      >
        <ButtonLarge
          onClick={() => navigate("/recommendations")}
          icon={{ position: "right", type: "ChevronRight" }}
        >
          {t("makeYourActionPlan", { ns: "results" })}
        </ButtonLarge>
      </div>
    </>
  );
};

export default GoToRecommendationBar;
