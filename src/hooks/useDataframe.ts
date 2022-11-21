import { DataFrame } from "danfojs";
import { readCSVBrowser } from "danfojs/dist/danfojs-base/io/browser";
import { useState, useEffect } from "react";

const createDataframe = async (csvUrl: string) => {
  console.time("Downloading CSV and covertion to Dataframe");
  const df = await readCSVBrowser(csvUrl);
  console.timeEnd("Downloading CSV and covertion to Dataframe");
  return df;
};

const getNumericColumns = (df: DataFrame) => {
  console.time("Getting numeric columns");
  const numericColumns = df.columns.filter((column) => {
    return df[column].dtype === "float32" || df[column].dtype === "int32";
  });
  console.timeEnd("Getting numeric columns");
  return numericColumns.slice(1);
};

const createMinMaxLookup = (df: DataFrame, numericColumns: string[]) => {
  console.time("Creating min/max lookup");
  const lookupTable = numericColumns.reduce((acc, c) => {
    acc[c] = {
      min: df.column(c).min(),
      max: df.column(c).max(),
    };
    return acc;
  }, {} as Record<string, { min: number; max: number }>);
  console.timeEnd("Creating min/max lookup");
  return lookupTable;
};

export const useDataframe = (csvUrl: string) => {
  const [dataframe, setDataframe] = useState<DataFrame | null>(null);
  const [numericColumns, setNumericColumns] = useState<string[]>([]);
  const [minMaxLookup, setMinMaxLookup] = useState<
    Record<string, { min: number; max: number }>
  >({});

  useEffect(() => {
    createDataframe(csvUrl).then((df) => setDataframe(df));
  }, []);

  useEffect(() => {
    if (dataframe) {
      setNumericColumns(getNumericColumns(dataframe));
    }
  }, [dataframe]);

  useEffect(() => {
    if (dataframe && numericColumns.length > 0) {
      setMinMaxLookup(createMinMaxLookup(dataframe, numericColumns));
    }
  }, [dataframe, numericColumns]);

  return { dataframe, numericColumns, minMaxLookup };
};
