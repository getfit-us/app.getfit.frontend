import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { useMediaQuery } from "@mui/material";
import ViewMeasurementModal from "./ViewMeasurementModal";
import { useState } from "react";
import { useProfile } from "../../Store/Store";

// want to add clickable measurements to view modal

const MeasurementChart = ({ barSize, measurements }) => {
  const stateMeasurements = useProfile((state) => state.measurements);
  const [openMeasurement, setOpenMeasurement] = useState(false);
  const [viewMeasurement, setViewMeasurement] = useState([]);
  const handleMeasurementModal = () => setOpenMeasurement((prev) => !prev);
  const [status, setStatus] = useState({
    loading: false,
    error: false,
    success: false,
  });

  let width = 350;
  let sorted = [];
  measurements?.length > 0
    ? (sorted = measurements.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      ))
    : (sorted = stateMeasurements.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      ));
  const smScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"), {
    defaultMatches: true,
    noSsr: false,
  });

  const xsScreen = useMediaQuery((theme) => theme.breakpoints.down("xs"), {
    defaultMatches: true,
    noSsr: false,
  });

  const mdScreen = useMediaQuery((theme) => theme.breakpoints.down("md"), {
    defaultMatches: true,
    noSsr: false,
  });
  const lgScreen = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
    defaultMatches: true,
    noSsr: false,
  });

  if (mdScreen) width = 500;
  if (lgScreen) width = 600;
  if (smScreen) width = 300;
  if (xsScreen) width = 300;

  return (
    <>
      <ViewMeasurementModal
        open={openMeasurement}
        viewMeasurement={viewMeasurement}
        handleModal={handleMeasurementModal}
        status={status}
      />

      <BarChart
        width={width}
        height={300}
        data={sorted}
        margin={{
          top: 1,
          bottom: 1,
          left: 1,
          right: 15,
        }}
        barSize={12}
        barGap={0.5}
        onClick={(e) => {
          setViewMeasurement([e.activePayload[0].payload]);
          handleMeasurementModal();
        }}
        style={styles.chart}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip contentStyle={{ opacity: 0.9 }} />
        <Legend />

        <Bar name="Body fat %" dataKey="bodyfat" fill="#800923" />

        <Bar name="Weight (lbs)" dataKey="weight" fill="#3070af" />
      </BarChart>
    </>
  );
};

const styles = {
  chart: {
    fontSize: ".9rem",
    fontWeight: "bold",
    backgroundColor: "",
    backgroundImage: "",

    padding: "10px",

    justifyContent: "center",
    display: "flex",

    margin: 2,
  },
};

export default MeasurementChart;
