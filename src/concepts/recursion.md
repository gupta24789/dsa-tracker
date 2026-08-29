## What is Recursion?

**Analogy:** You're standing in a long corridor of mirrors. Each mirror reflects the next one. Recursion is the same — a function that calls a smaller version of itself until it hits a base case (the last mirror).

**Three parts of every recursive function:**
1. **Base case** — when to stop
2. **Recursive call** — smaller version of the same problem
3. **Processing** — what to do before or after the call

**Before vs After the recursive call:**
- Process **before** the call → top-down (work on current element first)
- Process **after** the call → bottom-up (work after coming back from deepest call)

---

## Pattern 1: Pick / No-Pick (Subsets)

**The idea:** At each element, make a binary choice — include it or skip it. This generates 2^n possibilities.

**Analogy:** Packing a bag. For each item, you either pack it or leave it. Every combination gives a different bag.

```viz
{
  "type": "recursion",
  "title": "Pick / No-Pick — Generate All Subsets of [1,2,3]",
  "description": "At index i, branch left = skip arr[i], branch right = pick arr[i]. Leaves at depth 3 are the 2³=8 subsets.",
  "calls": [
    { "id": "root", "label": "i=0,[]", "x": 50, "y": 8 },
    { "id": "L",  "label": "i=1,[]",  "parent": "root", "x": 25, "y": 26 },
    { "id": "R",  "label": "i=1,[1]", "parent": "root", "x": 75, "y": 26 },
    { "id": "LL", "label": "i=2,[]",   "parent": "L", "x": 12, "y": 44 },
    { "id": "LR", "label": "i=2,[2]",  "parent": "L", "x": 38, "y": 44 },
    { "id": "RL", "label": "i=2,[1]",  "parent": "R", "x": 62, "y": 44 },
    { "id": "RR", "label": "i=2,[1,2]", "parent": "R", "x": 88, "y": 44 },
    { "id": "LLL", "label": "[]",      "parent": "LL", "x": 6,  "y": 62 },
    { "id": "LLR", "label": "[3]",     "parent": "LL", "x": 19, "y": 62 },
    { "id": "LRL", "label": "[2]",     "parent": "LR", "x": 32, "y": 62 },
    { "id": "LRR", "label": "[2,3]",   "parent": "LR", "x": 45, "y": 62 },
    { "id": "RLL", "label": "[1]",     "parent": "RL", "x": 58, "y": 62 },
    { "id": "RLR", "label": "[1,3]",   "parent": "RL", "x": 71, "y": 62 },
    { "id": "RRL", "label": "[1,2]",   "parent": "RR", "x": 84, "y": 62 },
    { "id": "RRR", "label": "[1,2,3]", "parent": "RR", "x": 97, "y": 62 }
  ],
  "speed": 900,
  "steps": [
    { "visible": ["root"], "active": "root", "label": "Start at index 0 with subset []. Two choices: skip 1, or pick 1." },
    { "visible": ["root","L","R"], "active": "L", "label": "Branch: L=skip 1 ([]) , R=pick 1 ([1]). Go into L first." },
    { "visible": ["root","L","R","LL","LR"], "active": "LL", "label": "From L: skip 2 (LL, []) or pick 2 (LR, [2])." },
    { "visible": ["root","L","R","LL","LR","LLL","LLR","LRL","LRR"], "highlight": ["LLL","LLR","LRL","LRR"], "label": "Depth 3 leaves under L: [], [3], [2], [2,3]." },
    { "visible": ["root","L","R","LL","LR","RL","RR","LLL","LLR","LRL","LRR"], "active": "R", "label": "Now expand R: skip 2 (RL, [1]) or pick 2 (RR, [1,2])." },
    { "visible": ["root","L","R","LL","LR","RL","RR","LLL","LLR","LRL","LRR","RLL","RLR","RRL","RRR"], "highlight": ["RLL","RLR","RRL","RRR"], "label": "Depth 3 leaves under R: [1], [1,3], [1,2], [1,2,3].", "note": "All 8 leaves = all 8 subsets ✓. Height 3 = number of elements; 2 branches per level = 2³ leaves." }
  ]
}
```

**When to use:** Generate all subsets, subset sum, count subsequences.

> **In an interview:** trigger words are *"all subsets / all subsequences / every combination"*. Clarify whether duplicates in the input must be de-duped in the output.
> **Remember:** at each index, branch twice — pick it or skip it.

---

## Pattern 2: Backtracking

**The idea:** Explore all possibilities, but prune dead ends. Undo your choice (backtrack) before trying the next option.

**Analogy:** Solving a maze. Try a path — dead end? Go back to the last junction and try another direction.

