import React, { useRef, type Dispatch, type SetStateAction } from "react";
import { useVegaEmbed } from "react-vega";

interface VegaChartProps {
  spec: any;
  setEmbeded: Dispatch<SetStateAction<any>>;
  setVegaError?: Dispatch<SetStateAction<any>>;
}

const VegaChart: React.FC<VegaChartProps> = ({
  spec,
  setEmbeded,
  setVegaError,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  console.log("VegaChart spec:", spec);
  console.log("VegaChart spec:", spec?.data.values.length);
  const paddingOuter = spec?.data.values.length > 5 ? 0.4 : 0.6;
  const embed = useVegaEmbed({
    ref: chartRef,
    spec: {
      ...JSON.parse(JSON.stringify(spec)),

      width: "container",
      height: spec?.data.values.length > 10 ? { step: 30 } : "container",
      // height: { step: 30 },

      // autosize: {
      //   contains: "padding",
      // },
      autosize: {
        type: "fit", // or "fit-x", "fit-y" depending on layout
        contains: "padding", // ensures marks stay within padding
      },

      config: {
        view: {
          // Optional, to remove default Vega padding
          continuousWidth: 400,
          continuousHeight: 300,
          stroke: "transparent",
        },
        scale: {
          bandPaddingOuter: 0.8,
          bandPaddingInner: paddingOuter,
        },
        // background: "transparent",
        axis: {
          labelFontSize: 12,
          labelPadding: 10,
          titleFontSize: 15,
          titleFontStyle: "sans",
          titlePadding: 10,
        },
        legend: {
          labelFont: "Poppins",
          labelFontSize: 12,
          // labelColor: "#ddd",
          titleFont: "Poppins",
          titleFontSize: 14,
          // titleColor: "#fff",
        },
      },
    },
    options: {
      mode: "vega-lite",
      actions: false,
      // renderer: "canvas",
    },
    onError: (error: any) => {
      console.log(error?.message);
      console.log(error);
      setVegaError?.(
        "We couldn’t generate the chart. Please try again in a moment."
      );
    },
  });

  React.useEffect(() => {
    if (!chartRef.current || !embed) return;
    const observer = new ResizeObserver(() => {
      window.dispatchEvent(new Event("resize"));
      embed?.view.runAsync();
    });

    observer.observe(chartRef.current);
    setEmbeded(embed);
    return () => {
      observer.disconnect();
    };
  }, [embed]);

  // const downloadPNG = async () => {
  //   if (!embed?.view) return;
  //   const url = await embed?.view.toImageURL("png");
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "chart.png";
  //   a.click();
  // };
  // const downloadSVG = async () => {
  //   if (!embed?.view) return;
  //   const svg = await embed?.view.toSVG();
  //   const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "chart.svg";
  //   a.click();
  // };

  return (
    <div
      // style={{ position: "relative", width: "100%", height: "500px" }}
      style={
        {
          // resize: "both",
          // border: "1px solid black",
          // overflow: "hidden",
          // display: "flex",
          // width: "100%",
          // height: "100%",
          // scrollbarWidth: "none",
        }
      }
      className="w-full h-full  px-4 py-4 cursor-pointer flex flex-col justify-center items-center gap-100 overflow-auto scrollbar-width"
    >
      {/* <div ref={chartRef} style={{ width: "100%", height: "100%" }}></div> */}

      <div
        ref={chartRef}
        style={{
          flex: 1,

          width: "100%",
          maxHeight: "100%",
          borderRadius: "0.5rem",
          // maxWidth: "600px",
          // margin: "auto",
        }}
      />
    </div>
  );
};

export default VegaChart;
