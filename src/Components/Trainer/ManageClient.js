//this is going to allow you to select a client and save data under their account. like measurements, workouts,
import { Grid } from "@mui/material";
import { useEffect, useState, useRef } from "react";

import Measurements from "../Measurements/Measurements";
import StartWorkout from "../Workout/StartWorkout/StartWorkout";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ViewWorkOuts from "../Workout/ViewWorkout/ViewWorkouts";
import Goals from "../Notifications/Goals";
import CalendarModal from "../Calendar/CalendarModal";
import ClientOptions from "./ClientOptions";
import ClientList from "./ClientList";
import AccountDetails from "./AccountDetails";
import "./ManageClient.css";

const ManageClient = () => {
  const axiosPrivate = useAxiosPrivate();

  const scroll = useRef(null);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const handleCalendarModal = () => setOpenCalendar((prev) => !prev);
  const topPage = document.getElementById("top");

  const [clientData, setClientData] = useState({
    assignedWorkouts: null,
    completedWorkouts: null,
    measurements: null,
    goals: null,
  });

  const [show, setShow] = useState({
    measurements: false,
    workouts: false,
    options: false,
    account: false,
    viewworkout: false,
    goals: false,
    task: false,
  });

  console.log(selectedClient, clientData);

  useEffect(() => {
    // use effect grab user api calls when selecting a new client
    const getAssignedCustomWorkouts = async () => {
      let isMounted = true;
      //add logged in user id to data and workout name
      //   values.id = state.profile.clientId;

      const controller = new AbortController();
      try {
        const response = await axiosPrivate.get(
          `/custom-workout/client/assigned/${selectedClient._id}`,
          {
            signal: controller.signal,
          }
        );
        setClientData((prev) => ({
          ...prev,
          assignedWorkouts: response.data,
        }));

        // reset();
      } catch (err) {
        console.log(err);

        if (err.response.status === 409) {
          //     setSaveError((prev) => !prev);
          //     setTimeout(() => setSaveError((prev) => !prev), 5000);
          //   }
        }
        return () => {
          isMounted = false;

          controller.abort();
        };
      }
    };

    const getMeasurements = async () => {
      const controller = new AbortController();
      try {
        const response = await axiosPrivate.get(
          `/measurements/client/${selectedClient._id}`,
          {
            signal: controller.signal,
          }
        );

        setClientData((prev) => ({ ...prev, measurements: response.data }));
      } catch (err) {
        console.log(err);
      }
      return () => {
        controller.abort();
      };
    };
    const getCompletedWorkouts = async () => {
      const controller = new AbortController();
      try {
        const response = await axiosPrivate.get(
          `/completed-workouts/client/${selectedClient._id}`,
          {
            signal: controller.signal,
          }
        );
        setClientData((prev) => ({
          ...prev,
          completedWorkouts: response.data,
        }));

        // console.log(state.workouts)
      } catch (err) {
        console.log(err);
      }
      return () => {
        controller.abort();
      };
    };

    const getGoals = async () => {
      const controller = new AbortController();
      try {
        const response = await axiosPrivate.get(
          `/users/calendar/${selectedClient._id}`,
          {
            signal: controller.signal,
          }
        );

        setClientData((prev) => ({
          ...prev,
          goals: response.data,
        }));
      } catch (err) {
        console.log(err);
      }
      return () => {
        controller.abort();
      };
    };
    if (selectedClient) {
      getAssignedCustomWorkouts();
      getMeasurements();
      getCompletedWorkouts();
      getGoals();
    setShow(null)
    }


  }, [selectedClient]);


  //going to create local state for the client that is selected

  return (
    <>
      <div id="top"></div>
      <CalendarModal
        open={openCalendar}
        handleModal={handleCalendarModal}
        currentDate={new Date()}
      />

      <div className="container-manage-clients">
        <ClientList setSelectedClient={setSelectedClient} setShow={setShow} />

        {show?.account ? (
          <AccountDetails selectedClient={selectedClient} />
        ) : show?.measurements ? (
          <Measurements
            clientId={selectedClient._id}
            trainerMeasurements={clientData.measurements}
          />
        ) : show?.workouts ? (
          <StartWorkout
            trainerWorkouts={clientData}
            clientId={selectedClient._id}
          />
        ) : show?.goals ? (
          <Goals trainerManagedGoals={clientData.goals} />
        ) : null}
        <div ref={scroll} style={{ mt: "5rem" }}>
          {" "}
        </div>
      </div>
    </>
  );
};

export default ManageClient;
