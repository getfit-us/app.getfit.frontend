// set default message content so they all follow the same conventions

let date = new Date();
date = date.toISOString();
date = date.split("T");

//may add html tags these messages later on........
const CREATED_NEW_CUSTOM_WORKOUT = (user, trainer, req) => {
  let userMSG = `${date[0]}: created new workout: ${req.body.name}`;
  let trainerMSG = `${date[1]}: ${user.firstname} ${user.lastname} created workout: ${req.body.name}`;
  return { userMSG, trainerMSG };
};

const UPDATED_CUSTOM_WORKOUT = (user, trainer, req) => {
  let userMSG = `${date[0]}: ${trainer.firstname} has assigned workout: ${req.body.name}`;
  let trainerMSG = `${date[0]}: ${user.firstname} ${user.lastname} assigned workout: ${req.body.name}`;
  return { userMSG, trainerMSG };
};

const ADDED_NEW_MEASUREMENT = (user, trainer, req) => {
  let userMSG = `${date[0]}: added measurement.`;
  let trainerMSG = `${date[0]}: ${user.firstname} ${user.lastname} added a measurement.`;
  return { userMSG, trainerMSG };
};

const COMPLETED_WORKOUT = (user, trainer, req) => {
  let userMSG = `${date[0]}: completed workout ${req.body.name}`;
  let trainerMSG = `${date[0]}: ${user.firstname} ${user.lastname} completed workout: ${req.body.name}.`;
  return { userMSG, trainerMSG };
};

const NEW_USER_REGISTER = (user, trainer, req) => {
  let trainerMSG = `${date[0]}: A new client: ${user.firstname} ${user.lastname} has registered!.`;
  let userMSG = `${date[0]}: ${user.firstname} ${user.lastname} Welcome to getfit!.`;
  return { userMSG, trainerMSG };
};

const SET_NEW_GOAL = (user, trainer, req, newGoalsObj) => {
  if (newGoalsObj.length === 1) {
    let trainerMSG = `${date[0]}: ${user.firstname} ${user.lastname} has set a new goal. ${newGoalsObj[0].goal}`;
    let userMSG = `${date[0]}: ${newGoalsObj[0].goal}. Goal Date: ${newGoalsObj[0].date}.`;
    let goalID = newGoalsObj[0].id;

    return { userMSG, trainerMSG, goalID };
  } else if (newGoalsObj.length > 1) {
    let msgArr = [];
    for (let i = 0; i < newGoalsObj.length; i++) {
      let trainerMSG = `${date[0]}: ${user.firstname} ${user.lastname} has set a new goal. ${newGoalsObj[i].goal}`;
      let userMSG = `${date[0]}: ${newGoalsObj[i].goal}. Goal Date: ${newGoalsObj[i].date}.`;
      let goalID = newGoalsObj[i].id;
      msgArr.push({ userMSG, trainerMSG, goalID });
    }
    return msgArr;
  }
};
const GOAL_ACHIEVED = (user, trainer, req, newGoalsObj) => {
  if (newGoalsObj.length === 1) {
    let trainerMSG = `${date[0]}: ${user.firstname} ${user.lastname} has completed goal: ${newGoalsObj[0].goal}`;
    let userMSG = `${date[0]}: goal ${newGoalsObj[0].goal}. Completed!!`;
    let goalID = newGoalsObj[0].id;

    return { userMSG, trainerMSG, goalID };
  } else if (newGoalsObj.length > 1) {
    let msgArr = [];
    for (let i = 0; i < newGoalsObj.length; i++) {
    // loop over array of new goal objects add to array and return them
    let trainerMSG = `${date[0]}: ${user.firstname} ${user.lastname} has completed goal: ${newGoalsObj[i].goal}`;
    let userMSG = `${date[0]}: goal ${newGoalsObj[i].goal}. Completed!!`;
    let goalID = newGoalsObj[i].id;
    msgArr.push({ userMSG, trainerMSG, goalID });
    }
    return msgArr;
  }
};

module.exports = {
  CREATED_NEW_CUSTOM_WORKOUT,
  UPDATED_CUSTOM_WORKOUT,
  ADDED_NEW_MEASUREMENT,
  COMPLETED_WORKOUT,
  NEW_USER_REGISTER,
  SET_NEW_GOAL,
  GOAL_ACHIEVED
};
