const ImpactDetails = ({
  currentValue,
  totalValue,
  textColorClassName,
}: {
  currentValue: number;
  totalValue: number;
  textColorClassName: string;
}): null | JSX.Element => (
  <div
    className="items-center flex mr-2.5 grow lg:grow-0"
    data-cy="recommendations.impactDetails"
  >
    <p className={`${textColorClassName} font-bold text-lg`}>
      {currentValue ? Math.round(currentValue) : 0} / {Math.round(totalValue)}{" "}
      kg
    </p>
  </div>
);

export default ImpactDetails;
