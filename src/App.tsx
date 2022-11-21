import { MantineProvider, Text } from "@mantine/core";
import { ChartFilter } from "./ChartFilter";

export type ChartData = Record<string, number[] | string[]>;

export default function App() {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
      }}
    >
      <div
        style={{
          width: "100vw",
          height: "100vh",
        }}
      >
        <ChartFilter />
      </div>
    </MantineProvider>
  );
}