```viz
{
  "type": "recursion",
  "title": "Backtracking — First 2 Full Permutations of [1,2,3]",
  "description": "Each frame = one recursive call: choose an unused number, recurse, then undo (backtrack) before trying the next choice at that same level.",
  "calls": [
    { "id": "root", "label": "slot0", "x": 50, "y": 8 },
    { "id": "try1", "label": "try 1",  "parent": "root", "x": 50, "y": 26 },
    { "id": "try2", "label": "try 2",  "parent": "try1", "x": 35, "y": 44 },
    { "id": "try3", "label": "try 3",  "parent": "try2", "x": 35, "y": 62 },
    { "id": "try3b", "label": "try 3", "parent": "try1", "x": 65, "y": 44 },
    { "id": "try2b", "label": "try 2", "parent": "try3b", "x": 65, "y": 62 }
  ],
  "speed": 1000,
  "steps": [
    { "visible": ["root"], "active": "root", "label": "Slot 0: no numbers used yet. Try 1." },
    { "visible": ["root","try1"], "active": "try1", "highlight": ["root"], "label": "Slot 0 = 1. used={1}. Recurse into slot 1." },
    { "visible": ["root","try1","try2"], "active": "try2", "highlight": ["root","try1"], "label": "Slot 1: try 2 (3 was also available). used={1,2}. Recurse into slot 2." },
    { "visible": ["root","try1","try2","try3"], "active": "try3", "highlight": ["root","try1","try2"], "label": "Slot 2: only 3 left → try 3. Permutation [1,2,3] found!" },
    { "visible": ["root","try1","try2","try3"], "returned": { "try3": "[1,2,3]", "try2": "[1,2,3]" }, "highlight": ["try3"], "label": "Base case hit → return up. Slot 2's call returns, slot 1's call returns." },
    { "visible": ["root","try1","try2","try3","try3b"], "active": "try3b", "returned": { "try2": "[1,2,3]" }, "highlight": ["try1"], "label": "Back at slot 1: UNDO try 2 (used={1} again). Try 3 instead. Recurse into slot 2." },
    { "visible": ["root","try1","try2","try3","try3b","try2b"], "active": "try2b", "returned": { "try2": "[1,2,3]", "try3b": "[1,3,2]" }, "highlight": ["root","try1","try3b"], "label": "Slot 2: only 2 left → try 2. Permutation [1,3,2] found!", "note": "2 of 6 total permutations shown. Same undo-and-retry repeats at slot 0 for starting values 2 and 3 → 3! = 6 total." }
  ]
}
```

**The key:** You **undo** the choice after the recursive call returns.

**When to use:** Permutations, combinations, N-Queens, Sudoku, word search, palindrome partitioning.

> **In an interview:** trigger words are *"find all valid ... / place ... without conflict / generate every arrangement"*. State your choice, your constraint, and your undo step before coding.
> **Remember:** choose → recurse → un-choose; prune illegal branches early.

---

## Pattern 3: The Golden Rule of DFS

> **Recursion fixes WHERE you are (position). Loops explore WHAT you can do there (options).**

**Analogy:** Filling seats in a theater row by row. Recursion moves you to the next row. The loop tries each seat in the current row.

```viz
{
  "type": "table",
  "title": "Golden Rule — N-Queens: Recursion=row, Loop=column",
  "description": "4×4 board. Each recursion level = one row. Loop tries each column. Q=queen placed, .=empty, x=attacked.",
  "speed": 1000,
  "cols": ["", "col0", "col1", "col2", "col3"],
  "rows": ["row0", "row1", "row2", "row3"],
  "cells": [
    [".", ".", ".", "."],
    [".", ".", ".", "."],
    [".", ".", ".", "."],
    [".", ".", ".", "."]
  ],
  "steps": [
    {
      "cells": [["Q","x","x","x"],["x","x","x","."],["x",".",".","x"],["x",".",".","x"]],
      "active": [0, 0],
      "label": "Row 0: try col 0. Place Q at (0,0). Recurse to row 1."
    },
    {
      "cells": [["Q","x","x","x"],["x","x","Q","x"],["x","x","x","x"],["x",".",".","x"]],
      "active": [1, 2],
      "highlight": [[0,0]],
      "label": "Row 1: col 0,1 conflict. Try col 2. Place Q at (1,2). Recurse to row 2."
    },
    {
      "cells": [["Q","x","x","x"],["x","x","Q","x"],["x","Q","x","x"],["x","x","x","x"]],
      "active": [2, 1],
      "highlight": [[0,0],[1,2]],
      "label": "Row 2: only col 1 works. Place Q at (2,1). Recurse to row 3."
    },
    {
      "cells": [["Q","x","x","x"],["x","x","Q","x"],["x","Q","x","x"],["x","x","x","Q"]],
      "active": [3, 3],
      "highlight": [[0,0],[1,2],[2,1]],
      "label": "Row 3: only col 3 works. Place Q at (3,3). All 4 queens placed!",
      "note": "Solution: Q at (0,0),(1,2),(2,1),(3,3) ✓. Recursion = row (WHERE). Loop = column (WHAT)."
    }
  ]
}
```

