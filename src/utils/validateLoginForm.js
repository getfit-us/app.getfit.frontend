export const validateLoginForm = (values) => {
    const errors = {};

   
    const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const regPassword = /[a-zA-Z\-0-9]+/;

   

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