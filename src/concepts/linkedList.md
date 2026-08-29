## What is a Linked List?

Think of a **treasure hunt**. Each clue (node) tells you where the next clue is. You can't jump to clue #5 directly — you must follow the chain from the start. That's a linked list: sequential access, but cheap insertion/deletion anywhere.

**Array vs Linked List:**
- Array: random access O(1), insert/delete O(n)
- Linked List: access O(n), insert/delete O(1) if you have the pointer

---

## Pattern 1: Two Pointer (Fast & Slow — Tortoise and Hare)

**The idea:** Use two pointers moving at different speeds. The fast pointer moves 2 steps, slow moves 1.

**Analogy:** Two runners on a circular track. If there's a loop, the fast runner will eventually lap the slow one — they'll meet. If there's no loop, the fast runner reaches the end first.

```viz
{
  "type": "linkedlist",
  "title": "Fast & Slow — Find Middle of Linked List",
  "description": "Nodes: 1→2→3→4→5. Slow moves 1 step, Fast moves 2. When Fast hits end, Slow is at middle.",
  "nodes": [1, 2, 3, 4, 5],
  "speed": 900,
  "steps": [
    { "pointers": { "S": 0, "F": 0 }, "label": "Start: both at head" },
    { "pointers": { "S": 1, "F": 2 }, "label": "S→node2, F→node3" },
    { "pointers": { "S": 2, "F": 4 }, "highlight": [2], "label": "S→node3, F→node5 (end)", "note": "F at end → S is at middle = node 3 ✓" }
  ]
}
```

```viz
{
  "type": "linkedlist",
  "title": "Fast & Slow — Find Nth Node from End (N=2)",
  "description": "Nodes: 1→2→3→4→5. Move Fast N steps ahead first, then move both together.",
  "nodes": [1, 2, 3, 4, 5],
  "speed": 900,
  "steps": [
    { "pointers": { "S": 0, "F": 0 }, "label": "Start: both at head" },
    { "pointers": { "S": 0, "F": 2 }, "highlight": [2], "label": "Move Fast N=2 steps ahead → node 3" },
    { "pointers": { "S": 1, "F": 3 }, "label": "Move both 1 step" },
    { "pointers": { "S": 2, "F": 4 }, "label": "Move both 1 step → S=node3, F=node5 (end)", "note": "F at end → S.next = node4 is 2nd from end ✓" }
  ]
}
```

**When to use:**
- Detect cycle in linked list
- Find start of cycle
- Find middle of linked list
- Find Nth node from end (fast starts N steps ahead)

**Middle of list trick:** When fast reaches end, slow is at the middle.

**Nth from end trick:** Move fast N steps ahead, then move both together. When fast hits null, slow is at the target.

> **In an interview:** trigger words are *"middle / Nth from end / detect a cycle / one pass, O(1) space"*. If they forbid a length pre-count, that's the hint for two speeds.
> **Remember:** fast moves 2, slow moves 1 — the gap does the work.

---

## Pattern 2: Reversal

**The idea:** Reverse a linked list by redirecting pointers. Three variables: `prev`, `curr`, `next`.

**Analogy:** You're reversing a one-way street. At each intersection, you flip the sign to point backward, then move forward.

```viz
{
  "type": "linkedlist",
  "title": "Linked List Reversal — prev / curr / next",
  "description": "List: 1→2→3→4→5. Each ← arrow is a link that has been flipped to point backward. Watch them flip left-to-right.",
  "nodes": [1, 2, 3, 4, 5],
  "speed": 1000,
  "steps": [
    { "pointers": { "curr": 0 }, "highlight": [0], "arrows": { "0": "none" }, "label": "prev=null, curr=1. Flip 1.next → null (1 is the new tail)." },
    { "pointers": { "curr": 1 }, "highlight": [1], "arrows": { "0": "back" }, "label": "prev=1, curr=2. Flip 2.next → 1. Link 1–2 now points ←." },
    { "pointers": { "curr": 2 }, "highlight": [2], "arrows": { "0": "back", "1": "back" }, "label": "prev=2, curr=3. Flip 3.next → 2. Link 2–3 now points ←." },
    { "pointers": { "curr": 3 }, "highlight": [3], "arrows": { "0": "back", "1": "back", "2": "back" }, "label": "prev=3, curr=4. Flip 4.next → 3. Link 3–4 now points ←." },
    { "pointers": { "curr": 4 }, "highlight": [4], "arrows": { "0": "back", "1": "back", "2": "back", "3": "back" }, "label": "prev=4, curr=5. Flip 5.next → 4. All links flipped.", "note": "New head = 5. Reading the ← arrows: 5→4→3→2→1 ✓" }
  ]
}
```

