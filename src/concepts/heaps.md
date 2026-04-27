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
  "title": "Top K=3 Largest Elements — Min-Heap of size K",
  "description": "arr = [4, 1, 7, 3, 9, 2]. Keep a min-heap of size 3. If new element > heap min, swap it in.",
  "array": [4, 1, 7, 3, 9, 2],
  "speed": 900,
  "steps": [
    { "pointers": { "i": 0 }, "highlight": [0], "label": "Push 4. Heap: [4]. Size=1 ≤ K=3" },
    { "pointers": { "i": 1 }, "highlight": [1], "label": "Push 1. Heap: [1,4]. Size=2 ≤ K=3" },
    { "pointers": { "i": 2 }, "highlight": [2], "label": "Push 7. Heap: [1,4,7]. Size=3 = K" },
    { "pointers": { "i": 3 }, "highlight": [3], "label": "Push 3. Size>K → pop min(1). Heap: [3,4,7]. Size=3" },
    { "pointers": { "i": 4 }, "highlight": [4], "label": "Push 9. Size>K → pop min(3). Heap: [4,7,9]. Size=3" },
    { "pointers": { "i": 5 }, "highlight": [5], "label": "Push 2. Size>K → pop min(2). Heap: [4,7,9]. Size=3", "note": "Top 3 largest = [4, 7, 9] ✓" }
  ]
}
```

**Why min-heap for K largest?** Because you want to quickly identify and remove the smallest of your "kept" elements.

**When to use:**
- K largest/smallest elements
- K most frequent elements
- K closest points to origin

---

## Pattern 2: Merge K Sorted Lists / Arrays

**The idea:** Use a min-heap to always pick the smallest current element across all K lists.

**Analogy:** K sorted queues at a supermarket. You always serve the person with the fewest items across all queues.

```viz
{
  "title": "Merge K Sorted Lists — Min-Heap picks smallest head",
  "description": "3 lists: [1,4,7], [2,5,8], [3,6,9]. Heap always gives the global minimum next.",
  "array": [1, 2, 3, 4, 5, 6, 7, 8, 9],
  "speed": 900,
  "steps": [
    { "pointers": { "i": 0 }, "highlight": [0], "label": "Init heap with heads: (1,L0), (2,L1), (3,L2). Pop min=1 → output 1. Push next from L0: 4" },
    { "pointers": { "i": 1 }, "highlight": [1], "label": "Heap: (2,L1),(3,L2),(4,L0). Pop min=2 → output 2. Push next from L1: 5" },
    { "pointers": { "i": 2 }, "highlight": [2], "label": "Heap: (3,L2),(4,L0),(5,L1). Pop min=3 → output 3. Push next from L2: 6" },
    { "pointers": { "i": 3 }, "highlight": [3], "label": "Pop min=4 → output 4. Push 7 from L0." },
    { "pointers": { "i": 4 }, "highlight": [4,5,6,7,8], "label": "Continue: 5,6,7,8,9...", "note": "Result: [1,2,3,4,5,6,7,8,9] ✓ O(n log k) where k=number of lists" }
  ]
}
```

**When to use:**
- Merge K sorted lists
- K-way merge
- Find smallest range covering K lists

---

## Pattern 3: Running Median (Two Heaps)

**The idea:** Maintain two heaps — a max-heap for the lower half and a min-heap for the upper half. The median is always at the tops of these heaps.

**Analogy:** Imagine splitting a sorted list in half. The left half's maximum and the right half's minimum are always adjacent to the median.

```viz
{
  "title": "Running Median — Two Heaps",
  "description": "Stream: [5, 2, 8, 1]. MaxHeap=lower half, MinHeap=upper half. Balance sizes ±1.",
  "array": [5, 2, 8, 1],
  "speed": 1100,
  "steps": [
    { "pointers": { "i": 0 }, "highlight": [0], "label": "Insert 5 → MaxHeap:[5], MinHeap:[]. Median = 5" },
    { "pointers": { "i": 1 }, "highlight": [1], "label": "Insert 2. 2<5 → MaxHeap:[5,2]. Rebalance → move 5 to MinHeap. MaxHeap:[2], MinHeap:[5]. Median = (2+5)/2 = 3.5" },
    { "pointers": { "i": 2 }, "highlight": [2], "label": "Insert 8. 8>MinHeap top(5) → MinHeap:[5,8]. Rebalance → move 5 to MaxHeap. MaxHeap:[5,2], MinHeap:[8]. Median = 5" },
    { "pointers": { "i": 3 }, "highlight": [3], "label": "Insert 1. 1<MaxHeap top(5) → MaxHeap:[5,2,1]. Rebalance → move 5 to MinHeap. MaxHeap:[2,1], MinHeap:[5,8]. Median = (2+5)/2 = 3.5", "note": "MaxHeap top = 2, MinHeap top = 5. Median = (2+5)/2 = 3.5 ✓" }
  ]
}
```

**Balance rule:** The two heaps differ in size by at most 1.

**When to use:**
- Find median from a data stream
- Sliding window median

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
