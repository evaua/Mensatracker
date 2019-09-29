/* eslint-env browser */

import DBConfig from "../db/DBConfig.js";

var db, year, sortDateDesc = true, sortPriceDesc = true;
//Dexie.delete(DBConfig.DB_NAME);

function createDB() {
    if (db === undefined) {
        db = new Dexie(DBConfig.DB_NAME);
        db.version(1).stores({
            entries: "id, meal, price, rating, mood, *ingredients, month, date, labels",
        });
    }
}

function storeEntry(entry) {
   return db.entries.add(entry);
}

function deleteEntry(id) {
    return db.entries.where("id").equals(id).delete();
}

function countEntries() {
    var numOfEntries = db.entries.count();
    return numOfEntries;
}

function getAllEntriesInDB() {
    var allEntries = db.entries.orderBy("date").toArray();
    return allEntries;
}

function getRatingsInDB() {
    var newRatings = new Array();
    getAllEntriesInDB().then(function(result) {
        for (let i = 0; i < result.length; i++) {
                newRatings[i] = result[i].rating;
        }
    });
    return newRatings;
}

function getMealsInDB() {
    var newMeals = DBConfig.MEALMONTHS,
        mealNumber = 0;
    getAllEntriesInDB().then(function(result) {
        for (let i = 0; i < newMeals.length; i++) {
            for (let j = 0; j < result.length; j++) {
                let newYear = parseInt(result[j].date.substring(6, 10));
                if (year === newYear) {
                    if (result[j].month === i) {
                        mealNumber++;
                    }
                }
            }
            newMeals[i] = mealNumber;
            mealNumber = 0;
        }
    });
    return newMeals;
}

async function getMoneyInDB() {
    var newMoney = DBConfig.MONEYMONTHS,
        monthlyMoney = 0.0;
    var entries = await getAllEntriesInDB();
    for (let i = 0; i < newMoney.length; i++) {
        for (let j = 0; j < entries.length; j++) {
            if (entries[j].month === i) {
                let newYear = parseInt(entries[j].date.substring(6, 10));
                if (year === newYear) {
                    let price = entries[j].price;
                    let number = price.replace(",", ".");
                    let floatNumber = parseFloat(number);
                    monthlyMoney += floatNumber;
                }
            }
        }
        newMoney[i] = monthlyMoney.toFixed(DBConfig.DECIMALS);
        monthlyMoney = 0.0;
    }
    return newMoney;
}

function clearDB() {
    db.entries.clear();
}

 function getEntriesWithMeatInDB(){
    var allMeatEntries = new Array();
    allMeatEntries = db.entries.where("labels").noneOf(["V", "VG"]).toArray();
    return allMeatEntries;
}

function getEntriesWithGlutenInDB(){
    var allGlutenEntries = new Array();
    allGlutenEntries = db.entries.where("ingredients").anyOf(["Weizengluten", "Roggengluten", "Gerstengluten", "Hafergluten", "Dinkelgluten", "Kamutgluten"]).distinct().toArray();
    return allGlutenEntries;
}

function getEntriesWithLactoseInDB(){
    var allLactoseEntries = new Array();
    allLactoseEntries = db.entries.where("ingredients").equals("Milch und Milchprodukte").toArray();
    return allLactoseEntries;
}

function getDateSortDescInDB() {
    let entriesSortedDate = db.entries.orderBy("date").toArray();
    return entriesSortedDate;
}

function getDateSortAscInDB() {
    let entriesSortedDate = db.entries.orderBy("date").reverse().toArray();
    return entriesSortedDate;
}

function getPriceSortDescInDB() {
    let entriesSortedPrice = db.entries.orderBy("price").toArray();
    return entriesSortedPrice;
}

function getPriceSortAscInDB() {
    let entriesSortedPrice = db.entries.orderBy("price").reverse().toArray();
    return entriesSortedPrice;
}

function freeTextSearchInDB(input) {
    let regexp = new RegExp(input, 'i');
    return db.entries.filter(function (entrie) { return regexp.test(entrie.meal) || regexp.test(entrie.ingredients); })
    .toArray()
}

class DBManager {

    constructor() {
        return createDB();
    }

    open() {
        var date = new Date();
        year = date.getFullYear();
        db.open();
    }

    addEntry(entry) {
        return storeEntry(entry);
    }

    delete(id) {
        return deleteEntry(id);
    }

    count() {
        return countEntries();
    }

    getAllEntries() {
        return getAllEntriesInDB();
    }
    
    getRatings() {
        return getRatingsInDB();
    }

    getMeals() {
        return getMealsInDB();
    }

    getMoney() {
        return getMoneyInDB();
    }

    clear() {
        return clearDB();
    }

    getDateSortDesc() {
        return getDateSortDescInDB();
    }
    
    getDateSortAsc() {
        return getDateSortAscInDB();
    }
    
    getPriceSortDesc() {
        return getPriceSortDescInDB();
    }
    
    getPriceSortAsc() {
        return getPriceSortAscInDB();
    }
    
    getEntriesWithMeat() {
        return getEntriesWithMeatInDB();
    }
    
    getEntriesWithGluten() {
        return getEntriesWithGlutenInDB();
    }
    
    getEntriesWithLactose() {

        return getEntriesWithLactoseInDB();
    }
    
    freeTextSearch(input) {
        return freeTextSearchInDB(input);
    }


}

export default DBManager;