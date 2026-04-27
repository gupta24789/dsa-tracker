## Stack — Last In, First Out (LIFO)

**Analogy:** A stack of plates. You always add and remove from the top. The last plate you put on is the first one you take off.

**Core operations:** push, pop, peek — all O(1).

---

## Pattern 1: Balanced Parentheses / Nested Structure

**The idea:** Push opening brackets. When you see a closing bracket, pop and check if it matches.

**Analogy:** Every time you open a door, you push it onto a stack. When you close a door, you pop — it must match the last opened door.

```viz
{
  "title": "Balanced Parentheses — Stack push/pop",
  "description": "String: ( [ { } ] ). Push on open, pop and match on close.",
  "array": ["(", "[", "{", "}", "]", ")"],
  "speed": 900,
  "steps": [
    { "pointers": { "i": 0 }, "highlight": [0], "label": "See '(' → opening bracket, PUSH. Stack: ['(']" },
    { "pointers": { "i": 1 }, "highlight": [1], "label": "See '[' → opening bracket, PUSH. Stack: ['(','[']" },
    { "pointers": { "i": 2 }, "highlight": [2], "label": "See '{' → opening bracket, PUSH. Stack: ['(','[','{']" },
    { "pointers": { "i": 3 }, "highlight": [3], "label": "See '}' → closing, POP '{' → matches ✓. Stack: ['(','[']" },
    { "pointers": { "i": 4 }, "highlight": [4], "label": "See ']' → closing, POP '[' → matches ✓. Stack: ['(']" },
    { "pointers": { "i": 5 }, "highlight": [5], "label": "See ')' → closing, POP '(' → matches ✓. Stack: []", "note": "Stack empty at end → valid! ✓" }
  ]
}
```

**When to use:**
- Valid parentheses
- Evaluate expressions
- Decode nested strings

---

## Pattern 2: Monotonic Stack (Most Important Stack Pattern)

**The idea:** Maintain a stack that is always increasing or always decreasing. When a new element breaks the order, pop elements and process them.

**Analogy:** Imagine people standing in a line by height. A new tall person arrives — everyone shorter in front of them can now "see" the tall person. Pop them and record "next greater element = this tall person."

```viz
{
  "title": "Monotonic Stack — Next Greater Element",
  "description": "arr = [2, 1, 5, 3, 4]. For each element, find the next greater to its right. Stack stores indices.",
  "array": [2, 1, 5, 3, 4],
  "speed": 1000,
  "steps": [
    { "pointers": { "i": 0 }, "highlight": [0], "label": "i=0, val=2. Stack empty → push 0. Stack: [0]" },
    { "pointers": { "i": 1 }, "highlight": [1], "label": "i=1, val=1. 1 < arr[top]=2 → push 1. Stack: [0,1]" },
    { "pointers": { "i": 2 }, "highlight": [2], "label": "i=2, val=5. 5 > arr[1]=1 → pop 1, NGE[1]=5. 5 > arr[0]=2 → pop 0, NGE[0]=5. Push 2. Stack: [2]" },
    { "pointers": { "i": 3 }, "highlight": [3], "label": "i=3, val=3. 3 < arr[2]=5 → push 3. Stack: [2,3]" },
    { "pointers": { "i": 4 }, "highlight": [4], "label": "i=4, val=4. 4 > arr[3]=3 → pop 3, NGE[3]=4. 4 < arr[2]=5 → push 4. Stack: [2,4]", "note": "Remaining in stack → NGE = -1. Result: [5,5,-1,4,-1] ✓" }
  ]
}
```

**Two types:**
- **Monotonic Decreasing Stack** → find Next Greater Element
- **Monotonic Increasing Stack** → find Next Smaller Element

**When to use:**
- Next Greater / Next Smaller Element
- Stock span problem
- Largest rectangle in histogram
- Trapping rain water
- Sum of subarray minimums

---

## Pattern 3: Min Stack / Max Stack

**The idea:** Maintain a second stack that tracks the current minimum/maximum at every state.

**Analogy:** Keep a "scoreboard" alongside the main stack. Every time you push, also update the scoreboard with the new min/max.

