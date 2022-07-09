export const validateAddWorkout = (values) => {
    const errors = {};

   
   

   

    if (!values.email) {
        errors.email = 'Required';

    } else if (!regEmail.test(values.email)) {
        errors.email = 'The email is invalid, must include a @ symbol and a domain name'
    }
    
    
    if(!values.password) {
        errors.password = 'Required';

    } else if (!regPassword.test(values.password)) {
        errors.password = 'The password is invalid';
    } else if ( values.password.length < 8 ) {
        errors.password = 'The password must be at least 8 characters long';
    }
    return errors;

}   