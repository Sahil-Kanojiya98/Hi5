import PropTypes from "prop-types";
import Chart from "react-apexcharts";

export default function LineChartOne({ name, fileName, seriesData }) {
  const options = {
    colors: ["#6284ff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "line",
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
      zoom: {
        enabled: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 1000,
        animateGradually: {
          enabled: true,
          delay: 200,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 500,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
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
    //     style: {
    //       fontSize: '18px',
    //       colors: ['#787878']
    //     }
    //   },
    //   style: {
    //     background: '#333333',
    //     color: '#ffffff'
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
          type="line"
          width="100%"
          height="310"
        />
      </div>
    </div>
  );
}

LineChartOne.propTypes = {
  name: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  seriesData: PropTypes.shape({
    x: PropTypes.arrayOf(PropTypes.string).isRequired,
    y: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
};

LineChartOne.defaultProps = {
  name: "",
  fileName: "file",
  seriesData: { x: [], y: [] },
};