**Template:**
```
prev = null
curr = head
while curr:
    next = curr.next
    curr.next = prev
    prev = curr
    curr = next
return prev
```

**When to use:**
- Reverse entire list
- Reverse in groups of K
- Palindrome check (reverse second half, compare)
- Reorder list

> **In an interview:** trigger words are *"reverse the list / reverse in k-groups / palindrome list"*. Draw the three pointers before coding — this is where off-by-one bugs live.
> **Remember:** save next, flip curr.next to prev, advance both; return prev.

---

## Pattern 3: Merge

**The idea:** Merge two sorted lists by comparing heads and linking the smaller one.

**Analogy:** Two sorted queues at a checkout. You always pick the person with fewer items from whichever queue has them next.

```viz
{
  "type": "linkedlist",
  "title": "Merge Two Sorted Lists",
  "description": "List A: 1→3→5, List B: 2→4→6. Compare the two current heads (active), attach the smaller to the Merged list.",
  "speed": 900,
  "steps": [
    {
      "lists": [
        { "label": "A", "nodes": [1, 3, 5], "active": 0 },
        { "label": "B", "nodes": [2, 4, 6], "active": 0 },
        { "label": "Merged", "nodes": [] }
      ],
      "label": "Heads: A=1, B=2. 1 < 2 → take A's head."
    },
    {
      "lists": [
        { "label": "A", "nodes": [3, 5], "active": 0 },
        { "label": "B", "nodes": [2, 4, 6], "active": 0 },
        { "label": "Merged", "nodes": [1] }
      ],
      "label": "Heads: A=3, B=2. 2 < 3 → take B's head."
    },
    {
      "lists": [
        { "label": "A", "nodes": [3, 5], "active": 0 },
        { "label": "B", "nodes": [4, 6], "active": 0 },
        { "label": "Merged", "nodes": [1, 2] }
      ],
      "label": "Heads: A=3, B=4. 3 < 4 → take A's head."
    },
    {
      "lists": [
        { "label": "A", "nodes": [5], "active": 0 },
        { "label": "B", "nodes": [4, 6], "active": 0 },
        { "label": "Merged", "nodes": [1, 2, 3] }
      ],
      "label": "Heads: A=5, B=4. 4 < 5 → take B's head."
    },
    {
      "lists": [
        { "label": "A", "nodes": [5], "active": 0 },
        { "label": "B", "nodes": [6], "active": 0 },
        { "label": "Merged", "nodes": [1, 2, 3, 4] }
      ],
      "label": "Heads: A=5, B=6. 5 < 6 → take A's head."
    },
    {
      "lists": [
        { "label": "A", "nodes": [] },
        { "label": "B", "nodes": [6], "active": 0 },
        { "label": "Merged", "nodes": [1, 2, 3, 4, 5] }
      ],
      "label": "A is empty → attach all remaining B nodes (just 6).",
      "note": "Merged = 1→2→3→4→5→6 ✓. Use a dummy head so the first attach needs no special case."
    }
  ]
}
```

**When to use:**
- Merge two sorted lists
- Merge K sorted lists (use a min-heap)
- Sort a linked list (merge sort on LL)

> **In an interview:** trigger words are *"merge sorted lists"* or *"sort a linked list"* (merge sort is the O(n log n), O(1)-extra choice). Use a dummy head to simplify the wiring.
> **Remember:** always attach the smaller current head, then advance that list.

