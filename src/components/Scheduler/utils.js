import _ from 'lodash';

const dayMap = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
];

const joinHours = (start, end) => [
    `${getHour(start)} - ${getHour(end)}`,
    (end - start) / 2,
];

const getTimeSlot = hour =>
    `${addZero(hour)}:00-${addZero(hour + 1 === 24 ? 0 : hour + 1)}:00`;

const addZero = num => (num > 9 ? num : `0${num}`);

// SRC: https://stackoverflow.com/a/17428705/3764306
const transpose = arr => arr[0].map((col, i) => arr.map(row => row[i]));

/**
 * Convert cells to the timeSlots
 * @param {Array} cells - the preference given by user
 * @param {Number} startHour - the starting hour in the preference table
 * @returns {object}
 */
export const toTimeSlots = (cells, startHour = 0) => {
    const preference = {};
    const chunked = {};
    let start = startHour;
    dayMap.forEach(day => {
        preference[day] = {
            preferred: [],
        };
    });
    const dayWiseCal = transpose(cells);
    dayWiseCal.shift();
    dayWiseCal.forEach((day, index) => {
        dayWiseCal[index].shift();
        chunked[dayMap[index]] = _.chunk(dayWiseCal[index]);
    });
    dayMap.forEach(day => {
        chunked[day].forEach((chunkedPairs, index) => {
            const selectedSlot = [];
            const time = start + index;
            if (chunkedPairs.includes(true)) {
                selectedSlot.push(getTimeSlot(time));
                preference[day].preferred.push(selectedSlot);
            }
        });
        start = startHour;
    });
    return preference;
};

/**
 * Convert cells to readable format in the preference preview table
 * @param {Array} cells - the preference given by user
 * @returns {object}
 */
export const toViewModel = (cells) => {
    const preference = {};
    dayMap.forEach(day => {
        preference[day] = {
            preferred: [],
        }
    });
    const dayWiseCal = transpose(cells);
    const startHour = 0;
    for (let i = 1; i < dayWiseCal.length; i += 1) {
        let start = null;
        let end = null;
        for (let j = 1; j < dayWiseCal[0].length; j += 1) {
            if (dayWiseCal[i][j]) {
                if (end !== j) {
                    if (end) {
                        preference[dayMap[i - 1]].preferred.push(
                            joinHours(startHour + start - 1, startHour + end - 1),
                        );
                    }
                    start = j;
                }
                end = j + 1;
            }
        }
        if (start && end) {
            preference[dayMap[i - 1]].preferred.push(
                joinHours(startHour + start - 1, startHour + end - 1),
            );
        }
    }
    return preference;
}

export const addBufferHours = slots => {
    const preference = {};

    dayMap.forEach(day => {
        preference[day] = [];
        if (slots[day].preferred && slots[day].preferred[0]) {
            console.log(slots[day].preferred[0]);
            console.log(slots[day].preferred[0][0].substring(0, 2));
        }
    })
}

export const convertTimeSlotsToCells = slots => {
    const preference = {};
    const cells = new Array(25).fill(1).map(() => new Array(8).fill(false));
    const transposedCells = transpose(cells);

    dayMap.forEach(day => {
        preference[day] = [];
        slots[day].preferred.forEach(timeSlot => {
            const hour = Number(timeSlot[0].substring(0, 2));
            if (timeSlot.length === 2) preference[day].push(hour, hour + 1);
            else
                preference[day].push(
                    hour + (timeSlot[0].split('-')[0].includes('30') ? 1 : 0),
                );
        });
    });

    for (let i = 1; i <= dayMap.length; i += 1) {
        const timeSlot = preference[dayMap[i - 1]];
        for (let j = 0; j < timeSlot.length; j += 1) {
            transposedCells[i][timeSlot[j] + 1] = true;
        }
    }
    return transpose(transposedCells);
};

export const getHour = num => {
    const meridian = num < 12 || num === 24 ? 'AM' : 'PM';
    let hour = num > 12 ? num - 12 : num;
    return `${addZero(hour === 0 ? 12 : hour)} ${meridian}`;
};
