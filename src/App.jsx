import * as d3 from "d3";
import { useState, useEffect, useRef } from "react";

const MapName = [
  "日本地図",
  "世界地図",
]

export default function App() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const [Scale , setScale] = useState(1);
  const [Map , setMap] = useState(MapName[0]);

  const MapId = {
    "日本地図" : {
      images: [
        {
          href: "/日本地図.jpeg",
          x: 0,
          y: 0,
        },
      ],
    },

    "世界地図" : {
      images: [
        {href: "map_1.png", x: -2*width, y: -height},
        {href: "map_2.png", x: -width, y: -height},
        {href: "map_3.png", x: 0, y: -height},
        {href: "map_4.png", x: width, y: -height},
        {href: "map_5.png", x: 2*width, y: -height},
        {href: "map_6.png", x: 3*width, y: -height},

        {href: "map_7.png", x: -2*width, y: 0},
        {href: "map_8.png", x: -width, y: 0},
        {href: "map_9.png", x: 0, y: 0},
        {href: "map_10.png", x: width, y: 0},
        {href: "map_11.png", x: 2*width, y: 0},
        {href: "map_12.png", x: 3*width, y: 0},

        {href: "map_13.png", x: -2*width, y: height},
        {href: "map_14.png", x: -width, y: height},
        {href: "map_15.png", x: 0, y: height},
        {href: "map_16.png", x: width, y: height},
        {href: "map_17.png", x: 2*width, y: height},
        {href: "map_18.png", x: 3*width, y: height},
      ],
    },
  }

  const svgRef = useRef();
  const zoomRef = useRef();
  const resetRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const imageLayer = svg.select("#imageLayer");

    const zoom = d3.zoom()
    .scaleExtent([0.5, 14])
    .on("zoom", (event) => {
      let x = event.transform.x;
      let y = event.transform.y;
      const k = event.transform.k;

      if(Map === "日本地図") {
        while (x > width) {
          x-=2*width;
        }

        while (x < -width) {
          x+=2*width;
        }

        while (y > height) {
          y-=2*height;
        }

        while (y < -height) {
          y+=2*height;
        }
      } /*else {
        while(x > width) {
          x-=6*width;
        }
      }*/

      imageLayer.attr(
        "transform",
        `translate(${x},${y}) scale(${k})`
      );
      setScale(Number(event.transform.k.toFixed(1)));
    });

    zoomRef.current = zoom;
    resetRef.current = zoom;

    svg.call(zoom);

  }, [Map]);

  const zoomIn = () => {
    const svg = d3.select(svgRef.current);

    svg.transition()
      .duration(300)
      .call(zoomRef.current.scaleBy, 1.2);
  };

  const zoomOut = () => {
    const svg = d3.select(svgRef.current);

    svg.transition()
      .duration(300)
      .call(zoomRef.current.scaleBy, 0.8);
  };

  const Reset = () => {
    const svg = d3.select(svgRef.current);

    svg.call(resetRef.current.transform,d3.zoomIdentity);

  }

  return (
    <div className="top">
      <h1>日本人の移動可視化サイトマップ</h1>
      <div className="image">
        <div className="Scale-Button">
          <span>現在の倍率 : {Scale}倍</span>
          <button onClick={zoomIn}>+</button>
          <button onClick={zoomOut}>-</button>
        </div>

        <div className="Map-Button">
          <button 
          onClick={() => {
            setMap(MapName[0]);
            Reset();
          }}
          >日本地図
          </button>

          <button 
          onClick={() => {
            setMap(MapName[1]);
            Reset();
          }}
          >世界地図
          </button>
        </div>

        <svg ref={svgRef} width={width} height={height} >
          <g id="imageLayer">
            <>
            {MapId[Map].images.map((m,i) => (
              <image
              className="Japan"
              key={i}
              href={m.href}
              x={m.x}
              y={m.y}
              width={width}
              height={height}
              preserveAspectRatio="none"
              />
            ))}
        
            <line
            className="Number-of-people-moving"
            x1="500"
            y1="700"
            x2="500"
            y2="500"
            stroke="black"
            />
            </>
          </g>
        </svg>

      </div>
    </div>
  );
}