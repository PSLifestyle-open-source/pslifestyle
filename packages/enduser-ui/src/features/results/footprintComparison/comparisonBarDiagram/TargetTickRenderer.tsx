const TargetTickRenderer = ({
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
        width="24px"
        height="24px"
        rx="15"
        fill="#2FAC66"
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
  </>
);

export default TargetTickRenderer;
