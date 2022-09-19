export const validateSignupForm = (values) => {
    const errors = {};

    const regNum = /^\d+$/;
    const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const regPassword = /[a-zA-Z\-0-9]+/;

    if (!values.firstName) {
        errors.firstName = 'Required';

    } else if (values.firstName.length < 2 || values.firstName.length > 15) {
        errors.firstName = 'Invalid length of first name';

    }

    if (!values.lastName) {
        errors.lastName = 'Required';

    } else if (values.lastName.length < 2 || values.lastName.length > 15) {
        errors.lastName = 'Invalid length of last name';

    }

    
    if (!values.phoneNum) {
        errors.phoneNum = 'Required';
        
    } else if (!regNum.test(values.phoneNum)) {
        errors.phoneNum = 'The phone number should contain only numbers';
    }

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

    if(!values.password2) {
        errors.password2 = 'Required';

    } else if (!regPassword.test(values.password2)) {
        errors.password2 = 'The password is invalid';
    } else if ( values.password2.length < 8 ) {
        errors.password2 = 'The password must be at least 8 characters long';
    } else if ( values.password2 !== values.password ) {
        errors.password2 = 'Passwords do not match';
    }


    return errors;

}   