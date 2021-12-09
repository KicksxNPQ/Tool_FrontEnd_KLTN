import validate from 'validate.js';

function validateS(obj, constraint) {
    return validate(obj, constraint);
}

export default validateS;