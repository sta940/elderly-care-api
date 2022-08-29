import moment from 'moment'

export function filterByDay(launches) {
    const today = new Date();
    const next = new Date();
    today.setUTCHours(0, 0, 0, 0);
    next.setUTCHours(24, 0, 0, 0);
    return launches.filter((launch) => {
        let launchDate = launch.date || launch.createdAt;
        launchDate = new Date(launchDate);
        return today.getTime() < launchDate.getTime() && launchDate.getTime() < next.getTime();
    })
}

export function filterByLastWeek(launches) {
    const todayMoment = moment();
    const weekMoment = todayMoment.clone().add(-7,'days')

    const today = new Date();
    today.setUTCHours(24, 0, 0, 0);
    const week = new Date(weekMoment.format());
    week.setUTCHours(24, 0,0,0);
    return launches.filter((launch) => {
        let launchDate = launch.date || launch.createdAt;
        launchDate = new Date(launchDate);
        return week.getTime() < launchDate.getTime() && launchDate.getTime() < today.getTime();
    })
}

export function filterByNextWeek(launches) {
    const todayMoment = moment();
    const weekMoment = todayMoment.clone().add(7,'days')

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const week = new Date(weekMoment.format());
    week.setUTCHours(0, 0,0,0);
    return launches.filter((launch) => {
        let launchDate = launch.date || launch.createdAt;
        launchDate = new Date(launchDate);
        return today.getTime() < launchDate.getTime() && launchDate.getTime() < week.getTime();
    })
}

export function filterByLastMonth(launches) {
    const todayMoment = moment();
    const monthMoment = todayMoment.clone().add(-30,'days')

    const today = new Date();
    today.setUTCHours(24, 0, 0, 0);
    const month = new Date(monthMoment.format());
    month.setUTCHours(24, 0,0,0);
    return launches.filter((launch) => {
        let launchDate = launch.date || launch.createdAt;
        launchDate = new Date(launchDate);
        return month.getTime() < launchDate.getTime() && launchDate.getTime() < today.getTime();
    })
}

export function filterByLastHalfYear(launches) {
    const todayMoment = moment();
    const monthMoment = todayMoment.clone().add(-182,'days')

    const today = new Date();
    today.setUTCHours(24, 0, 0, 0);
    const month = new Date(monthMoment.format());
    month.setUTCHours(24, 0,0,0);
    return launches.filter((launch) => {
        let launchDate = launch.date || launch.createdAt;
        launchDate = new Date(launchDate);
        return month.getTime() < launchDate.getTime() && launchDate.getTime() < today.getTime();
    })
}

export function filterByLastYear(launches) {
    const todayMoment = moment();
    const monthMoment = todayMoment.clone().add(-364,'days')

    const today = new Date();
    today.setUTCHours(24, 0, 0, 0);
    const month = new Date(monthMoment.format());
    month.setUTCHours(24, 0,0,0);
    return launches.filter((launch) => {
        let launchDate = launch.date || launch.createdAt;
        launchDate = new Date(launchDate);
        return month.getTime() < launchDate.getTime() && launchDate.getTime() < today.getTime();
    })
}

export function filterByNextMonth(launches) {
    const todayMoment = moment();
    const monthMoment = todayMoment.clone().add(30,'days')

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const month = new Date(monthMoment.format());
    month.setUTCHours(0, 0,0,0);
    return launches.filter((launch) => {
        let launchDate = launch.date || launch.createdAt;
        launchDate = new Date(launchDate);
        return today.getTime() < launchDate.getTime() && launchDate.getTime() < month.getTime();
    })
}


export function formatData(items) {
    const sorted = items.reduce((acc, it) => {
        const date = new Date(it.date);
        const key = `${date.getDate()}-${date.getMonth()}`
        if (acc[key]) {
            const val = { ...acc };
            val[key].push(it);
            return val;
        }
        return { ...acc, [key]: [it] };
    }, {});
    const res = [];

    Object.values(sorted).forEach((arr) => {
        const date = arr[0].date;
        let formattedDate = moment(date).locale('ru').format('LLLL');
        const textDateArr = formattedDate.split(', ');
        formattedDate = textDateArr[0] + '(' + textDateArr[1] + ')';
        const formattedArr = arr.map((it) => {
            let time = moment(it.date).add(3, 'hours').locale('ru').format('LT');
            time = time.length === 4 ? `0${time}` : time;
            return {...it, time}
        })
        res.push({
            formattedDate,
            data: formattedArr
        })
    })

    return res;
}

