import ReactECharts from "echarts-for-react";
import { useMemo } from "react";
import calculateHumidityFromDewpoint from "../js/calculateHumidityFromDewpoint.js";
import { hourIsSandex, temperatureIsSandex } from "../js/isSandex.js";

function formatXAxisLabel(startTime) {
  const date = new Date(startTime);

  return date.toLocaleString("en-US", {
    weekday: "long",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
  });
}

export default function ForecastChart({ hours }) {
  const canRenderChart =
    typeof window !== "undefined" && typeof ResizeObserver !== "undefined";

  const option = useMemo(() => {
    const labels = hours.map((hour) => formatXAxisLabel(hour.startTime));
    const temperatures = hours.map((hour) => hour.temperature);
    const dewpoints = hours.map((hour) => hour.dewpoint);
    const humidityValues = hours.map((hour) =>
      calculateHumidityFromDewpoint(hour.temperature, hour.dewpoint),
    );
    const sandexHours = hours.map((hour, index) => {
      const humidity = humidityValues[index];

      return hourIsSandex(hour.temperature, humidity);
    });
    const sandexTimeRanges = [];
    let rangeStartIndex = null;

    sandexHours.forEach((isSandex, index) => {
      const isLast = index === sandexHours.length - 1;

      if (isSandex && rangeStartIndex === null) {
        rangeStartIndex = index;
      }

      if ((!isSandex || isLast) && rangeStartIndex !== null) {
        const rangeEndIndex = isSandex && isLast ? index : index - 1;

        sandexTimeRanges.push([
          {
            xAxis: labels[rangeStartIndex],
          },
          {
            xAxis: labels[rangeEndIndex],
          },
        ]);

        rangeStartIndex = null;
      }
    });
    const sandexTemperatureSeriesData = hours.map((hour, index) => {
      const humidity = humidityValues[index];

      if (!temperatureIsSandex(hour.temperature, humidity)) {
        return [labels[index], null];
      }

      return [labels[index], hour.temperature];
    });
    const sandexDewpointSeriesData = hours.map((hour, index) => {
      const humidity = humidityValues[index];

      if (!hourIsSandex(hour.temperature, humidity)) {
        return [labels[index], null];
      }

      return [labels[index], hour.dewpoint];
    });
    const dewpointSeriesData = hours.map((hour, index) => [
      labels[index],
      hour.dewpoint,
    ]);

    return {
      tooltip: {
        trigger: "axis",
      },
      visualMap: {
        show: false,
        type: "piecewise",
        seriesIndex: [1, 3],
        dimension: 1,
        pieces: [
          { lt: 50, color: "#0CF" },
          { gte: 50, lt: 56, color: "#0F0" },
          { gte: 56, lt: 61, color: "#FFCC03" },
          { gte: 61, lt: 66, color: "#FE9901" },
          { gte: 66, lt: 71, color: "#FF6500" },
          { gte: 71, lt: 76, color: "#FE0000" },
          { gte: 76, color: "#820204" },
        ],
      },
      grid: {
        left: 40,
        right: 20,
        top: 40,
        bottom: 30,
      },
      xAxis: {
        type: "category",
        data: labels,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Temperature",
          type: "line",
          smooth: true,
          data: temperatures,
          lineStyle: {
            width: 2,
          },
          markArea: {
            silent: true,
            itemStyle: {
              color: "rgba(12, 204, 0, 0.2)",
            },
            data: sandexTimeRanges,
          },
        },
        {
          name: "Dewpoint",
          type: "line",
          smooth: true,
          data: dewpointSeriesData,
          lineStyle: {
            width: 2,
          },
        },
        {
          name: "Temperature (Sandex)",
          type: "line",
          smooth: true,
          data: sandexTemperatureSeriesData,
          showSymbol: false,
          connectNulls: false,
          lineStyle: {
            width: 6,
            color: "#5470C6",
          },
          tooltip: {
            show: false,
          },
          z: 10,
        },
        {
          name: "Dewpoint (Sandex)",
          type: "line",
          smooth: true,
          data: sandexDewpointSeriesData,
          showSymbol: false,
          connectNulls: false,
          lineStyle: {
            width: 6,
          },
          tooltip: {
            show: false,
          },
          z: 10,
        },
      ],
    };
  }, [hours]);

  if (!canRenderChart) {
    return null;
  }

  return (
    <div id="forecast-chart">
      <ReactECharts
        option={option}
        opts={{ renderer: "svg" }}
        style={{ height: 320, width: "100%" }}
      />
    </div>
  );
}
