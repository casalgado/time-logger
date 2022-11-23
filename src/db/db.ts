import { DateTime } from "luxon";
import * as Papa from "papaparse"


type RawEntry = {
    fecha: string,
    carta: string,
    direccion: string,
}

type CleanEntry = {
    date: string,
    name: string,
    number: number,
    image: string,
    rotate: boolean,
}


const cards = [
    {
        "number": 0,
        "name": "El Loco"
    },
    {
        "number": 1,
        "name": "El Mago"
    },
    {
        "number": 2,
        "name": "La Papisa"
    },
    {
        "number": 3,
        "name": "La Emperatriz"
    },
    {
        "number": 4,
        "name": "El Emperador"
    },
    {
        "number": 5,
        "name": "El Papa"
    },
    {
        "number": 6,
        "name": "Los Enamorados"
    },
    {
        "number": 7,
        "name": "El Carro"
    },
    {
        "number": 8,
        "name": "La Justicia"
    },
    {
        "number": 9,
        "name": "El Ermitaño"
    },
    {
        "number": 10,
        "name": "La Rueda"
    },
    {
        "number": 11,
        "name": "La Fuerza"
    },
    {
        "number": 12,
        "name": "El Colgado"
    },
    {
        "number": 13,
        "name": "Arcano Sin Nombre"
    },
    {
        "number": 14,
        "name": "La Templanza"
    },
    {
        "number": 15,
        "name": "El Diablo"
    },
    {
        "number": 16,
        "name": "La Torre"
    },
    {
        "number": 17,
        "name": "La Estrella"
    },
    {
        "number": 18,
        "name": "La Luna"
    },
    {
        "number": 19,
        "name": "El Sol"
    },
    {
        "number": 20,
        "name": "El Juicio"
    },
    {
        "number": 21,
        "name": "El Mundo"
    }
]




const parseData = () => {
    let data: RawEntry[];
    return new Promise((resolve) => {
        Papa.parse("https://docs.google.com/spreadsheets/d/e/2PACX-1vSClKDx1SO2ec7ISZh7_RUDChfSsgMExXlGatRVnIpWlLR_hGdCnr5ryLn0WDJoWSUC_p14Q7IZZDGS/pub?output=csv", {
            download: true,
            header: true,
            complete: (results: any) => {
                data = results.data.filter((e: RawEntry) => e.carta != '')
                console.log(data)
                resolve(data);
            }
        })

    });
};

function getCardName(cardNumber: number): string {
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].number == cardNumber) {
            return cards[i].name
        }
    }
    return ''

}

function cleanEntries(entries: RawEntry[]): CleanEntry[] {
    let entriesArray: CleanEntry[] = []
    for (let i = 0; i < entries.length; i++) {
        let e = entries[i]
        entriesArray.push({
            date: e.fecha,
            name: getCardName(parseInt(e.carta)),
            number: parseInt(e.carta),
            image: `${e.carta}.jpeg`,
            rotate: e.direccion == "Volteado",
        })

    }


    return entriesArray
}


export const allEntries = parseData().then(res => (cleanEntries(res as RawEntry[])))

export const totalsByDay = parseData().then(res => (cleanEntries(res as RawEntry[])))