export function getMedicineSchedule(data, period) {
    const week = ['пн','вт','ср','чт','пт','сб','вс'];
    const periodMap = {'day': 1, 'week': 7, 'month': 30}
    const weekMap = {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: []
    }
    data.forEach((it) => {
        if (!it.days) return;
        it.days.forEach((day) => {
            weekMap[day].push(it);
        })
    })

    const res = [];
    for (let i = 0; i < periodMap[period]; i++) {
        const date = moment().add(i, 'days').locale('ru');
        const weekDay = date.format('dd');
        const dayKey = week.indexOf(weekDay) + 1;

        if (weekMap[dayKey].length !== 0) {
            let formattedDate = date.format('LLLL');
            const textDateArr = formattedDate.split(', ');
            formattedDate = textDateArr[0] + '(' + textDateArr[1] + ')';

            const items = weekMap[dayKey].map((it) => {
                const item = it.dataValues;
                const time = item.time.split(':');
                date.set("hour", time[0]).set("minute", time[1]).set("second", 0);
                return { ...item, dateTime: date }
            })

            res.push({
                formattedDate,
                data: items.sort((a,b) => {
                    const time1 = a.time.split(':');
                    const time2 = b.time.split(':');
                    if (time1[0] < time2[0]) {
                        return -1;
                    }
                    if (time1[0] > time2[0]) {
                        return 1;
                    } else {
                        if (time1[1] < time2[1]) {
                            return -1;
                        }
                        if (time1[1] > time2[1]) {
                            return 1;
                        }
                        return 0;
                    }
                })
            })
        }
    }
    return res;
}

export function filterDayForChart(values, type) {
    if (values.length === 0) {
        return [];
    }
    switch (type) {
        case 'ap': {
            const res1 = [], res2 = [];
            values[0].data.forEach((it) => {
                res1.push({x: it.time, y: Number(it.systolic)});
                res2.push({x: it.time, y: Number(it.distolic)})
            });
            return [[res1], [res2]];
        }
        case 'waist': {
            const res1 = [];
            values[0].data.forEach((it) => {
                res1.push({x: it.time, y: Number(it.circle)});
            });
            return [[res1]];
        }
        case 'bmi': {
            const res1 = [];
            values[0].data.forEach((it) => {
                res1.push({x: it.time, y: (it.weight / (Math.pow( it.height/100,2))).toFixed(2)});
            });
            return [[res1]];
        }
    }
}

export function filterWeekMonthForChart(values, type) {
    if (values.length === 0) {
        return [];
    }
    switch (type) {
        case 'ap': {
            const res1 = [], res2 = [];
            values.forEach((val) => {
                let minSis = 0, maxSis = 0;
                let minDis = 0, maxDis = 0;
                const date = moment(val.data[0].date).locale('ru');
                const splitDate = date.format('L').split('.');
                const formattedDate = splitDate[0] + '.' + splitDate[1];
                val.data.forEach((it) => {
                    if (Number(it.distolic) > maxDis) {
                        maxDis = Number(it.distolic);
                    }
                    if (Number(it.distolic) < minDis || minDis === 0) {
                        minDis = Number(it.distolic);
                    }
                    if (Number(it.systolic) > maxSis) {
                        maxSis = Number(it.systolic);
                    }
                    if (Number(it.systolic) < minSis || minSis === 0) {
                        minSis = Number(it.systolic);
                    }
                })
                res1.push([{x: formattedDate, y: minSis}, {x: formattedDate, y: maxSis}]);
                res2.push([{x: formattedDate, y: minDis}, {x: formattedDate, y: maxDis}]);
            })
            return [res1, res2];
        }
        case 'waist': {
            const res1 = [];
            values.forEach((val) => {
                let min = 0, max = 0;
                const date = moment(val.data[0].date).locale('ru');
                const splitDate = date.format('L').split('.');
                const formattedDate = splitDate[0] + '.' + splitDate[1];
                val.data.forEach((it) => {
                    if (Number(it.circle) > max) {
                        max = Number(it.circle);
                    }
                    if (Number(it.circle) < min || min === 0) {
                        min = Number(it.circle);
                    }
                })
                res1.push([{x: formattedDate, y: min}, {x: formattedDate, y: max}]);
            })
            return [res1];
        }
    }
}

export function filterForChart(values, type) {
    console.log(values)
}