### Introduction:

The traditional game of Tic-Tac-Toe is a classic that many learn to play in their early years. While it may appear to be a simple game, it serves as an excellent project for teaching core programming concepts such as arrays, loops, conditionals, variables, and functions.

**Variables:** The Xs and Os that populate the game board are essentially variables. Tracking the current player, whose turn it is to make a move, is also managed through variables.

**Conditionals:** Conditionals help us determine the state of the game. Have all the cells been filled? Has a player won? These questions are answered using conditional statements.

**Arrays:** A Tic-Tac-Toe board is essentially a 2D array. The game state is usually stored in an array structure, making it easy to check for a win or a draw.

**Loops:** Loops allow us to cycle through the game board for various checks – like looking for three Xs or Os in a row, column, or diagonal.

**Functions:** Functions can be created for reusable tasks like checking for a winner, validating a player’s move, and switching between players.

The primary objective of extending this game isn't just to make it functional but to also demonstrate the significance of well-written code. Clean and maintainable code makes debugging easier and lets other programmers understand your thought process.

### Project Requirements:

You must work from the supplied code at `https://github.com/CodeCraftCurriculum-I/module_5_TicTacToe`
We recomend that before getting your hands dirty with code, develop a pseudo-code and/or a flowchart.
At times it is advisable to make flowcharts for smaler segments of code.

1. **Implement a Start Screen**

   - Create a basic start screen with an option to start the game, Navigating the menu should be done using arrow up / down and Enter to select.
   - Menu items : 1P Game, 2P Game, Settings, Quit (all menu )
   - When ever a game is complete, the player should return to this screen.

2. **Better UI**

   - Change the rendeing of the board so that it is similar to image 1. I.e. we do not want to see -1 and 1 values but X´s and O´s
     ![image 1: displaying symboles not values ](/tt1.png)

3. **Even better ui**

   - Change the drawing of the board so that it is similar to image 2
     ![image 2: displaying symboles not values ](/tt2.png)

4. **Even more ui**

   - Change the drawing of the board so that it is similar to image 3
     ![image 3: displaying whos turn it is ](/tt3.png)

5. **Add ANSI Escape Codes to Add Color**

   - Enhance your game's user interface by using ANSI escape codes to add color.

6. **Winner Winner Chicken Dinner**

   - The game is currently unable to find the winner in all cases. Change the code so that it can do so (do not change the strategy for doing so).

7. **More input**

   - The player should at any time be able to type q + <Enter> to quit.
   - The Player should at any time be able to type r + <Enter> to restart the current game

8. **2p Player hotseat**

   - Make it so that it is possible to play 2 player hotseat
   - Change the code so that the players give their name before starting (so no Player 1/2 turn, use theri names )

9. **Bablefish**

   - Under settings in the menu, make it possible to change the games language. You should suport at minimum two languages.

10. **Bad inpu**

- Do not let players put tokens on spaces that are filed.

Challenge Requirements (Higher Grades):

TIP: ANSI CODES ;)

1. **Center stage**

   - Draw the game board in the center of the screen.
   - Center align text.

2. **Winner redux**

   - Change the background of the winning row/column/diagonal.

3. **Better UI**

   - In stead of giving row and column, the player should move to the cell using arrow keys.
   - Enter for selection.
   - If user starts typing (q/r) show that at the bottom of the screen.

In your README file, include a section discussing potential challenges or limitations in your extended version of the game. Offer reflections on what could be improved or built differently in the future.
