import ReactECharts from "echarts-for-react";
import { useMemo } from "react";
import SunCalc from "suncalc";
import calculateHumidityFromDewpoint from "../js/calculateHumidityFromDewpoint.js";
import { hourIsSandex, temperatureIsSandex } from "../js/isSandex.js";
import { DEWPOINT_CHART_PIECES } from "../js/dewpointComfort.js";

function formatXAxisLabel(startTime) {
  const date = new Date(startTime);

  return date.toLocaleString("en-US", {
    weekday: "long",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
  });
}

function isNightHour(date, latitude, longitude) {
  const sunriseToday = SunCalc.getTimes(date, latitude, longitude).sunrise;
  const sunsetToday = SunCalc.getTimes(date, latitude, longitude).sunset;

  return date < sunriseToday || date >= sunsetToday;
}

function formatRoundedFahrenheit(value) {
  const maybeNumber = Array.isArray(value) ? value[value.length - 1] : value;
  const numericValue =
    typeof maybeNumber === "number" ? maybeNumber : Number(maybeNumber);

  if (!Number.isFinite(numericValue)) {
    return `${value}`;
  }

  return `${Math.round(numericValue)}°F`;
}

export default function ForecastChart({ hours, latitude, longitude, visibleWindow }) {
  const canRenderChart =
    typeof window !== "undefined" && typeof ResizeObserver !== "undefined";

  const option = useMemo(() => {
    const labels = hours.map((hour) => formatXAxisLabel(hour.startTime));    const hourDates = hours.map((hour) => new Date(hour.startTime));
    const temperatures = hours.map((hour) => hour.temperature);
    const dewpoints = hours.map((hour) => hour.dewpoint);
    const nightHours = hours.map((hour, index) => {
      if (typeof latitude !== "number" || typeof longitude !== "number") {
        return false;
      }

      return isNightHour(hourDates[index], latitude, longitude);
    });
    const nightTimeRanges = [];
    let nightRangeStartIndex = null;

    nightHours.forEach((isNight, index) => {
      const isLast = index === nightHours.length - 1;

      if (isNight && nightRangeStartIndex === null) {
        nightRangeStartIndex = index;
      }

      if ((!isNight || isLast) && nightRangeStartIndex !== null) {
        const rangeEndIndex = isNight && isLast ? index : index - 1;

        nightTimeRanges.push([
          {
            xAxis: labels[nightRangeStartIndex],
          },
          {
            xAxis: labels[rangeEndIndex],
          },
        ]);

        nightRangeStartIndex = null;
      }
    });
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

    const allValues = [...temperatures, ...dewpoints];
    const yAxisMin = Math.floor(Math.min(...allValues) / 5) * 5;
    const yAxisMax = Math.ceil(Math.max(...allValues) / 5) * 5;

    const viewportWindowData =
      visibleWindow &&
      visibleWindow.start >= 0 &&
      visibleWindow.end >= visibleWindow.start &&
      visibleWindow.start < labels.length
        ? [
            [
              { xAxis: labels[visibleWindow.start] },
              { xAxis: labels[Math.min(visibleWindow.end, labels.length - 1)] },
            ],
          ]
        : [];

    return {
      tooltip: {
        trigger: "axis",
      },
      visualMap: {
        show: false,
        type: "piecewise",
        seriesIndex: [3, 5],
        dimension: 1,
        pieces: DEWPOINT_CHART_PIECES,
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
          show: true,
          interval: 0,
          color: "#333",
          margin: 12,
          formatter: (_, index) => {
            const hourDate = hourDates[index];

            if (!hourDate || hourDate.getHours() !== 12) {
              return "";
            }

            return hourDate
              .toLocaleDateString("en-US", { weekday: "long" })
              .charAt(0);
          },
        },
      },
      yAxis: {
        type: "value",
        min: yAxisMin,
        max: yAxisMax,
      },
      series: [
        {
          name: "Night",
          type: "line",
          data: [],
          showSymbol: false,
          lineStyle: {
            width: 0,
          },
          tooltip: {
            show: false,
          },
          markArea: {
            silent: true,
            itemStyle: {
              color: "rgba(52, 78, 140, 0.04)",
              shadowBlur: 6,
              shadowColor: "rgba(52, 78, 140, 0.06)",
            },
            data: nightTimeRanges,
          },
          z: 0,
        },
        {
          name: "Viewport Window",
          type: "line",
          data: [],
          showSymbol: false,
          lineStyle: { width: 0 },
          tooltip: { show: false },
          markArea: {
            silent: true,
            itemStyle: {
              color: "rgba(30,60,114,0.10)",
              borderColor: "#2b4d8f",
              borderWidth: 1.5,
              borderType: [4, 3],
            },
            data: viewportWindowData,
          },
          z: 1,
        },
        {
          name: "Temperature",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: temperatures,
          tooltip: {
            valueFormatter: formatRoundedFahrenheit,
          },
          lineStyle: {
            width: 2,
            color: "#000",
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
          showSymbol: false,
          data: dewpointSeriesData,
          tooltip: {
            valueFormatter: formatRoundedFahrenheit,
          },
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
            color: "#0C0",
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
  }, [hours, latitude, longitude, visibleWindow]);

  if (!canRenderChart) {
    return null;
  }

  return (
    <div id="forecast-chart">
      <ReactECharts
        option={option}
        opts={{ renderer: "svg" }}
        style={{ height: 320, width: "100%" }}
        notMerge={true}
      />
    </div>
  );
}
