import ReactECharts from "echarts-for-react";
import { useMemo } from "react";
import SunCalc from "suncalc";
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

function isNightHour(date, latitude, longitude) {
  const sunriseToday = SunCalc.getTimes(date, latitude, longitude).sunrise;
  const sunsetToday = SunCalc.getTimes(date, latitude, longitude).sunset;

  return date < sunriseToday || date >= sunsetToday;
}

export default function ForecastChart({ hours, latitude, longitude }) {
  const canRenderChart =
    typeof window !== "undefined" && typeof ResizeObserver !== "undefined";

  const option = useMemo(() => {
    const labels = hours.map((hour) => formatXAxisLabel(hour.startTime));
    const hourDates = hours.map((hour) => new Date(hour.startTime));
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

    return {
      tooltip: {
        trigger: "axis",
      },
      visualMap: {
        show: false,
        type: "piecewise",
        seriesIndex: [2, 4],
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
          name: "Temperature",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: temperatures,
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
  }, [hours, latitude, longitude]);

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
