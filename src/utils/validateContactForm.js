export const validateContactForm = (values) => {
    const errors = {};

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

    const regNum = /^\d+$/;
    const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regNum.test(values.phoneNumber)) {
        errors.phoneNumber = 'The phone number should contain only numbers';
    }

    if (!regEmail.test(values.email)) {
        errors.email = 'The email is invalid, must include a @ symbol and a domain name'
    }
    return errors;
    

}   