```viz
{
  "title": "Min Stack — getMin() in O(1)",
  "description": "Push/pop on main stack. Auxiliary minStack always tracks current minimum at top.",
  "array": [5, 3, 7, 2, 4],
  "speed": 900,
  "steps": [
    { "pointers": { "i": 0 }, "highlight": [0], "label": "Push 5. mainStack:[5], minStack:[5]. min=5" },
    { "pointers": { "i": 1 }, "highlight": [1], "label": "Push 3. 3<5 → minStack:[5,3]. min=3" },
    { "pointers": { "i": 2 }, "highlight": [2], "label": "Push 7. 7>3 → minStack:[5,3,3]. min=3 (repeat current min)" },
    { "pointers": { "i": 3 }, "highlight": [3], "label": "Push 2. 2<3 → minStack:[5,3,3,2]. min=2" },
    { "pointers": { "i": 4 }, "highlight": [4], "label": "Push 4. 4>2 → minStack:[5,3,3,2,2]. min=2" },
    { "pointers": { "i": 3 }, "highlight": [3], "label": "Pop 4. minStack pops 2. min=minStack.top()=2", "note": "getMin() = minStack.top() always O(1) ✓" }
  ]
}
```

**When to use:**
- Design a stack that supports getMin() in O(1)

---

## Pattern 4: Stack for Expression Evaluation

**The idea:** Use a stack to evaluate postfix expressions or convert between infix/postfix/prefix.

```viz
{
  "title": "Evaluate Reverse Polish Notation (Postfix)",
  "description": "tokens = [2, 3, 4, *, +] = 2 + (3*4) = 14. Numbers push, operators pop two and push result.",
  "array": [2, 3, 4, "*", "+"],
  "speed": 1000,
  "steps": [
    { "pointers": { "i": 0 }, "highlight": [0], "label": "See 2 → push. Stack: [2]" },
    { "pointers": { "i": 1 }, "highlight": [1], "label": "See 3 → push. Stack: [2, 3]" },
    { "pointers": { "i": 2 }, "highlight": [2], "label": "See 4 → push. Stack: [2, 3, 4]" },
    { "pointers": { "i": 3 }, "highlight": [3], "label": "See '*' → pop 4 and 3, compute 3*4=12, push. Stack: [2, 12]" },
    { "pointers": { "i": 4 }, "highlight": [4], "label": "See '+' → pop 12 and 2, compute 2+12=14, push. Stack: [14]", "note": "Result = 14 ✓" }
  ]
}
```

**When to use:**
- Evaluate Reverse Polish Notation
- Expression parsing
- Calculator problems

---

## Queue — First In, First Out (FIFO)

**Analogy:** A line at a coffee shop. First person in line gets served first.

**Core operations:** enqueue (add to back), dequeue (remove from front) — O(1).

---

## Pattern 5: BFS with Queue

**The idea:** Process nodes level by level. Add neighbors to the queue, process in order.

```viz
{
  "type": "tree",
  "title": "BFS with Queue — Level Order Tree Traversal",
  "description": "Tree: root=1, children=[2,3], grandchildren=[4,5,6,7]. Queue ensures level-by-level processing.",
  "nodes": [null, 1, 2, 3, 4, 5, 6, 7],
  "speed": 900,
  "steps": [
    {
      "active": 1,
      "label": "Queue=[1]. Process 1 → enqueue children 2, 3. Level 1 done."
    },
    {
      "highlight": [1],
      "active": 2,
      "label": "Queue=[2,3]. Process 2 → enqueue 4,5. Process 3 → enqueue 6,7. Level 2 done."
    },
    {
      "highlight": [1, 2, 3],
      "active": [4, 5, 6, 7],
      "label": "Queue=[4,5,6,7]. Process all — no children. Level 3 done.",
      "note": "BFS order: [1], [2,3], [4,5,6,7] ✓. Shortest path guaranteed in unweighted graphs."
    }
  ]
}
```

**When to use:**
- Level order traversal of tree
- Shortest path in unweighted graph
- Rotten oranges, 0/1 matrix

---

## Pattern 6: Deque (Sliding Window Maximum)

**The idea:** Use a double-ended queue to maintain the maximum (or minimum) in a sliding window in O(n).

**Analogy:** A bouncer at a club who only lets in the "coolest" person. As the window slides, old people leave from the front, new people enter from the back — but anyone less cool than the newcomer gets kicked out immediately.

