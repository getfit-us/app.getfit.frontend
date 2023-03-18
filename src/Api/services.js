//going to refactor this file to be more readable and easier to use
//using swr for data fetching instead so its just one fetch request for each type GET , POST, PUT, DELETE

export const swrConfigNoRevalidate = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
  revalidateOnReconnect: false,
  revalidateOnMount: true,
};

export const InitialWorkout = [
  {
    _id: "",
    name: "loading...",
    exercises: [],
  },
];

export const getSWR = async (url = "", axiosPrivate) => {
  try {
    const response = await axiosPrivate.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const postSWR = async (url = "", axiosPrivate, data = {}) => {
  try {
    const response = await axiosPrivate.post(url, data);
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const putSWR = async (url = "", axiosPrivate, data = {}) => {
  try {
    const response = await axiosPrivate.put(url, data);
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const delSWR = async (url = "", axiosPrivate) => {
  try {
    const response = await axiosPrivate.delete(url);
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

/////---end of swr functions  ---/////////


