---
title: From Gradient Sweeper to Multicolor Sweeper
date: 2026-09-27
game: multicolorSweeper
---

Before Multicolor Sweeper there was a prototype called Gradient Sweeper.

It had two bomb colors, red and blue. Opened cells showed a color instead of a number. The number of nearby bombs set the brightness, and the red-to-blue mix set the hue. That makes 45 combinations, and each one got its own color.

I thought a gradient board would look good. It didn't, really. My family played it and weren't impressed either. So I rebuilt it. Keep the colors, bring back the numbers, and show a separate number for each bomb color.

When I rebuilt it, I decided on one thing: no luck.

Late in a game of Minesweeper you can end up with a coin flip. Losing to that doesn't sit right. So every time a board is made, the game solves it once first, and any board that needs a guess is thrown away. The first cell you open and the eight around it are always safe.

One more thing. If a board can be solved while ignoring the colors, the colors are pointless. So only boards that get stuck when you ignore the colors are kept.

Three colors or four? I built a comparison page first and played both. In the end I kept both, and you can pick.
