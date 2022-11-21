import { Center, LoadingOverlay, Title } from "@mantine/core";
import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { ChartData } from "./App";
import { EChartsOption } from "echarts";

const getOptions = (
  data: ChartData,
  columnsToPlot: string[]
): EChartsOption => {
  return {
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: data.localminute,
    },
    yAxis: {
      type: "value",
    },
    series: columnsToPlot.map((column) => ({
      data: data[column],
      type: "line",
      name: column,
      smooth: true,
      smoothMonotone: "x",
    })),
  };
};

export const Chart = ({
  data,
  columnsToPlot,
}: {
  data: ChartData | null;
  columnsToPlot: string[];
}) => {
  const [options, setOptions] = useState<EChartsOption>();

  useEffect(() => {
    if (data) {
      setOptions(getOptions(data, columnsToPlot));
    }
  }, [data]);

  if (data === null) {
    return (
      <Center mt="xl">
        <Title>No data</Title>;
      </Center>
    );
  }

  if (options === undefined) {
    return <LoadingOverlay visible />;
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactECharts option={options} style={{ height: "100%" }} />
    </div>
  );
};
