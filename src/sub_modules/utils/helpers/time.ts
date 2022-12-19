import moments from 'moment-timezone'
import _moment from 'moment'

export type Moment = moment.Moment

const STYLING_DAYS = 7

//
// ─── THIS IS THE PLACE TO ADD HOLIDAY ───────────────────────────────────────────
//

const HOLIDAYS = {
    // 2021
    0: [1, 2, 3, 9, 10, 16, 17, 23, 24, 30, 31],					// JANUARY
    1: [6, 7, 12, 13, 14, 20, 21, 27, 28],							// FEBRUARY
    2: [6, 7, 11, 13, 14, 20, 21, 27, 28], 							// MARCH
    3: [2, 3, 4, 10, 11, 17, 18, 24, 25, 29, 30],					// APRIL
    4: [1, 2, 3, 4, 5, 6, 7, 8, 14, 15, 16, 21, 22, 26, 28, 29],		// MAY
    5: [1, 4, 5, 11, 12, 18, 19, 25, 26],							// JUNE
    6: [2, 3, 9, 10, 16, 17, 23, 24, 30, 31],						// JULY
    7: [6, 7, 13, 14, 17, 20, 21, 27, 28],							// AUGUST
    8: [3, 4, 10, 11, 17, 18, 24, 25],								// SEPTEMBER
    9: [1, 2, 8, 9, 15, 16, 22, 23, 29, 30],						// OCTOBER
    10: [5, 6, 12, 13, 19, 20, 26, 27],								// NOVEMBER
    11: [3, 4, 10, 11, 17, 24, 25, 31], 							// DECEMBER
}

const momentz = (time?: any) => {
    moments.tz.setDefault('Asia/Jakarta')
    return moments(time)
}

