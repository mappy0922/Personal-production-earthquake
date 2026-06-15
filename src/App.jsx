import * as d3 from "d3";
import { useState, useEffect, useRef } from "react";
import { travelData } from "./travelData";
import { feature } from "topojson-client";

const MapName = [
  "日本地図",
  "世界地図",
]

const transportation = [
  "移動目的",
  "移動手段"
]

export default function App() {
  const [size] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const width = size.width;
  const height = size.height;
  
  const [Scale , setScale] = useState(1);
  const [Map , setMap] = useState(MapName[0]);
  const [traffic, setTraffic] = useState(transportation[0]);
  const [mapData, setMapData] = useState(null);
  const [bounds, setBounds] = useState(null);

  const svgRef = useRef();
  const zoomRef = useRef();
  const resetRef = useRef();
  const layerRef = useRef();
  const projectionRef = useRef();

  useEffect(() => {
    if (Map === "日本地図") {
      fetch("/japan.geojson")
        .then(res => res.json())
        .then(setMapData);
    } else {
      fetch("/countries-110m.json")
        .then(res => res.json())
        .then(topology => {

          const geojson = feature(
            topology,
            topology.objects.countries
          );
          setMapData(geojson);
        });
    }
  }, [Map]);

  useEffect(() => {
    if (!mapData) return;

    const layer = d3.select(layerRef.current);
    layer.selectAll("path").remove();
    layer.selectAll(".world-copy").remove();

    const projection = 
    Map === "日本地図" 
    ? d3.geoMercator().fitSize([width,height], mapData)
    : d3.geoMercator().fitWidth(width, mapData);

    projectionRef.current = projection;

    const path = d3.geoPath().projection(projection);
    const bound = path.bounds(mapData);

    setBounds(bound);

    if(Map === "日本地図") {
      layer.selectAll("path")
        .data(mapData.features)
        .join("path")
        .attr("d", path)
        .attr("fill", "lightgreen")
        .attr("stroke", "black");
    } else { 
      [-1, 0, 1].forEach(i => {
        layer.append("g")
          .attr("class","world-copy")
          .attr(
            "transform",
            `translate(${i*width},0)`
          )
          .selectAll("path")
          .data(mapData.features)
          .join("path")
          .attr("d", path)
          .attr("fill", "lightgreen")
          .attr("stroke", "black");
      });
    }
  }, [mapData]);

  useEffect(() => {
    if(!bounds) {
      return;
    }

    const svg = d3.select(svgRef.current);

    const imageLayer = svg.select("#imageLayer");

    const zoom = d3.zoom()
    .scaleExtent([0.5, 14])
    .on("zoom", (event) => {
      const {x,y,k} = event.transform;

      let displayX = x;
      let displayY = y;
      const displayMargin = (k>1) ? 300*k : 0; 

      const minX = -((bounds[1][0]+bounds[0][0])/2)*k-displayMargin;
      const maxX = width-((bounds[1][0]+bounds[0][0])/2)*k+displayMargin;

      const minY = -((bounds[1][1]+bounds[0][1])/2-45)*k-displayMargin;
      const maxY = height-((bounds[1][1]+bounds[0][1])/2)*k+displayMargin;

      displayX = Math.max(minX, Math.min(maxX, displayX));
      displayY = Math.max(minY, Math.min(maxY, displayY));
      

      imageLayer.attr(
        "transform",
        `translate(${displayX},${displayY}) scale(${k})`
      );
      setScale(Number(k.toFixed(1)));
    });

    zoomRef.current = zoom;
    resetRef.current = zoom;

    svg.call(zoom);

  }, [Map,bounds]);

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

  const from =
  projectionRef.current?.([139.7671, 35.6812]);

  const to =
  projectionRef.current?.([141.3469, 43.0642]);

  return (
    <div className="top">
      <h1>日本人の移動可視化サイトマップ</h1>
      <div className="image">
        <div className="Scale-Button">
          <div>現在の倍率 : {Scale}倍</div>
          <button onClick={zoomIn}>+</button>
          <button onClick={zoomOut}>-</button>
        </div>

        <div className="control">
          <div className="item">
            <label>地図選択</label>
            <select
                className="Select"
                value={Map}
                onChange={(e) => {
                  setMap(e.target.value);
                  Reset();
                }}
            >
                {MapName.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
            </select>
          </div>

          <div className="item">
            <label>交通行動選択</label>
            <select
                className="Select"
                value={traffic}
                onChange={(e) => {
                  setTraffic(e.target.value);
                }}
            >
                {transportation.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <svg ref={svgRef} width={width} height={height} >
          <g  id="imageLayer">
            <g ref={layerRef}></g>
            
            <g id="lineLayer">
              {projectionRef.current && travelData.map((item,i) => {
                const from = projectionRef.current(item.fromCoord);
                const to = projectionRef.current(item.toCoord);

                return (
                  <line
                  key={i}
                  className="Number-of-people-moving"
                  x1={from[0]}
                  y1={from[1]}
                  x2={to[0]}
                  y2={to[1]}
                  stroke="gray"
                  strokeWidth="0.01"
                  />
                );
              })}
            </g>
          </g>
        </svg>

      </div>
    </div>
  );
}