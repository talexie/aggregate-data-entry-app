import moment from 'moment';
/**
 * Initialise a Date instance with Date.now() for Jest mocking.
 */
export default function getCurrentDate(calendar) {
    
    let currentDate = new Date(Date.now());

    if(calendar === 'ethiopian'){
        currentDate = new Date(moment(new Date(Date.now())?.toLocaleDateString('en-GB-u-ca-ethiopic').substring(0,10)));
    }
    // This will ensure that there's no rounding issue when calculating the
    // offset to the server time
    currentDate.setMilliseconds(0);

    return currentDate
}
