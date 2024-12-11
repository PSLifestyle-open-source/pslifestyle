import { ProgressBar } from "../../common/components/ui/ProgressBar";

/**
 * "Graph" for single themes questionnaire progress.
 */
interface ThemeProgressProps {
  complete: number;
  total: number;
  themeClass: string;
}

const ThemeProgress: React.FC<ThemeProgressProps> = ({
  complete,
  total,
  themeClass,
}) => (
  <>
    <div className="w-6 h-0.5">
      <ProgressBar
        progressColorClassName={themeClass}
        value={complete}
        max={total}
      />
    </div>
    <div
      className={`transition-colors delay-300 duration-300 rounded-full w-2 h-2 mx-1 ${
        complete === total ? themeClass : "bg-neutral-10"
      }`}
    />
  </>
);

export default ThemeProgress;
