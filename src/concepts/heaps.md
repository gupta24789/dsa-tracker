## What is a Heap?

A heap is a **priority queue** — a structure that always gives you the smallest (min-heap) or largest (max-heap) element in O(1), and inserting/removing takes O(log n).

**Analogy:** An emergency room triage system. Patients don't get seen in arrival order — the most critical patient always goes next. That's a min-heap (lowest priority number = most urgent).

**Key property:** The root is always the min (or max). It's a complete binary tree stored as an array.

- Parent of index `i` → `(i-1) / 2`
- Left child → `2*i + 1`
- Right child → `2*i + 2`

---

## Pattern 1: Top K Elements

**The idea:** To find K largest elements, use a **min-heap of size K**. When the heap exceeds K, pop the smallest. What remains are the K largest.

**Analogy:** You're a talent show judge keeping only the top 3 acts. Every time a new act performs, if they're better than your worst kept act, swap them in. Your "keep list" is always size 3.

```viz
{
  "type": "heap",
  "title": "Top K=3 Largest Elements — Min-Heap of size K",
  "description": "arr = [4, 1, 7, 3, 9, 2]. Keep a min-heap of size 3 — root is always the weakest kept element. If a new value beats the root, evict the root.",
  "speed": 900,
  "steps": [
    { "nodes": [4], "active": 0, "label": "Push 4. Heap: [4]. Size=1 ≤ K=3" },
    { "nodes": [1, 4], "active": 0, "label": "Push 1. 1 becomes root (min). Heap: [1,4]. Size=2 ≤ K=3" },
    { "nodes": [1, 4, 7], "active": 2, "label": "Push 7. Heap: [1,4,7]. Size=3 = K. Root=1." },
    { "nodes": [3, 4, 7], "active": 0, "label": "Push 3. Size>K → pop root(1), it's the weakest. Heap becomes [3,4,7]. Size=3" },
    { "nodes": [4, 9, 7], "active": 0, "label": "Push 9. Size>K → pop root(3). Heap: [4,9,7]. Size=3" },
    { "nodes": [4, 9, 7], "active": null, "highlight": [0, 1, 2], "label": "Push 2. 2 < root(4) → 2 can't beat the weakest kept element, discard it.", "note": "Top 3 largest = [4, 7, 9] ✓ (root 4 is the weakest of the three we kept)" }
  ]
}
```

**Why min-heap for K largest?** Because you want to quickly identify and remove the smallest of your "kept" elements.

**When to use:**
- K largest/smallest elements
- K most frequent elements
- K closest points to origin

> **In an interview:** trigger words are *"K largest / smallest / most frequent / closest"*. The counter-intuitive bit: use a **min**-heap for K *largest*.
> **Remember:** keep a size-K heap; the root is the weakest kept element you evict.

---

## Pattern 2: Merge K Sorted Lists / Arrays

**The idea:** Use a min-heap to always pick the smallest current element across all K lists.

**Analogy:** K sorted queues at a supermarket. You always serve the person with the fewest items across all queues.

```viz
{
  "type": "heap",
  "title": "Merge K Sorted Lists — Min-Heap picks smallest head",
  "description": "3 lists: L0=[1,4,7], L1=[2,5,8], L2=[3,6,9]. The heap holds one candidate per list — its root is always the next output.",
  "speed": 900,
  "steps": [
    { "nodes": [1, 2, 3], "active": 0, "label": "Init heap with the 3 heads: 1(L0), 2(L1), 3(L2). Root=1 → output 1. Push L0's next (4)." },
    { "nodes": [2, 4, 3], "active": 0, "label": "Heap: 2(L1),4(L0),3(L2). Root=2 → output 2. Push L1's next (5)." },
    { "nodes": [3, 4, 5], "active": 0, "label": "Heap: 3(L2),4(L0),5(L1). Root=3 → output 3. Push L2's next (6)." },
    { "nodes": [4, 6, 5], "active": 0, "label": "Heap: 4(L0),6(L2),5(L1). Root=4 → output 4. Push L0's next (7)." },
    { "nodes": [5, 6, 7], "active": 0, "label": "Heap: 5(L1),6(L2),7(L0). Root=5 → output 5. Push L1's next (8).", "note": "Output so far: [1,2,3,4,5] ✓ Continuing gives [1..9]. O(n log k) — heap size stays k, not n." }
  ]
}
```

