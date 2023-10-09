namespace TicTacToe
{
    using Utils;


    class TicTacToe
    {
        const int EMPTY = 0;
        const int PLAYER1 = 1;
        const int PLAYER2 = -1;
        int[,] board = {
            { EMPTY, EMPTY, EMPTY },
            { EMPTY, EMPTY, EMPTY },
            { EMPTY, EMPTY, EMPTY }
        };

        int currentPlayer = PLAYER1;
        bool isPlaying = true;

        public TicTacToe()
        {
            while (isPlaying)
            {
                System.Console.Clear();
                DrawBoard(board);
                System.Console.WriteLine("Player " + currentPlayer + "'s turn");
                string input = System.Console.ReadLine();
                int row = int.Parse(input.Split(' ')[0]);
                int col = int.Parse(input.Split(' ')[1]);
                Console.WriteLine(row + " " + col);
                board[row, col] = currentPlayer;

                int gameState = CheckForWin(board);
                currentPlayer = currentPlayer * -1;
                if (gameState != 0)
                {

                    DrawBoard(board);
                    System.Console.WriteLine("Player " + currentPlayer + " wins!");
                    isPlaying = false;
                }

            }
        }

        int CheckForWin(int[,] board)
        {

            int winSum = board.GetLength(0);

            // rows
            for (int i = 0; i < board.GetLength(0); i++)
            {
                int sum = 0;
                for (int j = 0; j < board.GetLength(1); j++)
                {
                    sum += board[i, j];
                }
                if (sum == (winSum * PLAYER1) || sum == (winSum * PLAYER2))
                {
                    return sum / winSum;
                }
            }

            // columns
            for (int i = 0; i < board.GetLength(1); i++)
            {
                int sum = 0;
                for (int j = 0; j < board.GetLength(0); j++)
                {
                    sum += board[j, i];
                }
                if (sum == (winSum * PLAYER1) || sum == (winSum * PLAYER2))
                {
                    return sum / winSum;
                }
            }

            return 0;
        }


        void DrawBoard(int[,] board)
        {
            for (int i = 0; i < board.GetLength(0); i++)
            {
                string row = "| ";
                for (int j = 0; j < board.GetLength(1); j++)
                {
                    row += $"{board[i, j]} | ";
                }
                System.Console.WriteLine(row);
            }
        }

    }

}