| Problem | Recursion fixes | Loop explores |
|---------|----------------|---------------|
| N-Queens | row | column |
| Sudoku | next empty cell | digits 1-9 |
| Permutations | slot index | unused numbers |
| Subsets | array index | take / skip |

> **In an interview:** when stuck on a backtracking problem, ask out loud *"what does one level of recursion decide, and what does the loop iterate over?"* — that split unlocks the template.
> **Remember:** recursion = WHERE (position); loop = WHAT (the options there).

---

## Pattern 4: Permutations

**The idea:** At each slot, try every unused element. Mark used, recurse, then unmark.

**Analogy:** Arranging people in a photo. For the first spot, try each person. After the photo, everyone returns to the pool.

```viz
{
  "type": "recursion",
  "title": "Permutations — Swap-based approach on [1,2,3]",
  "description": "At index idx, swap idx with each position from idx to end, recurse, then swap back. Each frame shows the array state AT that call.",
  "calls": [
    { "id": "root", "label": "idx0:[1,2,3]", "x": 50, "y": 8 },
    { "id": "a", "label": "idx1:[1,2,3]", "parent": "root", "x": 25, "y": 26 },
    { "id": "b", "label": "idx2:[1,2,3]", "parent": "a", "x": 15, "y": 44 },
    { "id": "c", "label": "idx2:[1,3,2]", "parent": "a", "x": 35, "y": 44 },
    { "id": "d", "label": "idx1:[2,1,3]", "parent": "root", "x": 75, "y": 26 }
  ],
  "speed": 1000,
  "steps": [
    { "visible": ["root"], "active": "root", "label": "idx=0, array=[1,2,3]. Swap(0,0) — no-op — then recurse into idx=1." },
    { "visible": ["root","a"], "active": "a", "highlight": ["root"], "label": "idx=1, array=[1,2,3]. Swap(1,1) — no-op — recurse into idx=2." },
    { "visible": ["root","a","b"], "active": "b", "returned": { "b": "[1,2,3]" }, "highlight": ["root","a"], "label": "idx=2 == last index → base case. Record permutation [1,2,3] ✓. Return." },
    { "visible": ["root","a","b","c"], "active": "c", "returned": { "b": "[1,2,3]" }, "highlight": ["a"], "label": "Back at idx=1: swap back(1,1), then swap(1,2) → [1,3,2]. Recurse into idx=2 again." },
    { "visible": ["root","a","b","c"], "returned": { "b": "[1,2,3]", "c": "[1,3,2]" }, "highlight": ["c"], "label": "idx=2 base case → record [1,3,2] ✓. Return, swap back(1,2). idx=1's work is done." },
    { "visible": ["root","a","b","c","d"], "active": "d", "returned": { "b": "[1,2,3]", "c": "[1,3,2]" }, "highlight": ["root"], "label": "Back at idx=0: swap back(0,0), then swap(0,1) → [2,1,3]. Recurse into idx=1 with this new array.", "note": "Pattern repeats for [2,1,3] and [3,2,1] starting arrays → 3! = 6 total permutations. Swap-back after the recursive call IS the backtrack step." }
  ]
}
```

**When to use:** All permutations of array/string. For duplicates: sort first, skip same-value siblings.

> **In an interview:** trigger words are *"all orderings / arrangements"* (n! of them). If the input has duplicates, sort and skip same-value siblings to avoid repeats.
> **Remember:** fix each slot with an unused element; mark used, recurse, unmark.

---

## Pattern 5: Divide and Conquer

**The idea:** Split into independent halves, solve each, combine.

**Analogy:** Sorting a deck by splitting in half, sorting each half, then merging.

