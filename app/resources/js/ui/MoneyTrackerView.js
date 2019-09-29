/* eslint-env browser */

import Config from "../utils/Config.js";

var inputField, chosenBudget, spentMoney;
let myStorage;

function initMoneyTracker(money) {
    let button = document.getElementById("moneytracker-button");
    button.addEventListener("click", onButtonClicked);
    spentMoney = monthlyMoney(money);
    myStorage = localStorage;
    inputField = document.getElementById("moneytracker-input");
    inputField.addEventListener("keypress", function(e) {
        var key = e.which || e.keyCode;
        if (key === Config.ENTER_CODE) {
            confirmedInput(money);
        }
    });
    chosenBudget = myStorage.getItem("budget");
    if (chosenBudget !== null) {
        setNewBudget();
        getLoadingBarValues();
    }
}

function onButtonClicked() {
    inputField.classList.remove("hidden");
    inputField.focus();
}

function confirmedInput(money) {
    inputField.classList.add("hidden");
    if (inputField.value !== "") {
        if (inputField.value === "0") {
            let shownBudget = document.getElementById("moneytracker-value"),
            elem = document.getElementById("myBar");
            shownBudget.innerHTML = "";
            myStorage.clear();
            inputField.value = "";
            elem.innerHTML = "";
            elem.style.width = 0;
        } else {
            chosenBudget = inputField.value;
            chosenBudget = parseInt(chosenBudget);
            chosenBudget = chosenBudget.toFixed(Config.DECIMALS);
            spentMoney = monthlyMoney(money);
            myStorage.setItem("budget", chosenBudget);
            setNewBudget();
            inputField.value = "";
            getLoadingBarValues();
        }
    }
}

function monthlyMoney(money) {
    var currentMoney = 0;
    let date = new Date(),
    month = date.getMonth();
    for (let i = 0; i < money.length; i++) {
        if (month === i) {
            currentMoney = money[i];
        }
    }
    return currentMoney;
}

function setNewBudget() {
    let shownBudget = document.getElementById("moneytracker-value");
    shownBudget.innerHTML = spentMoney + " " + Config.EURO_CHAR + " / " + chosenBudget + " " + Config.EURO_CHAR;
}

function getLoadingBarValues() {
    let value = chosenBudget / Config.PERCENT,
    ld = spentMoney / value;
    var elem = document.getElementById("myBar"),
    width = 0,
    id = setInterval(frame, Config.INTERVAL);
    function frame() {
        if (width > ld) {
            clearInterval(id);
            width++;
            elem.innerHTML = width * 1 + "%";
        } else if (ld === 0){
            clearInterval(id);
            elem.innerHTML = "";
            elem.style.width = 0;
        } else {
            if (width < ld) {
                width++;
                if (width <= Config.PERCENT) {
                    elem.style.width = width + "%";
                }
                elem.innerHTML = width * 1 + "%";
                if (width < Config.FIFTY_PERCENT) {
                    elem.style.backgroundColor = "#4CC972";
                }
                if (width >= Config.FIFTY_PERCENT) {
                    elem.style.backgroundColor = "#A3C924";
                }
                if (width >= Config.EIGHTY_PERCENT) {
                    elem.style.backgroundColor = "#E65437";
                }
            }
        }
    }
}

class MoneyTrackerView {

    constructor(money) {
        initMoneyTracker(money);
        this.budget = myStorage.getItem("budget") || inputField.value;
    }

}

export default MoneyTrackerView;