---

## Pattern 4: Dummy Node Trick

**The idea:** Create a fake head node before the real list. This eliminates edge cases when the head itself might be removed or changed.

**Analogy:** Put a placeholder at the front of a queue so you never have to handle "what if the queue is empty" specially.

```viz
{
  "type": "linkedlist",
  "title": "Dummy Node — Remove Nth Node from End (N=2)",
  "description": "List: 1→2→3→4→5. Remove 2nd from end (node 4). Dummy node prevents head-change edge cases.",
  "nodes": [0, 1, 2, 3, 4, 5],
  "speed": 1000,
  "steps": [
    { "pointers": { "i": 0 }, "highlight": [0], "label": "dummy→1→2→3→4→5. fast=slow=dummy" },
    { "pointers": { "i": 0, "F": 2 }, "highlight": [0, 2], "label": "Move fast N=2 steps ahead" },
    { "pointers": { "S": 1, "F": 3 }, "highlight": [1, 3], "label": "Move both 1 step" },
    { "pointers": { "S": 2, "F": 4 }, "highlight": [2, 4], "label": "Move both 1 step" },
    { "pointers": { "S": 3, "F": 5 }, "highlight": [3, 5], "label": "slow=node3, fast=node5 (end)", "note": "slow.next=node4 to remove ✓" }
  ]
}
```

**When to use:**
- Remove Nth node from end
- Delete nodes with a given value
- Any problem where the head might change

> **In an interview:** the tell is *"the head itself might be deleted/changed"*. Reach for a dummy node the moment deletion could touch the head — it removes the special case.
> **Remember:** dummy → head, return dummy.next; now every node has a predecessor.

---

## Pattern 5: In-place Rearrangement

**The idea:** Rearrange nodes by changing `.next` pointers without creating new nodes.

```viz
{
  "type": "linkedlist",
  "title": "Reorder List — Interleave first and reversed second half",
  "description": "List: 1→2→3→4→5. Decompose into Front (1→2→3) and reversed Back (5→4), then take one from each alternately.",
  "speed": 1000,
  "steps": [
    {
      "lists": [
        { "label": "Full", "nodes": [1, 2, 3, 4, 5], "pointers": { "mid": 2 }, "highlight": [2] }
      ],
      "label": "Step 1: find middle (fast/slow) → node 3. Split into [1,2,3] and [4,5]."
    },
    {
      "lists": [
        { "label": "Front", "nodes": [1, 2, 3], "active": 0 },
        { "label": "Back (reversed)", "nodes": [5, 4], "active": 0 }
      ],
      "label": "Step 2: reverse the back half [4,5] → [5,4]. Now merge, taking Front then Back."
    },
    {
      "lists": [
        { "label": "Front", "nodes": [2, 3], "active": 0 },
        { "label": "Back (reversed)", "nodes": [5, 4], "active": 0 },
        { "label": "Result", "nodes": [1] }
      ],
      "label": "Take Front head 1."
    },
    {
      "lists": [
        { "label": "Front", "nodes": [2, 3], "active": 0 },
        { "label": "Back (reversed)", "nodes": [4], "active": 0 },
        { "label": "Result", "nodes": [1, 5] }
      ],
      "label": "Take Back head 5."
    },
    {
      "lists": [
        { "label": "Front", "nodes": [3], "active": 0 },
        { "label": "Back (reversed)", "nodes": [4], "active": 0 },
        { "label": "Result", "nodes": [1, 5, 2] }
      ],
      "label": "Take Front head 2."
    },
    {
      "lists": [
        { "label": "Front", "nodes": [3], "active": 0 },
        { "label": "Back (reversed)", "nodes": [] },
        { "label": "Result", "nodes": [1, 5, 2, 4] }
      ],
      "label": "Take Back head 4. Back is now empty."
    },
    {
      "lists": [
        { "label": "Front", "nodes": [] },
        { "label": "Back (reversed)", "nodes": [] },
        { "label": "Result", "nodes": [1, 5, 2, 4, 3] }
      ],
      "label": "Take Front head 3. Both halves empty.",
      "note": "Result: 1→5→2→4→3 ✓. Reorder = find-mid + reverse-second-half + alternate-merge."
    }
  ]
}
```

