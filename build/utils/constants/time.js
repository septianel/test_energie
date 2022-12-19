"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sixty = 60;
const twentyfour = 24;
const seven = 7;
const second = 1000;
const minute = second * sixty;
const hour = minute * sixty;
const day = hour * twentyfour;
const week = day * seven;
exports.default = {
    second(n = 1) {
        return second * n;
    },
    minute(n = 1) {
        return minute * n;
    },
    hour(n = 1) {
        return hour * n;
    },
    day(n = 1) {
        return day * n;
    },
    week(n = 1) {
        return week * 1;
    },
};
