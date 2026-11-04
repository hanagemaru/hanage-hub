---
title: From Gradient Sweeper to Multicolor Sweeper
date: 2026-09-27
game: multicolorSweeper
---

Before making Multicolor Sweeper, I built a prototype called Gradient Sweeper.

The prototype had two bomb colors, red and blue. When you opened a tile, it showed a color instead of a number. Brightness indicated the number of nearby bombs, while the mix of red and blue determined the hue. That gave 45 combinations, each with its own color.

I thought gradients would improve the look of the board, but the result wasn't as good as I expected. My family tried playing it and weren't particularly impressed either. So I kept the colored bombs but changed the clues back to numbers, with a separate number for each color.

One of my priorities when rebuilding the game was to remove situations where players have to guess. In a regular game of Minesweeper, you can end up choosing between two tiles with no way to tell which is safe. To avoid that, the game tries solving each generated board and rejects any board that can't be solved through deduction alone. The first tile you open and its eight neighbors are also always safe.

The colors also needed to matter. If a board can be solved without distinguishing them, there's no reason for them to be there. I therefore use only boards that require players to look at the numbers for each color.

I built a comparison page to try playing with three and four bomb colors. After testing both, I decided to keep them both, so players can choose.
