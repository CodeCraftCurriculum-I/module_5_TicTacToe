import * as readline from 'node:readline';
import { isNumberObject } from 'node:util/types';
import { runInContext } from 'node:vm';

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}


const ESC = '\x1b';
const CSI = ESC + '[';
const CURSOR_UP = CSI + 'A';
const CURSOR_DOWN = CSI + 'B';
const CURSOR_RIGHT = CSI + 'C';
const CURSOR_LEFT = CSI + 'D';
const DELETE_SCREEN = CSI + "3J";
const CLEAR_SCREEN = CSI + '2J';
const CURSOR_HOME = CSI + '1;1H';
const SAVE_CURSOR = ESC + '7';
const HIDE_CURSOR = '\u001B[?25l';
const SHOW_CURSOR = '\u001B[?25h';
const RESTORE_CURSOR = ESC + '8';
const moveCursorTo = (row, col) => CSI + row + ';' + col ;
const BELL = '\x07';
const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const BACK_GREEN = '\x1b[42m';

const CORNERS = ["╔", "╗","╝","╚"]
const VERICAL = "║";
const HORIZONTAL = "═";

const MAX_NUMBER_OF_THROWS = 3

const NUMBER_OF_DICE = 5;
let dice = [];
let keptDice = [];
let numberOfThrows = 0

const RULES = [
    {id:"ones", valuable:"1", description:"Sum of all 1s" ,label:"1s"},
    {id:"tows", valuable:"2", description:"Sum of all 2s" , label:"2s"},
    {id:"threes", valuable:"3" , description:"Sum of all 3s", label:"3s"},
    {id:"fours", valuable:"4" , description:"Sum of all 4s", label:"4s"},
    {id:"fives", valuable:"5" , description:"Sum of all 5s", label:"5s"},
    {id:"sixes", valuable:"6", description:"Sum of all 6s", label:"6s"},
    {id:"bonus", valuable:"*", description:"Bonus if sum of 1s-6s is 63 or more", label:"Bonus"},
    {id:"pairs", valuable:"1aa", description:"Sum of the highest pair", label:"Pairs"},
    {id:"twoPairs", valuable:"2aa", description:"Sum of the two highest pairs", label:"2 Pairs"},
    {id:"threeOfaKind", valuable:"3a", description:"Sum of the three of a kind", label:"3 of a kind"},
    {id:"fourOfaKind", valuable:"4a", description:"Sum of the four of a kind", label:"4 of a kind"},
    {id:"smalStraight", valuable:"1,2,3,4,5", description:"You must role 1,2,3,4,5" , label:"Smal Straight"},
    {id:"largeStraight", valuable:"2,3,4,5,6", description:"You must role 2,3,4,5,6", label:"Large Straight"},
    {id:"fullHouse", valuable:"3a2b", description:"You must role 3 of a kind and 2 of a kind", label:"Full House"},
    {id:"chance", valuable:"*" , description:"Sum of all dice", label:"Chance"},
    {id:"yatzee", valuable:"5a", description:"You must role 5 of a kind", score:50, label:"Yatzee"},
]

const scoreBoard = {
    ones: 0,
    twos: 0,
    threes: 0,
    fours: 0,
    fives: 0,
    sixes: 0,
    pairs: 0,
    bonus: 0,
    twoPairs: 0,
    threeOfaKind: 0,
    fourOfaKind: 0,
    smalStraight: 0,
    largeStraight: 0,
    fullHouse: 0,
    chance: 0,
    yatzee: 0,
}

let currentRuleIndex = 0;

function showStartScreen(){
    console.log("Yatzee");
    drawScoreBoard(scoreBoard);
    console.log(`Press R key to start roling for ${RULES[currentRuleIndex].label}`);
    console.log(`${RULES[currentRuleIndex].label} : ${RULES[currentRuleIndex].description}`);
    
}

function drawScoreBoard(scoreBoard){
    console.log("Scoreboard");
    console.log(`${CORNERS[0]}${HORIZONTAL.repeat(48)}${CORNERS[1]}`);
    for(let i = 0; i < RULES.length; i++ ){
        const rule = RULES[i];
        let prepend = ""
        if(i === currentRuleIndex){
            prepend = BACK_GREEN + YELLOW;
        }
        console.log(`${VERICAL}${prepend} ${rule.label.padEnd(15)}|${String(scoreBoard[rule.id]).padStart(30)} ${RESET}${VERICAL}`);
        console.log(`${VERICAL}${"-".padEnd(48,"-")}${VERICAL}`);
    }
    console.log(`${VERICAL} ${"Total".padEnd(15)}|${"0".padStart(30)} ${VERICAL}`);
    console.log(`${CORNERS[3]}${HORIZONTAL.repeat(48)}${CORNERS[2]}`);
}

function createRandomizeD6Collection(numberOfDice){
    let dice = new Array(numberOfDice)
    for(let i = 0; i < numberOfDice; i++ ){
        dice[i] = Math.round(Math.random() * 5) +1;
    }
    return dice;
}

