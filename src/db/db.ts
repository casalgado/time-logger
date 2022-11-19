import { DateTime } from "luxon";
import * as Papa from "papaparse"



const parseData = () => {
    let data;
    return new Promise((resolve) => {
        Papa.parse("https://docs.google.com/spreadsheets/d/e/2PACX-1vSF23PU8rzXWTFHD5bKeg4jakcumzxNwAFxqGhuRVmzkfmVn_qgrUT4PZDkHo5cj3QRzKAr6HyRB4vx/pub?output=csv", {
            download: true,
            header: true,
            complete: (results: any) => {
                data = results.data.filter((e: any) => e.description != '')
                //console.log(data)
                resolve(data);
            }
        })

    });
};






export const categories = {
    trabajo: ['el diario', 'trabajo', 'panaderia', 'tutoria', 'w3album', 'time-logger'],
    entretenimiento: ['into the breach', 'league', 'netflix', 'youtube', 'reddit', 'podcast', 'computador'],
    transporte: ['moto', 'carro'],
    casa: ['casa', 'almuerzo', 'baño', 'telefono'],
    vueltas: ['mall plaza', 'notaria', 'vueltas beto', 'vueltas casa'],
    dormir: ['dormir', 'snooze', 'siesta'],
    salud: ['yoga', 'terapia', 'peluqueria'],
    misc: ['misc'],
    planes: ['comer', 'la cueva', 'juegos', 'padre'],
}

function categorize(description: string): string {
    let pairs = (<any>Object).entries(categories)
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        if (pair[1].includes(description)) {
            return pair[0]
        }

    }
    throw new Error(`description not categorized: ${description}`);
}

function toMinuteOfTheDay(datetime: DateTime): number {
    let hour = parseInt(datetime.toFormat("H"));
    let minutes = parseInt(datetime.toFormat("m"));
    return hour * 60 + minutes;
}

function cleanEntries(entries: any): any {

    let entriesArray: {}[] = []
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
            extraDuration = duration - (1440 - absoluteStart)
            duration = (1440 - absoluteStart)
        }



        let silvi = entries[i].silvi == "si"
        let awareness = entries[i].awareness == "" ? null : entries[i].awareness
        let headache = entries[i].headache == "" ? null : entries[i].headache



        entriesArray.push({
            day: start.toFormat('dd/MM/yy'),
            absoluteStart: absoluteStart,
            start: start,
            duration: duration,
            description: entries[i].description,
            category: categorize(entries[i].description.trim()),
            silvi: silvi,
            awareness: awareness,
            headache: headache,
            comment: entries[i].comment
        })

        if (extraDuration > 0) {
            entriesArray.push({
                day: start.plus({ days: 1 }).toFormat('dd/MM/yy'),
                absoluteStart: 0,
                start: start.plus({ days: 1 }).startOf('day'),
                duration: extraDuration,
                description: entries[i].description,
                category: categorize(entries[i].description.trim()),
                silvi: silvi,
                awareness: awareness,
                headache: headache,
                comment: entries[i].comment
            })
        }

        start = nextStart
        extraDuration = 0
    }
    console.log(entriesArray)
    return entriesArray
}

function categoryTotalsByDay(entriesArray: { day: string, category: string, duration: number }[]) {
    let category_keys = Object.keys(categories)
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


export const allEntries = parseData().then(res => (cleanEntries(res)))

export const totalsByDay = parseData().then(res => (categoryTotalsByDay(cleanEntries(res))))

