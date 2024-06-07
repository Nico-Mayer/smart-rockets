# About

[Live Demo](https://smart-rockets.vercel.app/)

This is a small TypeScript project utilizing the Pixi.js library. The concept revolves around a set of rockets aiming to reach a user-defined target.

The rockets employ a genetic algorithm, becoming smarter with each generation to find the shortest path to the target.

# Explanation

The best rockets from each generation survive and pass their "genes" to their offspring in the next generation. These "genes" represent the vector directions in which the rockets move and are visualized by the head and tail colors of the rockets.

-   Head Color: Represents Parent 1
-   Tail Color: Represents Parent 2

This allows you to track which rockets contribute their "genes" the most to subsequent generations.

If a rocket is blinking, it means it has undergone mutation and differs significantly from its parents.