process.stdin.on("keypress", (str, key) => {

    // r -> role dice
    // [0 - 9] -> Keep dice at index
    // Enter -> End current round
    // Q quit. 

    if(key.name === "r"){

        if(canRoleBeDone(key)){
            dice = performRole(dice);
            console.log(CLEAR_SCREEN, DELETE_SCREEN, CURSOR_HOME);
            console.log("Free dice: ",dice ," Kept dice: ",keptDice);
            console.log("Keep dice by pressing the index of the dice. Press enter to end round");
            console.log(`${RULES[currentRuleIndex].label} : ${RULES[currentRuleIndex].description}`);
        } else {
            console.log("You have exceeded the maximum number of throws for this rule");
        }

    } else {
        
        if(isPosibleDiceSelection(key,dice,keptDice)){
            [dice,keptDice] = preformeDiceSelection(key,dice,keptDice);
        } else if(isEndOfTurn(key)){
            preformEndOfTurn(keptDice);
            console.log(CLEAR_SCREEN, DELETE_SCREEN, CURSOR_HOME);
            drawScoreBoard(scoreBoard);
            console.log(`Press R key to start roling for ${RULES[currentRuleIndex].label}`);
            console.log( RULES[currentRuleIndex].description)
            resetForNewRound();
        }  
    }

    if (key.name === "q") {
        process.stdout.write(CLEAR_SCREEN+CURSOR_HOME);
        process.exit(0);
    }

});



function performRole(dice) {
    numberOfThrows++; // numberOfThrows = numberOfThrows + 1;
    dice = createRandomizeD6Collection(NUMBER_OF_DICE - keptDice.length);
    return dice;
}

function canRoleBeDone(key) {
    return key.name === "r" && numberOfThrows < MAX_NUMBER_OF_THROWS;
}

function isEndOfTurn(key) {
    return key.name === "return";
}



function preformEndOfTurn(keptDice){
    let sum = 0;
    if(isNaN(RULES[currentRuleIndex].valuable) ){

        if(RULES[currentRuleIndex].id === "bonus"){
            sum = scoreBoard.ones + scoreBoard.twos + scoreBoard.threes + scoreBoard.fours + scoreBoard.fives + scoreBoard.sixes;
            if(sum >= 63){
                scoreBoard.bonus = 50;
            }
        } else if(RULES[currentRuleIndex].id === "pairs"){
            
            keptDice = keptDice.sort((a,b) => b - a);
            let pairs = 0;
            while(pairs === 0 || keptDice.length <= 1){
                let dice = keptDice.shift();
                if(dice === keptDice[0]){
                    pairs++;
                    sum = dice*2
                }
            }

            scoreBoard.pairs = sum;
        } else if(RULES[currentRuleIndex].id === "twoPairs" && keptDice.length >= 4){
            ///TODO: Implement two pairs
        } else if(RULES[currentRuleIndex].id === "threeOfaKind" && keptDice.length >= 3){

            keptDice = keptDice.sort((a,b) => b - a);
            let dice = keptDice.shift();
            if(dice === keptDice[0] && dice === keptDice[1]){
                sum = dice*3
            }
            scoreBoard.threeOfaKind = sum;

        } else if(RULES[currentRuleIndex].id === "fourOfaKind" && keptDice.length >= 4){
            ///TODO: Implement four of a kind
        } else if(RULES[currentRuleIndex].id === "smalStraight" && keptDice.length === 5){
            keptDice = keptDice.sort((a,b) => a - b);
            if(keptDice.join() === "12345"){
                scoreBoard.smalStraight = 15;
            }
        } else if(RULES[currentRuleIndex].id === "largeStraight" && keptDice.length === 5){
            ///TODO: Implement large straight
        } else if(RULES[currentRuleIndex].id === "fullHouse" && keptDice.length === 5){
            ///TODO: Implement fullHouse
        }else if(RULES[currentRuleIndex].id === "chance" && keptDice.length === 5){
            ///TODO: Implement chance
        }else if(RULES[currentRuleIndex].id === "yatzee" && keptDice.length === 5){
            ///TODO: Implement chance
        }

    } else {
        for(let i of keptDice){
            if(RULES[currentRuleIndex].valuable == i){
                sum += i;
            }
        }

        scoreBoard[RULES[currentRuleIndex].id] = sum;
    }
    
    
    currentRuleIndex++;
    if(currentRuleIndex === 6){
        preformEndOfTurn([]);
    }
}

function resetForNewRound (){
    keptDice = [];
    dice = [];
    numberOfThrows = 0;
}

function preformeDiceSelection(key,dice,keptDice){
    let index = key.name *1;
        
    if(index >= dice.length) {
        let kIndex =  index - dice.length  ;
        console.log("kIndex", kIndex , index, keptDice.length);
        dice.push(keptDice[kIndex]);
        keptDice.splice(kIndex, 1);
    } else{
        keptDice.push(dice[index]);
        dice.splice(index,1)
    }

    console.log(dice, keptDice);
    return [dice, keptDice]
}

function isPosibleDiceSelection(key, dice, keptDice) {
    return isNaN(key.name) === false 
    && dice.length <= NUMBER_OF_DICE 
    && keptDice.length <= NUMBER_OF_DICE;
}

showStartScreen();