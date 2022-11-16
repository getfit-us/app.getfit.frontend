import { useReducer, useEffect } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import { useProfile, useWorkouts } from "../Store/Store";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...initialState, loading: true };
    case "success":
      return { ...initialState, data: action.data };
    case "error":
      return { ...initialState, error: action.error };
    default:
      throw new Error();
  }
}

const useApiCallOnMount = (service) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const axiosPrivate = useAxiosPrivate();
  const profileState = useProfile((state) => state);
  const workoutState = useWorkouts((state) => state);

  useEffect(() => {
    dispatch({ type: "loading" });
    service(axiosPrivate, profileState, workoutState)
      .then((data) => {
        dispatch({ type: "success", data });
      })
      .catch((error) => {
        dispatch({ type: "success", error });
      });
  }, [service]);

  return [state.loading, state.data, state.error];
};

export default useApiCallOnMount;
