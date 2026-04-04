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

**When to use:** Generate all subsets, subset sum, count subsequences.

```
def solve(index, current):
    if index == n:
        process(current)
        return
    current.append(arr[index])   # pick
    solve(index + 1, current)
    current.pop()
    solve(index + 1, current)    # no pick
```

---

## Pattern 2: Backtracking

**The idea:** Explore all possibilities, but prune dead ends. Undo your choice (backtrack) before trying the next option.

**Analogy:** Solving a maze. Try a path — dead end? Go back to the last junction and try another direction.

**The key:** You **undo** the choice after the recursive call returns.

```
def backtrack(state):
    if goal_reached(state):
        result.append(copy(state))
        return
    for choice in choices:
        if is_valid(choice):
            make_choice(choice)
            backtrack(state)
            undo_choice(choice)   # backtrack
```

**When to use:** Permutations, combinations, N-Queens, Sudoku, word search, palindrome partitioning.

---

## Pattern 3: The Golden Rule of DFS

> **Recursion fixes WHERE you are (position). Loops explore WHAT you can do there (options).**

**Analogy:** Filling seats in a theater row by row. Recursion moves you to the next row. The loop tries each seat in the current row.

| Problem | Recursion fixes | Loop explores |
|---------|----------------|---------------|
| N-Queens | row | column |
| Sudoku | next empty cell | digits 1-9 |
| Permutations | slot index | unused numbers |
| Subsets | array index | take / skip |
| Word Break | string index | dictionary words |

**Red flags (wrong dimension):**
- Choosing both position and value in the loop
- Needing extra counters to force correctness
- Scanning the full array every recursion

---

## Pattern 4: Permutations

**The idea:** At each slot, try every unused element. Mark used, recurse, then unmark.

**Analogy:** Arranging people in a photo. For the first spot, try each person. After the photo, everyone returns to the pool.

**When to use:** All permutations of array/string. For duplicates: sort first, skip same-value siblings.

---

## Pattern 5: Divide and Conquer

**The idea:** Split into independent halves, solve each, combine.

**Analogy:** Sorting a deck by splitting in half, sorting each half, then merging.

**When to use:** Merge sort, binary search, count inversions.

---

## Memoization (Recursion + Cache)

When the same subproblem appears multiple times, store the result.

**Analogy:** Calculating Fibonacci. Without memo, fib(3) is recalculated dozens of times. With a notebook, you look it up after computing once.

**Rule:** Overlapping subproblems in recursion → add a cache → that's top-down DP.

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
