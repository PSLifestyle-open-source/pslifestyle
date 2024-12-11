/**
 * Component for hosting the progress indicator. Creates different "graphs" for all themes.
 */
import { QuestionnaireProgress, progressForTheme } from "./QuestionnaireUtils";
import ThemeProgress from "./ThemeProgress";

export interface QuestionnaireProgressIndicatorProps {
  progress: QuestionnaireProgress;
}

const QuestionnaireProgressIndicator: React.FC<
  QuestionnaireProgressIndicatorProps
> = ({ progress }) => {
  const housing = progressForTheme("housing", progress);
  const transport = progressForTheme("transport", progress);
  const food = progressForTheme("food", progress);
  const purchases = progressForTheme("purchases", progress);
  // const demographic = progressForTheme('demographic', progress);

  return (
    <div className="flex justify-center items-center px-8 h-8">
      <div className="rounded-full w-2 h-2 mx-0.5 bg-yellow-100" />
      <ThemeProgress {...housing} themeClass="bg-orange-80" />
      <ThemeProgress {...transport} themeClass="bg-purple-80" />
      <ThemeProgress {...food} themeClass="bg-pink-80" />
      <ThemeProgress {...purchases} themeClass="bg-cyan-80" />
      {/* <ThemeProgress {...demographic} themeClass="bg-green-80" /> */}
    </div>
  );
};

export default QuestionnaireProgressIndicator;