export default {
    _moment,
    momentz(time?: any) {
        return momentz(time)
    },
    toString(time?: any) {
        return momentz(time).format('YYYY-MM-DD HH:mm:ss Z')
    },
    yunAgo(timestamp: number) {
        const diff = momentz().endOf('day').diff(timestamp, 'days')

        switch (diff) {
            case 0:
                return 'Today'
            case 1:
                return 'Yesterday'
            case 2:
            case 3:
            case 4:
            case 5:
                return momentz(timestamp).format('dddd')
            default:
                return momentz(timestamp).format('DD MMM')
            // return momentz(date).format('MMM Do YYYY')
        }
    },
    ago(timestamp: number) {
        return momentz(timestamp).fromNow()
    },
    calculateShipmentDate(remaining = STYLING_DAYS, NOW: Moment | Date = momentz()): moment.Moment {
        const _today = momentz(NOW)
        const _date = _today.date()
        const _month = _today.month()

        if (HOLIDAYS[_month].indexOf(_date) === -1) {
            // tomorrow is business day
            if (remaining - 1 <= 0) {
                return _today
            }

            return this.calculateShipmentDate(remaining - 1, _today.add(1, 'd').endOf('day'))
        } else {
            // tomorrow is not business day
            return this.calculateShipmentDate(remaining, _today.add(1, 'd').endOf('day'))
        }
    },
    convertStringToDate(date: string, format = 'YYYY-MM-DD HH:mm') {
        return momentz(date).toDate()
    },
    dateStamp(timestamp: number) {
        return Math.ceil(+momentz(timestamp).startOf('day') / 1000 / 60 / 60 / 24)
    },
    format(date: Date, format = 'DD MMM YYYY') {
        return momentz(date).format(format)
    },
    getGreetingTime(date = Date.now()) {
        const momentdate = momentz(date)
        const currentHour = parseFloat(momentdate.format('HH')) + (parseFloat(momentdate.format('mm')) / 60)

        if (currentHour > 17) {
            return 'Evening'
        } else if (currentHour > 12.5) {
            return 'Afternoon'
        } else if (currentHour > 5) {
            return 'Morning'
        } else {
            return 'Evening'
        }
    },
    getFirstDayInNextMonth(date = new Date()) {
        return momentz(new Date(date.getFullYear(), date.getMonth() + 1, 1))
    },
    getLastDayInCurrentMonth(date = new Date()) {
        return momentz(new Date(date.getFullYear(), date.getMonth() + 1, 0))
    },
    getCurrentMonth(date = Date.now()) {
        return momentz(date).format('MMMM')
    },
    // getLastSecondInCurrentMonth(date = new Date()) {
    // 	return momentz(new Date(date.getFullYear(), date.getMonth() + 1, 1) - 1)
    // },
    // getLastSecondInMiddleNextMonth(date = new Date()) {
    // 	return momentz(new Date(date.getFullYear(), date.getMonth() + 1, 16) - 1)
    // },
    getCurrentDate(date = new Date()) {
        return momentz(date).format('DD')
    },
    getCurrentYMD(date = new Date()) {
        return momentz(date).format('YYYY-MM-DD')
    },
    getRange(dates: Date[] = [], as_string: boolean = true, date_format = 'DD', month_format = 'MMM', year_format = 'YYYY') {
        if (!dates.length) {
            return as_string ? momentz().format('DD MM YYYY') : Array(2).fill(momentz().toDate())
        }

        const earliest = momentz(dates.reduce((date, curr) => {
            return !date ? curr : +date < +curr ? date : curr
        }))
        const latest = momentz(dates.reduce((date, curr) => {
            return !date ? curr : +date < +curr ? curr : date
        }))

        if (as_string) {
            if (earliest.year() === latest.year()) {
                if (earliest.month() === latest.month()) {
                    if (earliest.date() === latest.date()) {
                        // year and month and date is the same
                        return `${latest.format(`${date_format} ${month_format} ${year_format}`)}`
                    } else {
                        // year and month is the same
                        return `${earliest.format(`${date_format}`)} - ${latest.format(`${date_format} ${month_format} ${year_format}`)}`
                    }
                } else {
                    // only year is the same
                    return `${earliest.format(`${date_format} ${month_format}`)} - ${latest.format(`${date_format} ${month_format} ${year_format}`)}`
                }
            } else {
                // not same at all
                return `${earliest.format(`${date_format} ${month_format} ${year_format}`)} - ${latest.format(`${date_format} ${month_format} ${year_format}`)}`
            }
        } else {
            return [earliest, latest]
        }
    },
    isOpen(openingHour: Date, closingHour: Date) {
        return _moment(openingHour, 'h:mm:ss').unix() <= momentz().unix() && _moment(closingHour, 'h:mm:ss').unix() >= momentz().unix()
    },
    isOlderThan(timestamp: Date, n: number, unit: moment.unitOfTime.DurationConstructor = 'days') {
        return +momentz(timestamp) <= +momentz().subtract(n, unit)
    },
    isLessThan(timestamp: Date, n: number, unit: moment.unitOfTime.DurationConstructor = 'days') {
        return +momentz(timestamp) >= +momentz().subtract(n, unit)
    },
    // toQueryTime(date: Date | undefined | null) {
    // 	if(date) {
    // 		return momentz(date).format('')
    // 	}

    // 	return date
    // },
    queryLessThanEqual(date: Date | null | undefined | false) {
        if (date && momentz(date).isValid()) {
            return momentz(date).add(1, 'ms').toDate()
        }

        return date
    },
    validateShipmentDate(date: string) {
        const _shipmentdate = this.calculateShipmentDate(7, momentz(date))
        const _now = momentz()
        if (_now.isSameOrBefore(_shipmentdate)) {
            return true
        } else {
            return false
        }
    },
    timeLeft(date: Date, from: Date = new Date()) {
        const duration = _moment.duration(momentz(date).diff(from))

        if (Math.max(0, duration.days())) {
            return `${Math.max(0, duration.days())}d ${Math.max(0, duration.hours())}h ${Math.max(0, duration.minutes())}m`
        } else {
            return `${Math.max(0, duration.hours())}h ${Math.max(0, duration.minutes())}m`
        }
    },
}
