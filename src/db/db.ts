import { DateTime } from "luxon";
import * as Papa from "papaparse"


type RawEntry = {
    date: string,
    time: string,
    description: string,
    silvi: string,
    reddit: string,
    spent: string,
    awareness: string,
    headache: string,
    comment: string,
}

type CleanEntry = {
    day: string,
    absoluteStart: number,
    start: DateTime,
    duration: number | undefined,
    description: string,
    category: string,
    silvi: boolean,
    reddit: number,
    spent: number,
    awareness: number,
    headache: number,
    comment: string,
}

type Category = {
    name: string,
    color: string,
    descriptions: string[]
}

const parseData = () => {
    let data: RawEntry[];
    return new Promise((resolve) => {
        Papa.parse("https://docs.google.com/spreadsheets/d/e/2PACX-1vSF23PU8rzXWTFHD5bKeg4jakcumzxNwAFxqGhuRVmzkfmVn_qgrUT4PZDkHo5cj3QRzKAr6HyRB4vx/pub?output=csv", {
            download: true,
            header: true,
            complete: (results: any) => {
                data = results.data.filter((e: RawEntry) => e.description != '')
                //console.log(data)
                resolve(data);
            }
        })

    });
};

export const categories: Category[] = [
    {
        name: 'trabajo',
        color: 'bg-amber-500',
        descriptions: ['el diario', 'trabajo', 'panaderia', 'tutoria', 'w3album', 'time-logger'],
    },
    {
        name: 'entretenimiento',
        color: 'bg-blue-700',
        descriptions: ['into the breach', 'league', 'netflix', 'youtube', 'reddit', 'podcast', 'computador'],
    },
    {
        name: 'transporte',
        color: 'bg-stone-500',
        descriptions: ['moto', 'carro'],
    },
    {
        name: 'casa',
        color: 'bg-fuchsia-700',
        descriptions: ['casa', 'almuerzo', 'baño', 'telefono'],
    },
    {
        name: 'vueltas',
        color: 'bg-yellow-900',
        descriptions: ['mall plaza', 'notaria', 'vueltas beto', 'vueltas casa'],
    },
    {
        name: 'dormir',
        color: 'bg-zinc-800',
        descriptions: ['dormir', 'snooze', 'siesta'],
    },
    {
        name: 'salud',
        color: 'bg-green-600',
        descriptions: ['yoga', 'terapia', 'peluqueria'],
    },
    {
        name: 'misc',
        color: 'bg-slate-500',
        descriptions: ['misc'],
    },
    {
        name: 'planes',
        color: 'bg-red-500',
        descriptions: ['comer', 'la cueva', 'juegos', 'padre'],
    },]

function categorize(description: string): string {
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].descriptions.includes(description)) {
            return categories[i].name
        }
    }
    throw new Error(`description not categorized: ${description}`);
}

function toMinuteOfTheDay(datetime: DateTime): number {
    let hour = parseInt(datetime.toFormat("H"));
    let minutes = parseInt(datetime.toFormat("m"));
    return hour * 60 + minutes;
}

function cleanEntries(entries: RawEntry[]): CleanEntry[] {
    let entriesArray: CleanEntry[] = []

    let start = DateTime.fromFormat(`${entries[0].date} ${entries[0].time}`, 'dd/MM/yy H:mm')
    // extraDuration is needed for entries that pass from one day to another
    let extraDuration = 0

    for (let i = 0; i < entries.length - 1; i++) {
        let nextStart = DateTime.fromFormat(`${entries[i + 1].date} ${entries[i + 1].time}`, 'dd/MM/yy H:mm')
        let duration = nextStart.diff(start, 'minutes').toObject().minutes

        //  validation to check that  entries are in ascending order
        if (duration && duration < 0) {
            throw new Error(`time is before previous start at entry: ${i + 3}`);
        }

        // absoluteStart refers to the start time in minute of the day
        let absoluteStart = toMinuteOfTheDay(start)

        // if absolute start + duration exceeds 1440 (total minutes of day), entry has to be split in two.
        if (duration && absoluteStart + duration > 1440) {
            // here extraDuration is given the value of the duration that slips to next day
            extraDuration = duration - (1440 - absoluteStart)
            duration = (1440 - absoluteStart)
        }



        let silvi = entries[i].silvi == "si"
        let headache = entries[i].headache == "" ? 0 : parseInt(entries[i].headache)
        let awareness = entries[i].awareness == "" ? 0 : parseInt(entries[i].awareness)
        let reddit = entries[i].reddit == "" ? 0 : parseInt(entries[i].reddit)
        let spent = entries[i].spent == "" ? 0 : parseInt(entries[i].spent)


        // to set category
        let category = categorize(entries[i].description.trim())

        entriesArray.push({
            day: start.toFormat('dd/MM/yy'),
            absoluteStart: absoluteStart,
            start: start,
            duration: duration,
            description: entries[i].description,
            category: category,
            silvi: silvi,
            reddit: reddit,
            spent: spent,
            awareness: awareness,
            headache: headache,

            comment: entries[i].comment,
        })

        if (extraDuration > 0) {
            entriesArray.push({
                day: start.plus({ days: 1 }).toFormat('dd/MM/yy'),
                absoluteStart: 0,
                start: start.plus({ days: 1 }).startOf('day'),
                duration: extraDuration,
                description: entries[i].description,
                category: category,
                silvi: silvi,
                reddit: 0,
                spent: 0,
                awareness: 0,
                headache: 0,
                comment: ''
            })
        }
        start = nextStart
        extraDuration = 0
    }
    console.log(entriesArray)
    return entriesArray
}

function categoryTotalsByDay(entriesArray: CleanEntry[]) {
    let category_keys = categories.map(e => e.name)
    let categoryTotalsByDay: any = {}
    for (let i = 0; i < entriesArray.length; i++) {
        const entry = entriesArray[i];

        if (categoryTotalsByDay[entry.day] == undefined) {

            categoryTotalsByDay[entry.day] = {}
            for (let j = 0; j < category_keys.length; j++) {

                const category = category_keys[j]

                categoryTotalsByDay[entry.day][category] = 0
            }
        }

        categoryTotalsByDay[entry.day][entry.category] += entry.duration

    }

    return categoryTotalsByDay
}


export const allEntries = parseData().then(res => (cleanEntries(res as RawEntry[])))

export const totalsByDay = parseData().then(res => (categoryTotalsByDay(cleanEntries(res as RawEntry[]))))

