import sys,os,random
from pynput import keyboard
from pprint import pprint



ESC = '\x1b'
CSI = ESC + '['
CURSOR_UP = CSI + 'A'
CURSOR_DOWN = CSI + 'B'
CURSOR_RIGHT = CSI + 'C'
CURSOR_LEFT = CSI + 'D'
DELETE_SCREEN = CSI + "3J"
CLEAR_SCREEN = CSI + '2J'
CURSOR_HOME = CSI + '11H'
SAVE_CURSOR = ESC + '7'
HIDE_CURSOR = '\u001B[?25l'
SHOW_CURSOR = '\u001B[?25h'
RESTORE_CURSOR = ESC + '8'
BELL = '\x07'
RESET = '\x1b[0m'
GREEN = '\x1b[32m'
RED = '\x1b[31m'
YELLOW = '\x1b[33m'
BLUE = '\x1b[34m'
BACK_GREEN = '\x1b[42m'
def moveCursorTo(row, col): return f'{CSI}{row};{col}H'

CORNERS = ["╔", "╗","╝","╚"]
VERICAL = "║"
HORIZONTAL = "═"

MAX_NUMBER_OF_THROWS = 3

NUMBER_OF_DICE = 5

dice = []
keptDice = []
numberOfThrows = 0
currentRuleIndex = 7

RULES = [
    {"id":"ones", "valuable":"1", "description":"Sum of all 1s" ,"label":"1s"},
    {"id":"tows", "valuable":"2", "description":"Sum of all 2s" , "label":"2s"},
    {"id":"threes", "valuable":"3" , "description":"Sum of all 3s", "label":"3s"},
    {"id":"fours", "valuable":"4" , "description":"Sum of all 4s", "label":"4s"},
    {"id":"fives", "valuable":"5" , "description":"Sum of all 5s", "label":"5s"},
    {"id":"sixes", "valuable":"6", "description":"Sum of all 6s", "label":"6s"},
    {"id":"bonus", "valuable":"*", "description":"Bonus if sum of 1s-6s is 63 or more", "label":"Bonus"},
    {"id":"pairs", "valuable":"1aa", "description":"Sum of the highest pair", "label":"Pairs"},
    {"id":"twoPairs", "valuable":"2aa", "description":"Sum of the two highest pairs", "label":"2 Pairs"},
    {"id":"threeOfaKind", "valuable":"3a", "description":"Sum of the three of a kind", "label":"3 of a kind"},
    {"id":"fourOfaKind", "valuable":"4a", "description":"Sum of the four of a kind", "label":"4 of a kind"},
    {"id":"smalStraight", "valuable":"1,2,3,4,5", "description":"You must role 1,2,3,4,5" , "label":"Smal Straight"},
    {"id":"largeStraight", "valuable":"2,3,4,5,6", "description":"You must role 2,3,4,5,6", "label":"Large Straight"},
    {"id":"fullHouse", "valuable":"3a2b", "description":"You must role 3 of a kind and 2 of a kind", "label":"Full House"},
    {"id":"chance", "valuable":"*" , "description":"Sum of all dice", "label":"Chance"},
    {"id":"yatzee", "valuable":"5a", "description":"You must role 5 of a kind", "score":50, "label":"Yatzee"},
]

scoreBoard = {
    "ones": 0,
    "tows": 0,
    "threes": 0,
    "fours": 0,
    "fives": 0,
    "sixes": 0,
    "pairs": 0,
    "bonus": 0,
    "twoPairs": 0,
    "threeOfaKind": 0,
    "fourOfaKind": 0,
    "smalStraight": 0,
    "largeStraight": 0,
    "fullHouse": 0,
    "chance": 0,
    "yatzee": 0,
}

def showStartScreen():
    print("Yatzee")
    global scoreBoard, currentRuleIndex
    drawScoreBoard(scoreBoard)
    print(f'''Press R key to start roling for {RULES[currentRuleIndex]["label"]}''')
    print(f'''{RULES[currentRuleIndex]["label"]} : {RULES[currentRuleIndex]["description"]}''')
    

def drawScoreBoard(scoreBoard):
    print(f'''{CORNERS[0]}{HORIZONTAL*48}{CORNERS[1]}''')
    for rule in RULES:
        prepend = ""
        if(rule == RULES[currentRuleIndex]):
            prepend = BACK_GREEN + YELLOW
        
        print(f'''{VERICAL}{prepend} {rule["label"].ljust(15)}|{str(scoreBoard[rule["id"]]).rjust(30)} {RESET}{VERICAL}''')
        print(f'''{VERICAL}{"-"* 48}{VERICAL}''')
        
    print(f'''{VERICAL} {"Total".ljust(15)}|{"0".rjust(30)} {VERICAL}''')
    print(f'''{CORNERS[3]}{HORIZONTAL * 48}{CORNERS[2]}''')
    
def performRole(dice):
    global numberOfThrows, keptDice
    numberOfThrows += 1
    dice = createRandomizeD6Collection(NUMBER_OF_DICE - len(keptDice))
    return dice

def createRandomizeD6Collection(numberOfDice):
    dice = [0] * numberOfDice
    for i in range(numberOfDice):
        dice[i] = random.randint(1, 6)
    return dice
    