**When to use:**
- Odd-even linked list
- Reorder list (first + reversed second half interleaved)
- Flatten a multilevel list
- Rotate list by K

> **In an interview:** trigger words are *"reorder / rotate / regroup, in place, no extra list"*. These usually decompose into find-mid + reverse + merge — say that decomposition aloud.
> **Remember:** rewire `.next` pointers; never allocate new nodes.

---

## Pattern 6: Cycle Detection (Floyd's Algorithm)

**Detect cycle:** Fast and slow meet → cycle exists.

```viz
{
  "type": "linkedlist",
  "title": "Floyd's Cycle Detection — Fast & Slow meet inside cycle",
  "description": "List: 1→2→3→4→5→3 (cycle back to node3). Fast moves 2, slow moves 1.",
  "nodes": [1, 2, 3, 4, 5],
  "cycleBack": 2,
  "speed": 900,
  "steps": [
    { "pointers": { "S": 0, "F": 0 }, "label": "Start: both at node1" },
    { "pointers": { "S": 1, "F": 2 }, "highlight": [1, 2], "label": "S→node2, F→node3" },
    { "pointers": { "S": 2, "F": 4 }, "highlight": [2, 4], "label": "S→node3, F→node5" },
    { "pointers": { "S": 3, "F": 2 }, "highlight": [2, 3], "label": "S→node4, F→node3 (cycle: 5→3)" },
    { "pointers": { "S": 4, "F": 4 }, "highlight": [4], "label": "S=F=node5. MEET! Cycle detected ✓", "note": "Reset one to head, move both 1 step → meet at cycle start" }
  ]
}
```

**Find cycle start:** After meeting, move one pointer to head. Move both one step at a time. They meet at the cycle start.

**Why it works:** The math works out — the distance from head to cycle start equals the distance from meeting point to cycle start.

> **In an interview:** trigger words are *"is there a loop / where does the loop start / loop length"* with an O(1)-space constraint (a hash set is the easy O(n)-space fallback to mention).
> **Remember:** meet inside the cycle, then reset one pointer to head; they re-meet at the entrance.

---

## Pattern 7: Intersection of Two Lists

**The idea:** If two lists intersect, they share a tail. Make both pointers travel the same total distance by switching lists when they hit null.

**Analogy:** Two roads that merge into one. If you walk both roads (switching when you finish one), you'll arrive at the merge point at the same time.

```viz
{
  "type": "linkedlist",
  "title": "Intersection of Two Lists",
  "description": "List A: 1→3→5→7→9 (len 5), List B: 2→7→9 (len 3). The tail 7→9 is shared. pA walks A then B; pB walks B then A — both cover lenA+lenB and align at the join.",
  "speed": 1000,
  "steps": [
    {
      "lists": [
        { "label": "A", "nodes": [1, 3, 5, 7, 9], "pointers": { "pA": 0 }, "highlight": [3, 4] },
        { "label": "B", "nodes": [2, 7, 9], "pointers": { "pB": 0 }, "highlight": [1, 2] }
      ],
      "label": "Start: pA=A[0]=1, pB=B[0]=2. Highlighted tail (7→9) is the shared segment. Advance both."
    },
    {
      "lists": [
        { "label": "A", "nodes": [1, 3, 5, 7, 9], "pointers": { "pA": 3 }, "highlight": [3, 4] },
        { "label": "B", "nodes": [2, 7, 9], "pointers": { "pB": 1 }, "highlight": [1, 2] }
      ],
      "label": "pA reached the join at A[3]=7; pB reached B[1]=7 — same physical node.",
      "note": "Intersection = node 7 ✓. Switching each pointer to the other head at the end equalizes distance (lenA+lenB), so they meet at the join."
    }
  ]
}
```

> **In an interview:** trigger words are *"where do two lists merge / find the common node"*. Compare by node identity, not by value.
> **Remember:** switch each pointer to the other list's head at the end; they align after lenA+lenB steps.

