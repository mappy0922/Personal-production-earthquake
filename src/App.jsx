import * as d3 from "d3";
import { useState } from "react";

export default function App() {
  const width = 1250;
  const height = 650;
  
  const imageWidth = 600;
  const imageHeight = 600;

  const x = (width / 2) - (imageWidth / 2);
  const y = (height / 2) - (imageHeight / 2);

  return (
    <div className="top">
      <h1>日本人の移動可視化サイトマップ</h1>
      <div className="image">
        <svg width={width} height={height} >
          <image
          href="/map-full.svg"
          x={x}
          y={y}
          width={imageWidth}
          height={imageHeight}
          />
        </svg>
      </div>
    </div>
  );
}