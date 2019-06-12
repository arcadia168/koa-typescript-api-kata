import * as sqlite3 from 'sqlite3';
export declare const connection: sqlite3.Database;
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
export declare function initialize(): void;
export declare function destroy(): void;
export declare function getAllMeterReadings(): Promise<unknown>;
export declare function writeMeterReading(meterReading: any): Promise<unknown>;
export declare function calculateMonthlyAverageUsage(): Promise<unknown>;
