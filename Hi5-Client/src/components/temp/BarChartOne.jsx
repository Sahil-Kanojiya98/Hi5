import Chart from "react-apexcharts";
import PropTypes from "prop-types";

export default function BarChartOne({ name, fileName, seriesData }) {
  const options = {
    colors: ["#6284ff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 310,
      toolbar: {
        show: true,
        export: {
          csv: {
            filename: `${fileName}Data`,
          },
          svg: {
            filename: `${fileName}Chart`,
          },
          png: {
            filename: `${fileName}Chart`,
          },
        },
      },
      animations: {
        enabled: true,
        easing: "easeout",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    xaxis: {
      categories: seriesData?.x || [],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#787878",
          fontSize: "14px",
        },
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: { text: undefined },
      labels: {
        style: {
          colors: "#787878",
          fontSize: "14px",
        },
      },
    },
    grid: {
      yaxis: { lines: { show: true } },
    },
    // tooltip: {
    //   enabled: true,
    //   x: { show: false },
    //   // y: { formatter: (val) => `${val}` },
    //   y: {
    //     formatter: (val, { seriesIndex, dataPointIndex, w }) => {
    //       const prev = dataPointIndex > 0 ? w.config.series[seriesIndex].data[dataPointIndex - 1] : 0;
    //       const change = prev ? ((val - prev) / prev * 100).toFixed(2) : "N/A";
    //       return `${val}     (${change > 0 ? "+" : ""}${change}%)`;
    //     },
    //   }
    // },

    tooltip: {
      enabled: true,
      x: { show: false },
      y: {
        formatter: (val, { seriesIndex, dataPointIndex, w }) => {
          const prev = dataPointIndex > 0 ? w.config.series[seriesIndex].data[dataPointIndex - 1] : 0;
          const change = prev ? ((val - prev) / prev * 100).toFixed(2) : "N/A";
          return `${val}     (${change > 0 ? "+" : ""}${change}%)`;
        },
      },
      style: {
        fontSize: "12px",
        colors: ["#ffcc00"]
      },
      theme: "dark", // Makes the tooltip background dark
      fillSeriesColor: false,
      marker: {
        show: false
      },
      onDatasetHover: {
        highlightDataSeries: true
      }
    }
    
  };

  return (
    <div className="max-w-full">
      <div className="w-full">
        <Chart
          options={options}
          series={[{ name: name, data: seriesData?.y || [] }]}
          type="bar"
          width="100%"
          height="310"
        />
      </div>
    </div>
  );
}

BarChartOne.propTypes = {
  name: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  seriesData: PropTypes.shape({
    x: PropTypes.arrayOf(PropTypes.string).isRequired,
    y: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
};

BarChartOne.defaultProps = {
  name: "",
  fileName: "file",
  seriesData: { x: [], y: [] },
};