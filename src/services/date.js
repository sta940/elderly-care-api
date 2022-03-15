import moment from 'moment'

export function filterByLastWeek(launches) {
    const todayMoment = moment();
    const weekMoment = todayMoment.clone().add(-7,'days')

    const today = new Date();
    today.setUTCHours(24, 0, 0, 0);
    const week = new Date(weekMoment.format());
    week.setUTCHours(24, 0,0,0);
    return launches.filter((launch) => {
        const launchDate = launch.createdAt;
        return week.getTime() < launchDate.getTime() && launchDate.getTime() < today;
    })
}

export function filterByDay(launches) {
    const today = new Date();
    const next = new Date();
    today.setUTCHours(0, 0, 0, 0);
    next.setUTCHours(24, 0, 0, 0);
    return launches.filter((launch) => {
        const launchDate = launch.createdAt;
        return today.getTime() < launchDate.getTime() && launchDate.getTime() < next;
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
        const launchDate = launch.createdAt;
        return month.getTime() < launchDate.getTime() && launchDate.getTime() < today;
    })
}