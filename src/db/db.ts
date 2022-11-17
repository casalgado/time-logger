import entries from "./journal.json";
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
                console.log(data)
                resolve(data);
            }
        })

    });
};






export const categories = {
    trabajo: ['el diario', 'trabajo', 'vueltas casa', 'panaderia', 'tutoria'],
    entretenimiento: ['into the breach', 'league', 'netflix', 'youtube', 'reddit', 'podcast', 'computador'],
    transporte: ['moto', 'carro'],
    casa: ['casa', 'almuerzo', 'baño', 'telefono'],
    vueltas: ['mall plaza', 'notaria'],
    dormir: ['dormir', 'snooze'],
    salud: ['yoga', 'terapia', 'peluqueria'],
    misc: ['misc'],
    salir: ['comer', 'la cueva'],
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


function formatData(entries: any): any {
    // add validation to check that datetimes in entries are in ascending order
    let clean_entries: {}[] = []
    let start = DateTime.fromFormat(`${entries[0].date} ${entries[0].time}`, 'dd/MM/yy H:mm')
    for (let i = 0; i < entries.length - 1; i++) {
        let next_start = DateTime.fromFormat(`${entries[i + 1].date} ${entries[i + 1].time}`, 'dd/MM/yy H:mm')
        let duration = next_start.diff(start, 'minutes')
        start = next_start


        let silvi = entries[i].silvi == "si"
        let awareness = entries[i].awareness == "" ? null : entries[i].awareness
        let headache = entries[i].headache == "" ? null : entries[i].headache


        clean_entries.push({
            day: start.toFormat('dd/MM/yy'),
            start: start,
            duration: duration.toObject().minutes,
            description: entries[i].description,
            category: categorize(entries[i].description.trim()),
            silvi: silvi,
            awareness: awareness,
            headache: headache,
            comment: entries[i].comment
        })


    }
    return clean_entries
}

function categoryTotalsByDay(clean_entries: { day: string, category: string, duration: number }[]) {
    let category_keys = Object.keys(categories)
    let categoryTotalsByDay: any = {}
    for (let i = 0; i < clean_entries.length; i++) {
        const entry = clean_entries[i];

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

export const all_entries = formatData(entries)

export const totalsByDay = categoryTotalsByDay(all_entries)

export const asyncTotals = parseData().then(res => (categoryTotalsByDay(formatData(res))))

parseData().then(res => console.log(categoryTotalsByDay(formatData(res))))