**When to use:**
- Merge K sorted lists
- K-way merge
- Find smallest range covering K lists

> **In an interview:** trigger words are *"merge K sorted..."* or *"smallest range across K lists"*. A heap of the K current heads beats merging pairwise.
> **Remember:** heap holds one candidate per list; pop the min, push that list's next element.

---

## Pattern 3: Running Median (Two Heaps)

**The idea:** Maintain two heaps — a max-heap for the lower half and a min-heap for the upper half. The median is always at the tops of these heaps.

**Analogy:** Imagine splitting a sorted list in half. The left half's maximum and the right half's minimum are always adjacent to the median.

```viz
{
  "type": "heap",
  "title": "Running Median — Two Heaps",
  "description": "Stream: 5, 2, 8, 1. MaxHeap (lower half) root ≤ MinHeap (upper half) root, sizes balanced within 1. Median = tops of the two heaps.",
  "speed": 1100,
  "steps": [
    {
      "heaps": [
        { "label": "MaxHeap (lower)", "nodes": [5], "active": 0 },
        { "label": "MinHeap (upper)", "nodes": [] }
      ],
      "label": "Insert 5 → goes to MaxHeap (empty MinHeap). Median = 5."
    },
    {
      "heaps": [
        { "label": "MaxHeap (lower)", "nodes": [2] },
        { "label": "MinHeap (upper)", "nodes": [5], "active": 0 }
      ],
      "label": "Insert 2. 2<5 → MaxHeap:[5,2], but that's unbalanced → move root 5 to MinHeap.",
      "note": "MaxHeap root=2, MinHeap root=5. Median = (2+5)/2 = 3.5"
    },
    {
      "heaps": [
        { "label": "MaxHeap (lower)", "nodes": [5, 2], "active": 0 },
        { "label": "MinHeap (upper)", "nodes": [8] }
      ],
      "label": "Insert 8. 8 > MinHeap root(5) → MinHeap:[5,8], unbalanced → move root 5 to MaxHeap.",
      "note": "MaxHeap root=5, MinHeap root=8. Median = 5 (MaxHeap is the larger half now, its root is the median)"
    },
    {
      "heaps": [
        { "label": "MaxHeap (lower)", "nodes": [2, 1] },
        { "label": "MinHeap (upper)", "nodes": [5, 8], "active": 0 }
      ],
      "label": "Insert 1. 1 < MaxHeap root(5) → MaxHeap:[5,2,1], unbalanced → move root 5 to MinHeap.",
      "note": "MaxHeap root = 2, MinHeap root = 5. Median = (2+5)/2 = 3.5 ✓"
    }
  ]
}
```

**Balance rule:** The two heaps differ in size by at most 1.

**When to use:**
- Find median from a data stream
- Sliding window median

> **In an interview:** trigger words are *"median of a running stream"* or *"median in a sliding window"* — you need the middle as data keeps arriving.
> **Remember:** max-heap holds the smaller half, min-heap the larger; keep sizes within 1, median sits at the tops.

---

## Pattern 4: Scheduling / Task Problems

**The idea:** Use a max-heap to always process the highest-priority or most-frequent task next.

