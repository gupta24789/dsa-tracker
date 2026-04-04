## What is Greedy?

**Analogy:** You're at a buffet and can only carry one plate. You always pick the best-looking dish available right now, without thinking about what comes next. That's greedy — make the locally optimal choice at each step and hope it leads to a globally optimal solution.

**When greedy works:** When a locally optimal choice never needs to be reconsidered. The problem has the **greedy choice property**.

**When greedy fails:** When a local choice blocks a better global solution. Use DP instead.

**The key question:** "Can I prove that always picking the best option now leads to the best overall result?"

---

## Pattern 1: Interval Scheduling / Sorting by Endpoint

**The idea:** Sort intervals by end time. Always pick the interval that ends earliest — it leaves the most room for future intervals.

**Analogy:** You're booking meeting rooms. To fit the most meetings, always schedule the one that ends soonest. It frees up the room fastest.

**When to use:**
- Maximum number of non-overlapping intervals (Activity Selection)
- N meetings in one room
- Minimum platforms needed (sort by start, use min-heap for end times)
- Job sequencing

---

## Pattern 2: Greedy with Sorting

**The idea:** Sort by some criterion, then greedily assign/match.

**Analogy:** Assigning cookies to children. Sort both children (by greed) and cookies (by size). Give the smallest sufficient cookie to the least greedy child first.

**When to use:**
- Assign cookies
- Fractional knapsack (sort by value/weight ratio)
- Minimum coins (sort denominations descending)

---

## Pattern 3: Jump Game (Reach-Based Greedy)

**The idea:** Track the farthest index you can reach. At each step, update the max reach. If current index exceeds max reach → can't proceed.

**Analogy:** You're jumping on stepping stones. At each stone, you can jump up to a certain distance. Track the farthest stone you could possibly reach. If you're standing on a stone beyond your reach → you're stuck.

**Jump Game I:** Can you reach the end? Track `maxReach`. If `i > maxReach` → false.

**Jump Game II:** Minimum jumps. Track current jump boundary and next jump boundary. When you cross the boundary, increment jumps.

---

## Pattern 4: Greedy on Strings / Parentheses

**The idea:** Track counts of open/close brackets. Make greedy decisions about when to add/remove.

**When to use:**
- Valid parenthesis string (with wildcards)
- Minimum bracket reversals
- Remove k digits (monotonic stack + greedy)

---

## Pattern 5: Candy / Two-Pass Greedy

**The idea:** Make one left-to-right pass, then one right-to-left pass. Combine results.

**Analogy:** Distributing candy to children in a line based on ratings. First pass: give more than left neighbor if rating is higher. Second pass: give more than right neighbor if rating is higher. Take the max of both passes.

**When to use:**
- Candy distribution
- Problems where each element depends on both neighbors

---

## Greedy vs DP

| Use Greedy | Use DP |
|------------|--------|
| Local choice is always safe | Local choice might need revision |
| Provably optimal (exchange argument) | Overlapping subproblems |
| Faster (O(n log n) typically) | Slower but correct |
| Fractional knapsack | 0/1 Knapsack |
| Activity selection | Weighted job scheduling |

**Exchange argument:** To prove greedy is correct, show that swapping any greedy choice with a non-greedy one never improves the result.

---

## Quick Reference

| Situation | Pattern |
|-----------|---------|
| Max non-overlapping intervals | Sort by end time |
| Min platforms / resources | Sort + min-heap |
| Assign items to minimize waste | Sort both, match greedily |
| Can you reach the end? | Jump Game (max reach) |
| Min jumps to reach end | Jump Game II (boundary tracking) |
| Distribute with neighbor constraints | Two-pass greedy |

---

## Decision Flowchart

```mermaid
flowchart TD
    A([Greedy Problem]) --> B{Involves\nintervals?}
    B -->|Yes| C{What to optimize?}
    C -->|Max non-overlapping| D[Sort by end time\nActivity Selection]
    C -->|Min resources needed| E[Sort by start\nMin-Heap for end times]
    C -->|Merge overlapping| F[Sort by start\nMerge if overlap]
    B -->|No| G{Involves\narray traversal?}
    G -->|Reach end / jump| H{Can you reach end?}
    H -->|Check reachability| I[Jump Game I\nTrack maxReach]
    H -->|Min jumps| J[Jump Game II\nTrack current and next boundary]
    G -->|Assign items| K{Two groups\nto match?}
    K -->|Yes| L[Sort both\nGreedily match smallest sufficient]
    K -->|No| M{Neighbor\nconstraints?}
    M -->|Yes| N[Two-pass Greedy\nLeft to right then right to left]
    M -->|No| O{Can local choice\nbe proven safe?}
    O -->|Yes - exchange argument| P[Greedy works\nSort by key criterion]
    O -->|No / unsure| Q[Use DP instead\nGreedy may fail]
```
