import {
  Button,
  LoadingOverlay,
  RangeSlider,
  Select,
  Stack,
} from "@mantine/core";
import { toJSONBrowser } from "danfojs/dist/danfojs-base/io/browser";
import { FormEvent, useEffect, useState } from "react";
import { ChartData } from "./App";
import { Chart } from "./Chart";
import { useDataframe } from "./hooks/useDataframe";

export const ChartFilter = () => {
  const { dataframe, numericColumns, minMaxLookup } = useDataframe(
    "https://res.cloudinary.com/dfpoqynvt/raw/upload/v1668760395/1mn-6_ngm12m.csv"
  );

  const [column, setColumn] = useState<string | null>(null);
  const [range, setRange] = useState<[number, number]>([0, 0]);
  const [filteredData, setFilteredData] = useState<ChartData | null>(null);

  useEffect(() => {
    if (dataframe && column) {
      const { min, max } = minMaxLookup[column];
      setRange([min, max]);
    }
  }, [dataframe, column]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!column || !dataframe) return;

    console.time("Run filter query");
    const col = dataframe.column(column);
    const filteredDF = dataframe.query(col.ge(range[0]).and(col.le(range[1])));
    const filteredChartData = toJSONBrowser(filteredDF, {
      format: "row",
    }) as ChartData;
    console.timeEnd("Run filter query");
    setFilteredData(filteredChartData);
  };

  if (dataframe === null) {
    return <LoadingOverlay visible />;
  }

  return (
    <Stack pt="xl" h="100%">
      <form
        style={{ maxWidth: "400px", marginInline: "auto" }}
        onSubmit={handleSubmit}
      >
        <Stack>
          <Select
            label="Choose column to filter"
            data={numericColumns}
            value={column}
            onChange={setColumn}
          />

          {column && (
            <RangeSlider
              min={minMaxLookup[column].min}
              max={minMaxLookup[column].max}
              label={(v) => v.toFixed(2)}
              minRange={0.001}
              step={0.001}
              value={range}
              onChange={setRange}
            />
          )}
          <Button type="submit">Filter</Button>
        </Stack>
      </form>
      <Chart data={filteredData} columnsToPlot={[column || "grid"]} />
    </Stack>
  );
};
