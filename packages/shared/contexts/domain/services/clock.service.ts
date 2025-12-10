export class Clock {
    public static now(): number {
        const now = new Date().toLocaleString("en-US", { timeZone: "Europe/Madrid" });
        return new Date(now).getTime();
    }

    public static currentYear(): number {
        const now = new Date().toLocaleString("en-US", { timeZone: "Europe/Madrid" });
        return new Date(now).getFullYear();
    }

    public static oneYearFromNow(): number {
        const now = new Date();
        const madridTimezone = { timeZone: "Europe/Madrid" };
        const currentDateTimeMadrid = now.toLocaleString("en-US", madridTimezone);
        const nextYear = new Date(currentDateTimeMadrid);
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        return new Date(nextYear).getTime();
    }

    public static xMonthsFromNow(x: number): number {
        console.debug("Months: ", x);
        const now = new Date();
        const madridTimezone = { timeZone: "Europe/Madrid" };
        const currentDateTimeMadrid = now.toLocaleString("en-US", madridTimezone);
        const futureDate = new Date(currentDateTimeMadrid);

        futureDate.setMonth(futureDate.getMonth() + x);
        console.debug("Future date: ", futureDate);
        return futureDate.getTime();
    }

    public static xHoursFromNow(x: number): number {
        console.debug("Hours: ", x);
        const now = new Date();
        const madridTimezone = { timeZone: "Europe/Madrid" };
        const currentDateTimeMadrid = now.toLocaleString("en-US", madridTimezone);
        const futureDate = new Date(currentDateTimeMadrid);

        futureDate.setHours(futureDate.getHours() + x);
        console.debug("Future date: ", futureDate);
        return futureDate.getTime();
    }

    public static xMinutesFromNow(x: number): number {
        console.debug("Minutes: ", x);
        const now = new Date();
        const madridTimezone = { timeZone: "Europe/Madrid" };
        const currentDateTimeMadrid = now.toLocaleString("en-US", madridTimezone);
        const futureDate = new Date(currentDateTimeMadrid);

        futureDate.setMinutes(futureDate.getMinutes() + x);
        console.debug("Future date: ", futureDate);
        return futureDate.getTime();
    }

    public static getTime(value: string): number {
        return new Date(value).getTime();
    }

    public static getDateTime(value: number): string {
        if (value == null) return null;

        const tzoffset = new Date().getTimezoneOffset() * 60000;
        return new Date(value - tzoffset).toISOString().slice(0, -5).replace("T", " ");
    }
}
