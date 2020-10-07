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
    (end - start) / 2, // difference
];

const addZero = num => (num > 9 ? num : `0${num}`);

const transpose = arr => arr[0].map((col, i) => arr.map(row => row[i]));

const toViewModel = (cells) => {
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

const getHour = num => {
    const meridian = num < 12 || num === 24 ? 'AM' : 'PM';
    let hour = num > 12 ? num - 12 : num;
    return `${addZero(hour === 0 ? 12 : hour)} ${meridian}`;
};



module.exports = {
    joinHours,
    transpose,
    toViewModel,
    addZero,
    getHour
}