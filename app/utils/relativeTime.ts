import type { ArrayItem } from '~/types/util';

export function toRelativeTime(date: Date, formatter: Intl.RelativeTimeFormat) {
    const DIVISIONS: Readonly<Array<{ amount: number; name: Intl.RelativeTimeFormatUnit }>> = [
        { amount: 60, name: 'seconds' },
        { amount: 60, name: 'minutes' },
        { amount: 24, name: 'hours' },
        { amount: 7, name: 'days' },
        { amount: 4.34524, name: 'weeks' },
        { amount: 12, name: 'months' },
        { amount: Number.POSITIVE_INFINITY, name: 'years' },
    ];

    let duration = (date.getTime() - Date.now()) / 1000;

    for (let i = 0; i < DIVISIONS.length; i++) {
        const division = DIVISIONS[i] as ArrayItem<typeof DIVISIONS>;

        if (Math.abs(duration) < division.amount) {
            return formatter.format(Math.round(duration), division.name);
        }
        duration /= division.amount;
    }
}
