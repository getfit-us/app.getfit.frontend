// set default message content so they all follow the same conventions

let date = new Date();
date = date.toISOString();
date = date.split("T");

const CREATED_NEW_CUSTOM_WORKOUT = (user, trainer, req) => {
  let userMSG = `${date[0]}: created new workout: ${req.body.name}`;
  let trainerMSG = `${date[1]}: ${user.firstname} ${user.lastname} created workout: ${req.body.name}`;
  return {userMSG, trainerMSG}
};

const UPDATED_CUSTOM_WORKOUT = (user, trainer, req) => {
  let userMSG = `${date[0]}: ${trainer.firstname} has assigned workout: ${req.body.name}`;
  let trainerMSG = `${date[0]}: ${user.firstname} ${user.lastname} assigned workout: ${req.body.name}`;
  return {userMSG, trainerMSG}};

const ADDED_NEW_MEASUREMENT = (user, trainer, req) => {
  let userMSG = `${date[0]}: added measurement.`;
  let trainerMSG = `${date[0]}: ${user.firstname} ${user.lastname} added a measurement.`;
  return {userMSG, trainerMSG}};

  const COMPLETED_WORKOUT = (user, trainer, req) => {
    let userMSG = `${date[0]}: completed workout ${req.body.name}`;
    let trainerMSG = `${date[0]}: ${user.firstname} ${user.lastname} completed workout: ${req.body.name}.`;
    return {userMSG, trainerMSG};
  }

const NEW_USER_REGISTER = (user, trainer, req) => {
  let trainerMSG = `${date[0]}: A new client: ${user.firstname} ${user.lastname} has registered!.`;
  let userMSG = `${date[0]}: ${user.firstname} ${user.lastname} Welcome to getfit!.`;
  return {userMSG, trainerMSG};
}



module.exports = {
  CREATED_NEW_CUSTOM_WORKOUT,
  UPDATED_CUSTOM_WORKOUT,
  ADDED_NEW_MEASUREMENT,
  COMPLETED_WORKOUT,
  NEW_USER_REGISTER,
};
