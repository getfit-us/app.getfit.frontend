import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { MenuItem, TextField } from "@mui/material";
import { useState } from "react";

const rows = [];
function findAllByKey(obj, keyToFind) {
  return Object.entries(obj).reduce(
    (acc, [key, value]) =>
      key === keyToFind
        ? acc.concat(value)
        : typeof value === "object"
        ? acc.concat(findAllByKey(value, keyToFind))
        : acc,
    []
  );
}

const ExerciseHistory = ({ exerciseHistory, currentExercise }) => {

    const [selected, setSelected] = useState(0);
console.log(exerciseHistory)
   
    if (Object.keys(exerciseHistory)?.length === 0 ) {
        return (
            <Paper elevation={5} sx={{borderRadius: 10}}>
                <h3 style={{padding: 1, textAlign: 'center'}}>Sorry</h3>
                <h4 style={{padding: 1, textAlign: 'center'}}> No Exercise History Found</h4>
            </Paper>
        )
    

    }





    // extract dates from array
  let dates = exerciseHistory[currentExercise]?.map((exercise) => {
    return findAllByKey(exercise, "dateCompleted");
  });
//   console.log(exerciseHistory[currentExercise][0], dates);
  return (
    <>
      <TextField select label="Date" defaultValue='null' onChange={(e) => {
        setSelected(e.target.value)
        

      } }><MenuItem value='null'>Select A Date...</MenuItem>
        {exerciseHistory[currentExercise].map((exercise, index) => {
                       return (
            <MenuItem key={index+ 2} value={index}>
              {dates[index]}
            </MenuItem>
          );
        })}
      </TextField>
      <Paper>
        <div style={{padding: 3}}>
      <h3>{currentExercise}</h3>
        {exerciseHistory[currentExercise][selected]?.map((set,idx) => {
           
                return (
                        <>
                        
                        <p>Set# {idx+1} Weight: {set.weight} Reps: {set.reps}</p>
                        </>
                        )
                

        })}
        </div>
         </Paper>
      
    </>
  );
};

export default ExerciseHistory;
