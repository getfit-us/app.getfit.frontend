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

const ManageClient = () => {
  const axiosPrivate = useAxiosPrivate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(0);
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

  const handleClientSelect = (event, index, id) => {
    setSelectedIndex(index);
    setSelectedClient(id);
    setShow((prev) => ({
      measurements: false,
      workouts: false,

      account: false,
      viewworkout: false,
      options: true,
    }));
    topPage.scrollIntoView();
  };

  const handleOptionsList = (event, index) => {
    setSelectedOption(index);

    if (index === 0) {
      setShow((prev) => ({
        measurements: true,
      }));
    }

    if (index === 1) {
      setShow((prev) => ({
        workouts: true,
      }));
    }

    if (index === 2)
      setShow((prev) => ({
        account: true,
      }));
    if (index === 3) {
      setShow((prev) => ({
        viewworkout: true,
      }));
    }
    if (index === 4) {
      setShow((prev) => ({
        goals: true,
      }));
    }
    if (index === 5) {
      handleCalendarModal();
    }

    setTimeout(() => {
      scroll.current.scrollIntoView();
    }, 100);
  };

  useEffect(() => {
    // use effect grab user api calls when selecting a new client
    const getAssignedCustomWorkouts = async () => {
      let isMounted = true;
      //add logged in user id to data and workout name
      //   values.id = state.profile.clientId;

      const controller = new AbortController();
      try {
        const response = await axiosPrivate.get(
          `/custom-workout/client/assigned/${selectedClient}`,
          {
            signal: controller.signal,
          }
        );
        setClientData((prev) => ({ ...prev, assignedWorkouts: response.data }));

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

    const getMeasurements = async (id) => {
      const controller = new AbortController();
      try {
        const response = await axiosPrivate.get(
          `/measurements/client/${selectedClient}`,
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
    const getCompletedWorkouts = async (id) => {
      const controller = new AbortController();
      try {
        const response = await axiosPrivate.get(
          `/completed-workouts/client/${selectedClient}`,
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
          `/users/calendar/${selectedClient}`,
          {
            signal: controller.signal,
          }
        );

        setClientData((prev) => ({
          ...prev,
          goals: response.data,
        }));

        // console.log(state.workouts)
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
      setTimeout(() => {
        document.getElementById("optionsList").scrollIntoView();
      }, 100);
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

      <Grid
        container
        gap={1}
        className="container-manage-clients"
        sx={{ mt: 10, justifyContent: "start" }}
      >
        <Grid item xs={12} sm={3} className="client-list">
          <ClientList
            handleClientSelect={handleClientSelect}
            selectedIndex={selectedIndex}
          />
        </Grid>

        {show?.options && (
          <Grid item xs={12} sm={3} className="options-list" id="optionsList">
            <ClientOptions
              handleOptionsList={handleOptionsList}
              selectedOption={selectedOption}
            />
          </Grid>
        )}
        {show?.account && (
          <Grid item xs={12} sm={3} className="options-list">
            <AccountDetails
              selectedIndex={selectedIndex}
              selectedClient={selectedClient}
              setShow={setShow}
            />
          </Grid>
        )}

        <Grid item xs={12} sm={8} sx={{ ml: 1 }}>
          {show?.measurements && (
            <Measurements
              clientId={selectedClient}
              trainerMeasurements={clientData.measurements}
            />
          )}
          {show?.workouts && (
            <StartWorkout
              trainerWorkouts={clientData}
              clientId={selectedClient}
            />
          )}

          {show?.viewworkout && (
            <ViewWorkOuts // need to fix
              trainerWorkouts={clientData}
              clientId={selectedClient}
            />
          )}
          {show?.goals && <Goals trainerManagedGoals={clientData.goals} />}
        </Grid>

        <div ref={scroll} style={{ mt: "5rem" }}>
          {" "}
        </div>
      </Grid>
    </>
  );
};

export default ManageClient;
