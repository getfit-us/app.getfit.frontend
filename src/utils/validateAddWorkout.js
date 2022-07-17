export const validateAddWorkout = (values) => {
    const errors = {};

    console.log(values);


    const regExercise = /Exercise[0-9]+$/
    const regNum = /^\d+$/;



    //check if exercise field is present set weight, reps, set to required





    if (!values.Date) {
        errors.Date = 'Required';
    }

    for (const [field, value] of Object.entries(values)) {
        //loop through object properties grab exercise items and validate
        if (regExercise.test(field)) {

            if (value && value !== 'null') {
                const curNum = field.slice(-1)

                //validate  weight fields 
                if (!values['Weight' + curNum]) {
                    errors['Weight' + curNum] = 'Required (input 0 for body weight exercises)';
                } else if (!regNum.test(values['Weight' + curNum])) {
                    errors['Weight' + curNum] = 'Please enter numbers only';
                }

                //validate reps fields
                if (!values['Reps' + curNum]) {
                    errors['Reps' + curNum] = 'Required';

                }

                //validate set fields
                if (!values['Sets' + curNum]) {
                    errors['Sets' + curNum] = 'Required';

                }

                // console.log(`${field}: ${value}`);
            }



        }

        // console.log(`${field}: ${value}`);
    }



    return errors;

}   