```viz
{
  "title": "Sliding Window Maximum — Deque (k=3)",
  "description": "arr = [1, 3, -1, -3, 5, 3]. Window size k=3. Deque stores indices of useful candidates (decreasing values).",
  "array": [1, 3, -1, -3, 5, 3],
  "speed": 1000,
  "steps": [
    { "pointers": { "i": 0 }, "highlight": [0], "label": "i=0, val=1. Deque empty → push 0. Deque:[0]. Window not full yet." },
    { "pointers": { "i": 1 }, "highlight": [0,1], "label": "i=1, val=3. 3>arr[0]=1 → pop 0 (useless). Push 1. Deque:[1]. Window not full yet." },
    { "pointers": { "i": 2 }, "highlight": [0,1,2], "label": "i=2, val=-1. -1<arr[1]=3 → push 2. Deque:[1,2]. Window full! max=arr[1]=3 ✓" },
    { "pointers": { "i": 3 }, "highlight": [1,2,3], "label": "i=3, val=-3. -3<arr[2]=-1 → push 3. Deque:[1,2,3]. Front=1 still in window. max=arr[1]=3 ✓" },
    { "pointers": { "i": 4 }, "highlight": [2,3,4], "label": "i=4, val=5. 5>all → pop 3,2,1. Push 4. Deque:[4]. max=arr[4]=5 ✓" },
    { "pointers": { "i": 5 }, "highlight": [3,4,5], "label": "i=5, val=3. 3<arr[4]=5 → push 5. Deque:[4,5]. max=arr[4]=5 ✓", "note": "Result: [3, 3, 5, 5] ✓" }
  ]
}
```

**When to use:**
- Sliding window maximum/minimum
- Any "best element in current window" problem

---

## Pattern 7: LRU Cache (Queue + HashMap)

**The idea:** Combine a doubly linked list (for O(1) remove/insert) with a hashmap (for O(1) lookup).

**Analogy:** Your browser's recently visited tabs. The most recently used tab is at the front. When you run out of space, the least recently used tab gets closed.

```viz
{
  "type": "linkedlist",
  "title": "LRU Cache (capacity=3) — get/put operations",
  "description": "DLL: most recently used at left (head), least recently used at right (tail, evicted first).",
  "nodes": [1, 2, 3],
  "speed": 1100,
  "steps": [
    {
      "nodes": [1],
      "label": "put(1). Cache: [1]. Size=1/3"
    },
    {
      "nodes": [2, 1],
      "highlight": [0],
      "label": "put(2). Cache: [2→1]. Size=2/3"
    },
    {
      "nodes": [3, 2, 1],
      "highlight": [0],
      "label": "put(3). Cache: [3→2→1]. Size=3/3 (full)"
    },
    {
      "nodes": [4, 3, 2],
      "highlight": [0],
      "label": "put(4). Cache full → evict LRU=1 (tail). Cache: [4→3→2]"
    },
    {
      "nodes": [2, 4, 3],
      "highlight": [0],
      "label": "get(2). Hit! Move 2 to head. Cache: [2→4→3]",
      "note": "HashMap gives O(1) lookup. DLL gives O(1) move-to-head and evict-from-tail ✓"
    }
  ]
}
```

**When to use:**
- LRU Cache design
- LFU Cache design

---

## Quick "When to Use What"

| Situation | Pattern |
|-----------|---------|
| Nested structure, matching brackets | Stack |
| Next greater/smaller element | Monotonic Stack |
| Largest rectangle, trapping water | Monotonic Stack |
| Get min/max in O(1) | Min/Max Stack |
| Expression evaluation | Stack |
| Level-by-level processing, BFS | Queue |
| Max/min in sliding window | Deque |
| O(1) get/put with eviction | LRU Cache |

---

## Decision Flowchart

```mermaid
flowchart TD
    A([Stack / Queue Problem]) --> B{What kind\nof processing?}
    B -->|Nested / matching\nbrackets| C[Stack\nPush open, pop on close]
    B -->|Next greater /\nsmaller element| D[Monotonic Stack\nDecreasing for NGE\nIncreasing for NSE]
    B -->|Largest rectangle\nor trapped water| E[Monotonic Stack\nhistogram pattern]
    B -->|Level-by-level\nor BFS| F[Queue\nProcess in FIFO order]
    B -->|Max/Min in\nsliding window| G[Deque\nMaintain useful candidates]
    B -->|Expression\nevaluation| H[Stack\nOperands + operators]
    B -->|Get min/max\nin O-1| I[Auxiliary Stack\ntrack min/max alongside]
    B -->|Cache with\neviction| J{Eviction policy?}
    J -->|Least Recently Used| K[LRU Cache\nDLL + HashMap]
    J -->|Least Frequently Used| L[LFU Cache\nTwo HashMaps + DLL]
    D --> M{Direction?}
    M -->|Next greater to right| N[Traverse left to right\npop when arr-i- > stack top]
    M -->|Next greater to left| O[Traverse right to left\nsame logic]
```
