import ReactECharts from "echarts-for-react";
import { useMemo, useRef, useState, useEffect } from "react";
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

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!canRenderChart || !containerRef.current) return;
    const el = containerRef.current;
    setContainerWidth(el.offsetWidth);
    const ro = new ResizeObserver(() => setContainerWidth(el.offsetWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [canRenderChart]);

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

      return temperatureIsSandex(hour.temperature, humidity)
        ? hour.temperature
        : null;
    });
    const sandexDewpointSeriesData = hours.map((hour, index) => {
      const humidity = humidityValues[index];

      return hourIsSandex(hour.temperature, humidity) ? hour.dewpoint : null;
    });

    const allValues = [...temperatures, ...dewpoints];
    const yAxisMin = Math.floor(Math.min(...allValues) / 5) * 5;
    const yAxisMax = Math.ceil(Math.max(...allValues) / 5) * 5;

    return {
      animation: false,
      tooltip: {
        trigger: "axis",
      },
      visualMap: {
        show: false,
        type: "piecewise",
        seriesIndex: [2, 4],
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
          data: dewpoints,
          tooltip: {
            valueFormatter: formatRoundedFahrenheit,
          },
          lineStyle: {
            width: 2,
          },
          emphasis: {
            disabled: true,
          },
        },
        {
          name: "Temperature (Sandex)",
          type: "line",
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

  const GRID_LEFT = 40;
  const GRID_RIGHT = 20;
  const GRID_TOP = 40;
  const CHART_HEIGHT = 320;
  const GRID_BOTTOM = 30;

  let overlayStyle = null;

  if (visibleWindow && containerWidth > 0 && hours.length > 0) {
    const contentWidth = containerWidth - GRID_LEFT - GRID_RIGHT;
    const slotWidth = contentWidth / hours.length;
    const start = Math.max(0, visibleWindow.start);
    const end = Math.min(visibleWindow.end, hours.length - 1);

    if (start <= end) {
      overlayStyle = {
        position: "absolute",
        left: `${GRID_LEFT + start * slotWidth}px`,
        top: `${GRID_TOP}px`,
        width: `${(end - start + 1) * slotWidth}px`,
        height: `${CHART_HEIGHT - GRID_TOP - GRID_BOTTOM}px`,
        backgroundColor: "rgba(30,60,114,0.10)",
        border: "1.5px dashed #2b4d8f",
        pointerEvents: "none",
        boxSizing: "border-box",
      };
    }
  }

  return (
    <div id="forecast-chart" ref={containerRef} style={{ position: "relative" }}>
      <ReactECharts
        key={hours.length}
        option={option}
        opts={{ renderer: "svg" }}
        style={{ height: CHART_HEIGHT, width: "100%" }}
        notMerge={true}
      />
      {overlayStyle && <div aria-hidden="true" style={overlayStyle} />}
    </div>
  );
}