```viz
{
  "type": "table",
  "title": "Task Scheduler — Max-Heap by frequency",
  "description": "tasks=[A,A,A,B,B,C], cooldown n=2. Each time slot: pick most frequent available task. Idle if nothing available.",
  "speed": 1000,
  "cols": ["", "t=1", "t=2", "t=3", "t=4", "t=5", "t=6"],
  "rows": ["task", "A left", "B left", "C left"],
  "cells": [
    ["?", "?", "?", "?", "?", "?"],
    [3, 3, 3, 3, 3, 3],
    [2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 1]
  ],
  "steps": [
    {
      "cells": [["?","?","?","?","?","?"],[3,3,3,3,3,3],[2,2,2,2,2,2],[1,1,1,1,1,1]],
      "label": "Freq: A=3, B=2, C=1. MaxHeap picks highest freq each slot."
    },
    {
      "cells": [["A","?","?","?","?","?"],[2,2,2,2,2,2],[2,2,2,2,2,2],[1,1,1,1,1,1]],
      "active": [0,0], "highlight": [[1,0]],
      "label": "t=1: Pick A (freq=3, highest). A remaining: 3→2."
    },
    {
      "cells": [["A","B","?","?","?","?"],[2,2,2,2,2,2],[2,1,1,1,1,1],[1,1,1,1,1,1]],
      "active": [0,1], "highlight": [[2,1]],
      "label": "t=2: A on cooldown. Pick B (freq=2). B remaining: 2→1."
    },
    {
      "cells": [["A","B","C","?","?","?"],[2,2,2,2,2,2],[2,1,1,1,1,1],[1,1,0,0,0,0]],
      "active": [0,2], "highlight": [[3,2]],
      "label": "t=3: A,B on cooldown. Pick C (freq=1). C remaining: 1→0."
    },
    {
      "cells": [["A","B","C","A","?","?"],[2,2,2,1,1,1],[2,1,1,1,1,1],[1,1,0,0,0,0]],
      "active": [0,3], "highlight": [[1,3]],
      "label": "t=4: A cooldown done. Pick A (freq=2, highest). A remaining: 2→1."
    },
    {
      "cells": [["A","B","C","A","B","?"],[2,2,2,1,1,1],[2,1,1,1,0,0],[1,1,0,0,0,0]],
      "active": [0,4], "highlight": [[2,4]],
      "label": "t=5: B cooldown done. Pick B (freq=1). B remaining: 1→0."
    },
    {
      "cells": [["A","B","C","A","B","A"],[2,2,2,1,1,0],[2,1,1,1,0,0],[1,1,0,0,0,0]],
      "active": [0,5], "highlight": [[1,5]],
      "label": "t=6: A cooldown done. Pick A (freq=1). A remaining: 1→0.",
      "note": "Total time = 6. No idle slots needed ✓. Formula: max(n, (maxFreq-1)*(n+1) + countMaxFreq)"
    }
  ]
}
```

**When to use:**
- Task scheduler (minimize idle time)
- Connect ropes with minimum cost
- Reorganize string

> **In an interview:** trigger words are *"process the most frequent / most urgent next"* or *"repeatedly combine the two cheapest"*. A max- or min-heap gives the next pick in O(log n).
> **Remember:** the heap answers "what's the best choice right now?" after every update.

---

## Pattern 5: Dijkstra's Shortest Path

**The idea:** Use a min-heap to always expand the closest unvisited node.

**Analogy:** You're exploring a city. You always take the shortest road available next. A min-heap tells you which road that is.

```viz
{
  "type": "graph",
  "title": "Dijkstra's Algorithm — Shortest Path",
  "description": "Graph: 0→1(w=4), 0→2(w=1), 2→1(w=2), 1→3(w=1). Find shortest from node 0.",
  "nodes": [
    { "id": 0, "x": 10, "y": 50 },
    { "id": 1, "x": 50, "y": 20 },
    { "id": 2, "x": 50, "y": 80 },
    { "id": 3, "x": 90, "y": 50 }
  ],
  "edges": [
    { "from": 0, "to": 1, "weight": 4 },
    { "from": 0, "to": 2, "weight": 1 },
    { "from": 2, "to": 1, "weight": 2 },
    { "from": 1, "to": 3, "weight": 1 }
  ],
  "speed": 1000,
  "steps": [
    {
      "active": 0,
      "nodeLabels": { "0": "0", "1": "∞", "2": "∞", "3": "∞" },
      "label": "dist=[0,∞,∞,∞]. Pop node 0."
    },
    {
      "highlight": [1, 2],
      "highlightEdges": [[0, 1], [0, 2]],
      "nodeLabels": { "0": "0", "1": "4", "2": "1", "3": "∞" },
      "label": "Relax from 0: dist[1]=4, dist[2]=1. Pop node 2 (closest)."
    },
    {
      "active": 2,
      "highlight": [1],
      "highlightEdges": [[2, 1]],
      "nodeLabels": { "0": "0", "1": "3", "2": "1", "3": "∞" },
      "label": "Relax from 2: dist[1]=min(4, 1+2)=3. Pop node 1."
    },
    {
      "active": 1,
      "highlight": [3],
      "highlightEdges": [[1, 3]],
      "nodeLabels": { "0": "0", "1": "3", "2": "1", "3": "4" },
      "label": "Relax from 1: dist[3]=3+1=4.",
      "note": "Shortest: [0,3,1,4] ✓. Path 0→2→1→3 = 1+2+1 = 4"
    }
  ]
}
```

