const CountryTickRenderer = ({
  arrayOfCountryNameFootprintObjects,
  tick: { y, value },
}: {
  arrayOfCountryNameFootprintObjects: { name: string; footprint: number }[];
  tick: {
    value: string;
    y: number;
  };
}) => (
  <>
    <g transform={`translate(-35,${y - 12})`} style={{ opacity: "1" }}>
      <rect
        className="h-6 w-6"
        rx="12"
        fill={`url(#pattern_${value})`}
        style={{
          filter: "drop-shadow( 0px 3px 4px rgba(0, 0, 0, .3))",
        }}
      />
    </g>
    <text
      fill="#212B30"
      fontSize="12px"
      fontFamily="Poppins"
      fontStyle="normal"
      fontWeight={400}
      transform={`translate(12,${y + 4})`}
    >
      {
        arrayOfCountryNameFootprintObjects.find((obj) => obj.name === value)!
          .footprint
      }{" "}
      kg CO2
    </text>
    <defs>
      <pattern
        id={`pattern_${value}`}
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          href={`#image0_${value}`}
          transform="translate(-0.16632) scale(0.002079)"
        />
      </pattern>
      <image
        id={`image0_${value}`}
        width="641"
        height="481"
        href={`/images/flags/${value}-flag.svg`}
      />
    </defs>
  </>
);

export default CountryTickRenderer;
