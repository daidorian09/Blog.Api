"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateExpireDate = (date) => {
    date = String(date);
    if (date.length > 100) {
        return;
    }
    const match = /^((?:\d+)?\-?\d?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(date);
    if (!match) {
        return;
    }
    const number = parseFloat(match[1]);
    const type = (match[2] || 'ms').toLowerCase();
    const currentDate = new Date();
    switch (type) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
            currentDate.setFullYear(currentDate.getFullYear() + number);
            return currentDate;
        case 'weeks':
        case 'week':
        case 'w':
            currentDate.setDate(currentDate.getDate() + number);
            return currentDate;
        case 'days':
        case 'day':
        case 'd':
            currentDate.setDate(currentDate.getDate() + number);
            return currentDate;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
            currentDate.setHours(currentDate.getHours() + number);
            return currentDate;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
            currentDate.setMinutes(currentDate.getMinutes() + number);
            return currentDate;
        default:
            return undefined;
    }
};