**When to use:**
- Shortest path in weighted graph
- Network delay time
- Path with minimum effort

> **In an interview:** trigger words are *"shortest path"* with **non-negative weights**. If weights can be negative, switch to Bellman-Ford (see graphs).
> **Remember:** always expand the closest unsettled node; the min-heap keyed on distance hands it to you.

---

## Heap vs Sorting

| Need | Use |
|------|-----|
| All K elements at once | Sort — O(n log n) |
| K elements from a stream | Heap — O(n log k) |
| Repeatedly need min/max | Heap — O(log n) per op |

---

## Quick "When to Use What"

| Situation | Pattern |
|-----------|---------|
| K largest/smallest/frequent | Min or Max Heap of size K |
| Merge K sorted sequences | Min-Heap (K-way merge) |
| Running median | Two Heaps |
| Always process highest priority | Max-Heap |
| Shortest path in weighted graph | Min-Heap (Dijkstra) |

---

## Decision Flowchart

```mermaid
flowchart TD
    A([Heap / Priority Queue Problem]) --> B{Need K\nelements?}
    B -->|K largest| C[Min-Heap of size K\npop when size exceeds K]
    B -->|K smallest| D[Max-Heap of size K\npop when size exceeds K]
    B -->|K most frequent| E[Count freq first\nthen Min-Heap of size K]
    B -->|No| F{Merging\nmultiple sequences?}
    F -->|Yes| G[Min-Heap K-way merge\npush next from same list]
    F -->|No| H{Running\nmedian?}
    H -->|Yes| I[Two Heaps\nMax-Heap left half\nMin-Heap right half\nBalance sizes]
    H -->|No| J{Shortest path\nin weighted graph?}
    J -->|Yes| K[Dijkstra\nMin-Heap on distance\nalways expand closest]
    J -->|No| L{Task scheduling\nor priority?}
    L -->|Yes| M[Max-Heap on frequency\nor priority]
    L -->|No| N{Need min/max\nrepeatedly?}
    N -->|Yes| O[Heap beats sorting\nO-log n- per operation]
    N -->|No| P[Consider sorting instead\nO-n log n- one time]
```

---

## Problem → Pattern Cross-References

The problems list mirrors the 5 patterns above. Notes on homes and cross-topic moves:

| Problem | Home pattern | Why (and what else it touches) |
|---------|--------------|-------------------------------|
| Kth largest in a stream | Top K | Min-heap of size K maintained across a stream |
| Replace elements by rank | Top K | Heap/sort to assign ranks |
| Maximum Sum Combination | Top K | Max-heap over candidate pair sums |
| Sort K sorted array | K-way Merge | Min-heap of window size k |
| Hands of Straights / Connect Ropes | Scheduling/Greedy | Greedy choice driven by a heap's min/max |

**Cross-topic homes:**

- **Top K Frequent Elements** → home is *Top K* here (moved out of `array.md` Hashing). Count frequencies, then min-heap of size K.
- **Merge K Sorted Lists** (LeetCode 23) → home is *Merge* in `linkedList.md`, since it's a linked-list problem; the heap is the tool. "Sort K sorted array" represents the K-way-merge pattern here.
- **Dijkstra** problems live in `graphs.md`, though the min-heap is the engine — see Pattern 5 above.

> **Core intuition:** reach for a heap when you need a *repeatedly-updated* min or max (streams, K-way merges, "process next best"). If you have all data up front and only need one pass, sorting is often simpler.
