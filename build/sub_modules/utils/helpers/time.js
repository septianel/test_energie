"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const moment_1 = __importDefault(require("moment"));
const STYLING_DAYS = 7;
const HOLIDAYS = {
    0: [1, 2, 3, 9, 10, 16, 17, 23, 24, 30, 31],
    1: [6, 7, 12, 13, 14, 20, 21, 27, 28],
    2: [6, 7, 11, 13, 14, 20, 21, 27, 28],
    3: [2, 3, 4, 10, 11, 17, 18, 24, 25, 29, 30],
    4: [1, 2, 3, 4, 5, 6, 7, 8, 14, 15, 16, 21, 22, 26, 28, 29],
    5: [1, 4, 5, 11, 12, 18, 19, 25, 26],
    6: [2, 3, 9, 10, 16, 17, 23, 24, 30, 31],
    7: [6, 7, 13, 14, 17, 20, 21, 27, 28],
    8: [3, 4, 10, 11, 17, 18, 24, 25],
    9: [1, 2, 8, 9, 15, 16, 22, 23, 29, 30],
    10: [5, 6, 12, 13, 19, 20, 26, 27],
    11: [3, 4, 10, 11, 17, 24, 25, 31],
};
const momentz = (time) => {
    moment_timezone_1.default.tz.setDefault('Asia/Jakarta');
    return (0, moment_timezone_1.default)(time);
};
exports.default = {
    _moment: moment_1.default,
    momentz(time) {
        return momentz(time);
    },
    toString(time) {
        return momentz(time).format('YYYY-MM-DD HH:mm:ss Z');
    },
    yunAgo(timestamp) {
        const diff = momentz().endOf('day').diff(timestamp, 'days');
        switch (diff) {
            case 0:
                return 'Today';
            case 1:
                return 'Yesterday';
            case 2:
            case 3:
            case 4:
            case 5:
                return momentz(timestamp).format('dddd');
            default:
                return momentz(timestamp).format('DD MMM');
        }
    },
    ago(timestamp) {
        return momentz(timestamp).fromNow();
    },
    calculateShipmentDate(remaining = STYLING_DAYS, NOW = momentz()) {
        const _today = momentz(NOW);
        const _date = _today.date();
        const _month = _today.month();
        if (HOLIDAYS[_month].indexOf(_date) === -1) {
            if (remaining - 1 <= 0) {
                return _today;
            }
            return this.calculateShipmentDate(remaining - 1, _today.add(1, 'd').endOf('day'));
        }
        else {
            return this.calculateShipmentDate(remaining, _today.add(1, 'd').endOf('day'));
        }
    },
    convertStringToDate(date, format = 'YYYY-MM-DD HH:mm') {
        return momentz(date).toDate();
    },
    dateStamp(timestamp) {
        return Math.ceil(+momentz(timestamp).startOf('day') / 1000 / 60 / 60 / 24);
    },
    format(date, format = 'DD MMM YYYY') {
        return momentz(date).format(format);
    },
    getGreetingTime(date = Date.now()) {
        const momentdate = momentz(date);
        const currentHour = parseFloat(momentdate.format('HH')) + (parseFloat(momentdate.format('mm')) / 60);
        if (currentHour > 17) {
            return 'Evening';
        }
        else if (currentHour > 12.5) {
            return 'Afternoon';
        }
        else if (currentHour > 5) {
            return 'Morning';
        }
        else {
            return 'Evening';
        }
    },
    getFirstDayInNextMonth(date = new Date()) {
        return momentz(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    },
    getLastDayInCurrentMonth(date = new Date()) {
        return momentz(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    },
    getCurrentMonth(date = Date.now()) {
        return momentz(date).format('MMMM');
    },
    getCurrentDate(date = new Date()) {
        return momentz(date).format('DD');
    },
    getCurrentYMD(date = new Date()) {
        return momentz(date).format('YYYY-MM-DD');
    },
    getRange(dates = [], as_string = true, date_format = 'DD', month_format = 'MMM', year_format = 'YYYY') {
        if (!dates.length) {
            return as_string ? momentz().format('DD MM YYYY') : Array(2).fill(momentz().toDate());
        }
        const earliest = momentz(dates.reduce((date, curr) => {
            return !date ? curr : +date < +curr ? date : curr;
        }));
        const latest = momentz(dates.reduce((date, curr) => {
            return !date ? curr : +date < +curr ? curr : date;
        }));
        if (as_string) {
            if (earliest.year() === latest.year()) {
                if (earliest.month() === latest.month()) {
                    if (earliest.date() === latest.date()) {
                        return `${latest.format(`${date_format} ${month_format} ${year_format}`)}`;
                    }
                    else {
                        return `${earliest.format(`${date_format}`)} - ${latest.format(`${date_format} ${month_format} ${year_format}`)}`;
                    }
                }
                else {
                    return `${earliest.format(`${date_format} ${month_format}`)} - ${latest.format(`${date_format} ${month_format} ${year_format}`)}`;
                }
            }
            else {
                return `${earliest.format(`${date_format} ${month_format} ${year_format}`)} - ${latest.format(`${date_format} ${month_format} ${year_format}`)}`;
            }
        }
        else {
            return [earliest, latest];
        }
    },
    isOpen(openingHour, closingHour) {
        return (0, moment_1.default)(openingHour, 'h:mm:ss').unix() <= momentz().unix() && (0, moment_1.default)(closingHour, 'h:mm:ss').unix() >= momentz().unix();
    },
    isOlderThan(timestamp, n, unit = 'days') {
        return +momentz(timestamp) <= +momentz().subtract(n, unit);
    },
    isLessThan(timestamp, n, unit = 'days') {
        return +momentz(timestamp) >= +momentz().subtract(n, unit);
    },
    queryLessThanEqual(date) {
        if (date && momentz(date).isValid()) {
            return momentz(date).add(1, 'ms').toDate();
        }
        return date;
    },
    validateShipmentDate(date) {
        const _shipmentdate = this.calculateShipmentDate(7, momentz(date));
        const _now = momentz();
        if (_now.isSameOrBefore(_shipmentdate)) {
            return true;
        }
        else {
            return false;
        }
    },
    timeLeft(date, from = new Date()) {
        const duration = moment_1.default.duration(momentz(date).diff(from));
        if (Math.max(0, duration.days())) {
            return `${Math.max(0, duration.days())}d ${Math.max(0, duration.hours())}h ${Math.max(0, duration.minutes())}m`;
        }
        else {
            return `${Math.max(0, duration.hours())}h ${Math.max(0, duration.minutes())}m`;
        }
    },
};
