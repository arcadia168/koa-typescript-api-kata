"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sqlite3 = require("sqlite3");
var moment = require("moment");
var sampleData = require('../sampleData.json');
var SQLite = sqlite3.verbose();
// Private utility functions go here...
function daysBetween(from, to) {
    var toDate = new Date(to);
    var fromDate = new Date(from);
    var msBetween = (toDate - fromDate) / 1000 / 60 / 60 / 24;
    return Math.floor(msBetween);
}
function isEndOfMonth(mmt) {
    // startOf allows to ignore the time component
    // we call moment(mmt) because startOf and endOf mutate the momentj object.
    return moment
        .utc(mmt)
        .startOf('day')
        .isSame(moment
        .utc(mmt)
        .endOf('month')
        .startOf('day'));
}
exports.connection = new SQLite.Database(':memory:');
/**
 * Imports the data from the sampleData.json file into a `meter_reads` table.
 * The table contains three columns - cumulative, reading_date and unit.
 *
 * An example query to get all meter reads,
 *   connection.all('SELECT * FROM meter_reads', (error, data) => console.log(data));
 *
 * Note, it is an in-memory database, so the data will be reset when the
 * server restarts.
 */
function initialize() {
    exports.connection.serialize(function () {
        exports.connection.run('CREATE TABLE meter_reads (cumulative INTEGER, reading_date TEXT, unit TEXT)');
        var electricity = sampleData.electricity;
        electricity.forEach(function (data) {
            exports.connection.run('INSERT INTO meter_reads (cumulative, reading_date, unit) VALUES (?, ?, ?)', [data.cumulative, data.readingDate, data.unit]);
        });
    });
}
exports.initialize = initialize;
function destroy() {
    exports.connection.serialize(function () {
        exports.connection.run('DROP TABLE meter_reads');
    });
}
exports.destroy = destroy;
function getAllMeterReadings() {
    return new Promise(function (resolve, reject) {
        exports.connection.serialize(function () {
            exports.connection.all('SELECT * FROM meter_reads ORDER BY cumulative', function (error, readResults) {
                if (error) {
                    var readError = new Error("An error occurred when attempting to read from the database: " + error.message);
                    reject(readError);
                }
                resolve(readResults);
            });
        });
    });
}
exports.getAllMeterReadings = getAllMeterReadings;
function writeMeterReading(meterReading) {
    return new Promise(function (resolve, reject) {
        try {
            exports.connection.serialize(function () {
                exports.connection.run("INSERT INTO meter_reads (cumulative, reading_date, unit) VALUES (?, ?, ?)", [meterReading.cumulative, meterReading.readingDate, meterReading.unit]);
                resolve();
            });
        }
        catch (writeError) {
            var dataWriteError = new Error("Error at data.writeMeterReading: " + writeError.message);
            reject(dataWriteError);
        }
    });
}
exports.writeMeterReading = writeMeterReading;
function calculateMonthlyAverageUsage() {
    // Retrieve all of the data from the table first, ordered by date
    return new Promise(function (resolve, reject) {
        var endOfMonthReadingEstimates = [];
        var monthlyReadingEstimates = [];
        exports.connection.serialize(function () {
            exports.connection.all('SELECT * FROM meter_reads ORDER BY reading_date ASC', function (error, selectResults) {
                if (error) {
                    var readError = new Error("An error occurred attempting to read records in data order: " + error.message);
                    reject(readError);
                }
                // Iterate the data from the table.
                selectResults.forEach(function (currentActualReading, index) {
                    var currentReadingDateMoment = moment(currentActualReading.reading_date);
                    // Find the last day of the current record's month
                    var endOfCurrentReadingsMonthDate = currentReadingDateMoment.endOf('month');
                    var nextIndex = index + 1;
                    // Don't check next reading if this is the last reading.
                    if (nextIndex < selectResults.length) {
                        // From 1st to penultimate reading...
                        var nextActualReading = selectResults[nextIndex];
                        // Find the number of days between the 2 readings
                        var noOfDaysBetweenReadings = daysBetween(currentActualReading.reading_date, nextActualReading.reading_date);
                        // Find the difference in meter readings between the previous and next reading.
                        var energyUsedBetweenReadings = nextActualReading.cumulative - currentActualReading.cumulative;
                        // Find the average daily usage
                        var averageDailyEnergyUsage = energyUsedBetweenReadings / noOfDaysBetweenReadings;
                        // TODO: If reading_date is EOM, then the reading is the estimate!!!!
                        var endOfMonthReadingEstimate = void 0;
                        if (isEndOfMonth(moment(currentActualReading.reading_date))) {
                            endOfMonthReadingEstimate = currentActualReading.cumulative;
                        }
                        else {
                            // Find the days between the current reading's reading date and end of reading's month
                            var daysToEndOfMonth = daysBetween(currentActualReading.reading_date, endOfCurrentReadingsMonthDate.toISOString());
                            // Find ADDITIONAL the amount of energy usage to add to the current reading, to get end of month usage
                            var estimatedAdditionalUsage = daysToEndOfMonth * averageDailyEnergyUsage;
                            // Now calculate the estimated reading at the end of the month of the current reading.
                            endOfMonthReadingEstimate = Math.round(currentActualReading.cumulative + estimatedAdditionalUsage);
                        }
                        var endOfMonthEstimate = {
                            month: currentReadingDateMoment.format('MMMM'),
                            year: currentReadingDateMoment.format('YYYY'),
                            estimateInKwh: Math.round(endOfMonthReadingEstimate),
                        };
                        endOfMonthReadingEstimates.push(endOfMonthEstimate);
                    }
                });
                // Now calculate the monthly use, using the end of month reading estimates.
                endOfMonthReadingEstimates.forEach(function (endOfMonthReading, index) {
                    if (index > 0) {
                        var estimateEnergyUsageInKwh = void 0;
                        var currentMonthEstimate = endOfMonthReading.estimateInKwh;
                        var previousMonthEstimate = endOfMonthReadingEstimates[index - 1].estimateInKwh;
                        estimateEnergyUsageInKwh = Math.round(currentMonthEstimate - previousMonthEstimate);
                        var monthlyReadingEstimate = {
                            month: endOfMonthReading.month,
                            year: endOfMonthReading.year,
                            estimateEnergyUsageInKwh: estimateEnergyUsageInKwh
                        };
                        monthlyReadingEstimates.push(monthlyReadingEstimate);
                    }
                });
                resolve(monthlyReadingEstimates);
            });
        });
    });
}
exports.calculateMonthlyAverageUsage = calculateMonthlyAverageUsage;
//# sourceMappingURL=data.js.map