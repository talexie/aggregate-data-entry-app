/**
 * Initialise a Date instance with Date.now() for Jest mocking.
 */
export default function getCurrentDate(calendar='gregory') {
    
    let currentDate = new Date(Date.now());
    if(calendar === 'ethiopic'){
        currentDate = moment(new Date(Date.now())?.toLocaleDateString('en-GB-u-ca-ethiopic'));
    }

    // This will ensure that there's no rounding issue when calculating the
    // offset to the server time
    currentDate.setMilliseconds(0)

    return currentDate
}
