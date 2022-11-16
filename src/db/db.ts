import entries from "./journal.json";
import { DateTime } from "luxon";
console.log(entries)

export const categories = {
    trabajo: ['el diario', 'trabajo', 'vueltas casa', 'panaderia', 'tutoria'],
    entretenimiento: ['into the breach', 'league', 'netflix', 'youtube', 'reddit', 'podcast', 'computador'],
    transporte: ['moto'],
    casa: ['casa', 'almuerzo', 'baño'],
    dormir: ['dormir'],
    salud: ['yoga', 'terapia'],
    misc: ['misc'],
    salir: ['comer', 'telefono'],
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


function formatData(entries: { date: string, time: string, description: string, silvi: string, headache: string | number, awareness: string | number, comment: string }[]): any {
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
            category: categorize(entries[i].description),
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
        console.log(entry)
        if (categoryTotalsByDay[entry.day] == undefined) {
            console.log('******')
            categoryTotalsByDay[entry.day] = {}
            for (let j = 0; j < category_keys.length; j++) {

                const category = category_keys[j]
                console.log(category)
                categoryTotalsByDay[entry.day][category] = 0
            }
        }
        console.log(categoryTotalsByDay[entry.day])
        categoryTotalsByDay[entry.day][entry.category] += entry.duration

    }

    return categoryTotalsByDay
}

export const all_entries = formatData(entries)

export const totalsByDay = categoryTotalsByDay(all_entries)