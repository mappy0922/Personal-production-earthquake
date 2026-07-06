export default function SvgLabel({
  height,
  legend_judge,
  traffic,
  label,
  active,
  setActive,
  dataColor,
  circleSize,
  circleColor,
}) {
  return (
    <svg
      width="200"
      height={height}
      className={`Legend_all ${!legend_judge ? "hide" : ""}`}
    >
      <line
      x1="0"
      y1="0"
      x2="0"
      y2={height}
      stroke="black"
      strokeWidth="4"
      />

      <text x="5" y="20" fontSize={20}>
        {traffic === "移動目的" ? "・目的別" : "・手段別"}
      </text>

      {label.map((name, i) => (
        <g
          key={name}
          transform={`translate(0, ${35 * i + 35})`}
          className={active[name] ? "fade" : ""}
          onClick={() =>
            setActive({
              ...active,
              [name]: !active[name],
            })
          }
        >
          <rect
            x="10"
            width="9"
            height="9"
            fill={dataColor[name]}
          />

          <text
            className="legend"
            x="30"
            y="8"
          >
            {name}
          </text>
        </g>
      ))}

      <text
        x="5"
        y="300"
        fontSize={20}
      >
        ・来客者数
      </text>

      {circleSize.map((name, i) => (
        <g
          key={i}
          transform={`translate(0, ${35 * i + 80})`}
        >
          <circle
            cx="15"
            cy="240"
            r="5"
            fill={circleColor(name)}
          />

          <text
            x="35"
            y="245"
            fontSize={12}
          >
            {i < 4 ? `${name}人以上` : `${name}`}
          </text>
        </g>
      ))}
    </svg>
  );
}