---

## Doubly Linked List (DLL)

Each node has both `next` and `prev` pointers. Useful for:
- LRU Cache (O(1) insert + delete anywhere)
- Browser history (forward/back)
- Remove duplicates efficiently

**The idea (LRU Cache):** Combine a doubly linked list (for O(1) remove/insert) with a hashmap (for O(1) lookup). Most recently used sits at the head; least recently used sits at the tail and gets evicted first.

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

> **In an interview:** trigger words are *"O(1) get and put with eviction"*. The insight the interviewer wants: hash map for lookup + doubly linked list for ordering.
> **Remember:** map finds the node in O(1); the DLL moves it to the front / evicts the tail in O(1).

---

## Quick "When to Use What"

| Situation | Pattern |
|-----------|---------|
| Detect/find cycle | Fast & Slow pointers |
| Find middle, Nth from end | Fast & Slow pointers |
| Reverse list or part of it | Reversal (prev/curr/next) |
| Merge sorted lists | Merge pattern |
| Head might change | Dummy node |
| Interleave, rotate, flatten | In-place rearrangement |
| O(1) get/put with eviction | LRU Cache (DLL + HashMap) |
| Two lists meet | Intersection trick |
| O(1) delete anywhere | Doubly Linked List |

---

## Decision Flowchart

```mermaid
flowchart TD
    A([Linked List Problem]) --> B{Involves\ncycle?}
    B -->|Yes| C[Fast & Slow Pointers\nTortoise & Hare]
    C --> D{Find cycle\nstart?}
    D -->|Yes| E[After meeting:\nreset one to head\nmove both 1 step]
    B -->|No| F{Find middle\nor Nth from end?}
    F -->|Yes| G[Fast & Slow Pointers\nfast=N steps ahead for Nth]
    F -->|No| H{Reverse\nrequired?}
    H -->|Yes| I{Reverse whole\nor part?}
    I -->|Whole| J[prev/curr/next\niterative reversal]
    I -->|K groups| K[Reverse in groups\nrecursive or iterative]
    H -->|No| L{Two lists\ninvolved?}
    L -->|Merge sorted| M[Merge Pattern\nalways pick smaller head]
    L -->|Intersection| N[Switch lists at end\nboth travel same distance]
    L -->|No| O{Head might\nchange?}
    O -->|Yes| P[Use Dummy Node]
    O -->|No| Q{Rearrange\nnodes?}
    Q -->|Yes| R[Find mid → Reverse half\n→ Merge alternately]
    Q -->|No| S[Single pass\nwith pointer tricks]
```

---

## Problem → Pattern Cross-References

The problems list now mirrors the 7 patterns above (plus DLL and a Design section). Each problem has one home. Notes on the connections:

| Problem | Home pattern | Why (and what else it touches) |
|---------|--------------|-------------------------------|
| Palindrome Linked List | Reversal | Find mid (fast/slow), reverse second half, compare — touches Fast & Slow too |
| Reorder List | In-place Rearrangement | Find mid → reverse half → merge alternately (combines 3 patterns) |
| Sort LL | Merge | Merge sort on a linked list |
| Reverse Nodes in K-Group | Reversal | Iterative reversal applied per k-block |
| Remove Nth Node From End | Dummy Node & Deletion | Fast starts N ahead (Fast & Slow), dummy handles head removal |
| Delete the middle node | Fast & Slow | Slow lands on middle; dummy/prev handles the unlink |

**Design section (HashMap + DLL):**

- **LRU Cache** and **LFU Cache** live here, not in Stack/Queue. Their mechanism is a hash map for O(1) lookup plus a **doubly linked list** for O(1) move/evict — which is exactly the DLL use-case called out above. Keeping the pair together makes the shared technique obvious. (Moved out of `stackAndQueue.md`.)

> **The recurring insight:** most "hard" linked-list problems are just **compositions** of the basic patterns — find-mid + reverse + merge. Master the six primitives and the hards fall out.
