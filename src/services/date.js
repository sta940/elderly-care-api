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
                date.set("hour", Number(time[0]) + 3).set("minute", time[1]).set("second", 0);
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