def canRoleBeDone():
    return numberOfThrows < MAX_NUMBER_OF_THROWS 

def isPosibleDiceSelection(key, dice, keptDice) :
    return (key.isnumeric() == True) and (len(dice) <= NUMBER_OF_DICE) and (len(keptDice) <= NUMBER_OF_DICE);

def isEndOfTurn(key) :
    return key == "enter"

def preformeDiceSelection(key,dice,keptDice):
    index = int(key.char)
        
    if(index >= len(dice)) :
        kIndex =  index - len(dice)  
        dice.append(keptDice[kIndex])
        keptDice.pop(kIndex)
    else:
        keptDice.append(dice[index])
        dice.pop(index)
    
    print(dice, keptDice, flush=True)
    return [dice, keptDice]

def preformEndOfTurn(keptDice):
    sum = 0
    global currentRuleIndex, scoreBoard

    if(RULES[currentRuleIndex]["valuable"].isnumeric() == False ):

        if RULES[currentRuleIndex]["id"] == "bonus" :
            sum = scoreBoard["ones"] + scoreBoard["twos"] + scoreBoard["threes"] + scoreBoard["fours"] + scoreBoard["fives"] + scoreBoard["sixes"]
            if sum >= 63 :
                scoreBoard["bonus"] = 50
            
        elif RULES[currentRuleIndex]["id"] == "pairs" and len(keptDice) >= 2:
            keptDice.sort(reverse=True)
            pairs = 0
            while (pairs == 0 or len(keptDice) > 1) :
                d = keptDice.pop(0)
                if d == keptDice[0]:
                    pairs += 1
                    sum = d*2
                
            scoreBoard["pairs"] = sum
        elif (RULES[currentRuleIndex]["id"] == "twoPairs" and len(keptDice) >= 4):
            # TODO: Implement two pairs
            print("Not implemented")
        elif (RULES[currentRuleIndex]["id"] == "threeOfaKind" and len(keptDice) >= 3):

            keptDice.sort(reverse=True)
            dice = keptDice.pop(0)
            if(dice == keptDice[0] and dice == keptDice[1]):
                sum = dice*3
            scoreBoard["threeOfaKind"] = sum

        elif(RULES[currentRuleIndex]["id"] == "fourOfaKind" and len(keptDice) >= 4):
            #TODO: Implement four of a kind
            assert("Not implemented")
        elif(RULES[currentRuleIndex]["id"] == "smalStraight" and len(keptDice) == 5):
            keptDice = keptDice.sort(reverse=True)
            if("".join(keptDice) == "12345"):
                scoreBoard["smalStraight"] = 15
        elif(RULES[currentRuleIndex]["id"] == "largeStraight" and len(keptDice) == 5):
            #TODO: Implement large straight
            assert("Not implemented")
        elif(RULES[currentRuleIndex]["id"] == "fullHouse" and len(keptDice) == 5):
            #TODO: Implement fullHouse
            assert("Not implemented")
        elif(RULES[currentRuleIndex]["id"] == "chance" and len(keptDice) == 5):
            #TODO: Implement chance
            assert("Not implemented")
        elif(RULES[currentRuleIndex]["id"] == "yatzee" and len(keptDice) == 5):
            #TODO: Implement chance
            assert("Not implemented")
        

    else:
        for i in keptDice: 
            if RULES[currentRuleIndex]["valuable"] == str(i) :
                sum += i
        
        scoreBoard[RULES[currentRuleIndex]["id"]] = sum

    currentRuleIndex += 1
    if currentRuleIndex == 6 :
        preformEndOfTurn([]);
    


def on_press(key):

    keyValue = ""
    if hasattr(key, 'char')  :
        keyValue = key.char
    else : 
        keyValue = key.name

    global currentRuleIndex, scoreBoard, dice, keptDice
    
    if keyValue == 'q':
        sys.stdout.write(CLEAR_SCREEN+CURSOR_HOME)
        sys.exit(0)
    
    if keyValue == 'r' :
        if(canRoleBeDone()):
            dice = performRole(dice)
            print(CLEAR_SCREEN, DELETE_SCREEN, CURSOR_HOME)
            print("Free dice: ",dice ," Kept dice: ",keptDice)
            print("Keep dice by pressing the index of the dice. Press enter to end round")
            print(f'''{RULES[currentRuleIndex]["label"]} : {RULES[currentRuleIndex]["description"]}''')
        else: 
           print("You have exceeded the maximum number of throws for this rule")
    else:
        
        if(isPosibleDiceSelection(keyValue,dice,keptDice)):
            [dice,keptDice] = preformeDiceSelection(key,dice,keptDice)
        elif(isEndOfTurn(keyValue)):
            preformEndOfTurn(keptDice)
            print(CLEAR_SCREEN, DELETE_SCREEN, CURSOR_HOME)
            drawScoreBoard(scoreBoard)
            print(f'''Press R key to start roling for {RULES[currentRuleIndex]["label"]}''')
            print( RULES[currentRuleIndex]["description"])
            resetForNewRound()


def resetForNewRound ():
    global keptDice, dice,numberOfThrows
    keptDice = []
    dice = []
    numberOfThrows = 0

  
         
    


def start():
    showStartScreen()
    with keyboard.Listener(on_press=on_press, suppress=True) as listener:
        listener.join()
    


start()