```viz
{
  "title": "Merge Sort — Divide and Conquer",
  "description": "arr=[5,2,4,1,3]. Split in half recursively, sort each half, merge back.",
  "array": [5, 2, 4, 1, 3],
  "speed": 1000,
  "steps": [
    { "pointers": {}, "highlight": [0,1,2,3,4], "label": "Split [5,2,4,1,3] → [5,2] and [4,1,3]" },
    { "pointers": {}, "highlight": [0,1], "label": "Split [5,2] → [5] and [2]. Merge → [2,5]" },
    { "pointers": {}, "highlight": [2,3,4], "label": "Split [4,1,3] → [4] and [1,3]. Merge [1,3] → [1,3]. Merge [4]+[1,3] → [1,3,4]" },
    { "pointers": { "L": 0, "R": 2 }, "highlight": [0,1,2,3,4], "label": "Merge [2,5] and [1,3,4]: compare heads, always pick smaller.", "note": "Result: [1,2,3,4,5] ✓. O(n log n). Divide=O(log n) levels, Conquer=O(n) merge each level." }
  ]
}
```

**When to use:** Merge sort, binary search, count inversions.

> **In an interview:** trigger is a problem that *splits cleanly into independent halves* with a cheap combine step. Name your split point and your merge/combine logic.
> **Remember:** solve left, solve right, combine — the combine step is where the real work is.

---

## Memoization (Recursion + Cache)

When the same subproblem appears multiple times, store the result.

**Analogy:** Calculating Fibonacci. Without memo, fib(3) is recalculated dozens of times. With a notebook, you look it up after computing once.

**Rule:** Overlapping subproblems in recursion → add a cache → that's top-down DP.

> **In an interview:** the moment you notice the same arguments recomputed (or the recursion tree branching on overlapping states), say *"I'll memoize on these parameters"* — that's the jump to DP.
> **Remember:** if the recursion revisits identical subproblems, cache by its changing parameters.

---

## Quick Reference

| Situation | Pattern |
|-----------|---------|
| Generate all subsets | Pick / No-Pick |
| Generate all permutations | Slot + unused set |
| Find valid configurations | Backtracking |
| Grid / maze path finding | DFS + Backtracking |
| Overlapping subproblems | Memoization |
| Split and combine | Divide and Conquer |

---

## Decision Flowchart

```mermaid
flowchart TD
    A([Recursion / Backtracking Problem]) --> B{Generate all\npossibilities?}
    B -->|Subsets| C[Pick / No-Pick\n2^n possibilities]
    B -->|Permutations| D[Slot + unused set\nn! possibilities]
    B -->|Combinations| E[Pick / No-Pick\nwith index forward only]
    B -->|No| F{Find valid\nconfigurations?}
    F -->|Yes| G[Backtracking\nMake choice → Recurse → Undo]
    G --> H{What is fixed\nper recursion level?}
    H -->|Row in grid| I[N-Queens / Sudoku\nRecursion = row\nLoop = column/digit]
    H -->|String index| J[Word Break / Partitioning\nRecursion = index\nLoop = substrings]
    H -->|Array index| K[Subsets / Combinations\nRecursion = index\nLoop = take/skip]
    F -->|No| L{Overlapping\nsubproblems?}
    L -->|Yes| M[Add Memoization\nTop-down DP]
    L -->|No| N{Split into\nindependent halves?}
    N -->|Yes| O[Divide and Conquer\nMerge Sort / Quick Sort]
    N -->|No| P[Pure Recursion\nBase case + smaller call]
```

---

## Problem → Pattern Cross-References

The problems list now mirrors the patterns above, deduped (the old file listed N-Queens, Sudoku, Combination Sum, and Palindrome Partitioning twice). Notes on homes and cross-topic moves:

| Problem | Home pattern | Why (and what else it touches) |
|---------|--------------|-------------------------------|
| Combination Sum I/II/III | Combinations | Pick/no-pick with an index that only moves forward |
| Letter Combinations of a Phone Number | Combinations | Cartesian product via recursion |
| N-Queens / Sudoku / Rat in a Maze | Backtracking (Grid) | Recursion fixes the row/cell, loop tries columns/digits (the Golden Rule) |
| Palindrome Partitioning / Restore IP | Backtracking (String) | Recursion fixes the cut index, loop tries substring lengths |
| Generate Parentheses | Backtracking (String) | Choice = add '(' or ')' under validity constraints — *not* a stack problem |

**Cross-topic homes:**

- **Word Break** → home is `dp.md` (overlapping subproblems → memoization). Pure recursion TLEs.
- **Implement Atoi** (a.k.a. recursive atoi) → home is `string.md` (String Conversion).
- **Pow(x, n)** → home is here (divide-and-conquer fast exponentiation). Removed the duplicate in `bits.md`.

> **The Golden Rule again:** for any configuration search, decide what each recursion level *fixes* (position) versus what the loop *explores* (options). Get that split right and N-Queens, Sudoku, and permutations all become the same template.
