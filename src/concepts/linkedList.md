## What is a Linked List?

Think of a **treasure hunt**. Each clue (node) tells you where the next clue is. You can't jump to clue #5 directly — you must follow the chain from the start. That's a linked list: sequential access, but cheap insertion/deletion anywhere.

**Array vs Linked List:**
- Array: random access O(1), insert/delete O(n)
- Linked List: access O(n), insert/delete O(1) if you have the pointer

---

## Pattern 1: Two Pointer (Fast & Slow — Tortoise and Hare)

**The idea:** Use two pointers moving at different speeds. The fast pointer moves 2 steps, slow moves 1.

**Analogy:** Two runners on a circular track. If there's a loop, the fast runner will eventually lap the slow one — they'll meet. If there's no loop, the fast runner reaches the end first.

**When to use:**
- Detect cycle in linked list
- Find start of cycle
- Find middle of linked list
- Find Nth node from end (fast starts N steps ahead)

**Middle of list trick:** When fast reaches end, slow is at the middle.

**Nth from end trick:** Move fast N steps ahead, then move both together. When fast hits null, slow is at the target.

---

## Pattern 2: Reversal

**The idea:** Reverse a linked list by redirecting pointers. Three variables: `prev`, `curr`, `next`.

**Analogy:** You're reversing a one-way street. At each intersection, you flip the sign to point backward, then move forward.

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

---

## Pattern 3: Merge

**The idea:** Merge two sorted lists by comparing heads and linking the smaller one.

**Analogy:** Two sorted queues at a checkout. You always pick the person with fewer items from whichever queue has them next.

**When to use:**
- Merge two sorted lists
- Merge K sorted lists (use a min-heap)
- Sort a linked list (merge sort on LL)

---

## Pattern 4: Dummy Node Trick

**The idea:** Create a fake head node before the real list. This eliminates edge cases when the head itself might be removed or changed.

**Analogy:** Put a placeholder at the front of a queue so you never have to handle "what if the queue is empty" specially.

**When to use:**
- Remove Nth node from end
- Delete nodes with a given value
- Any problem where the head might change

---

## Pattern 5: In-place Rearrangement

**The idea:** Rearrange nodes by changing `.next` pointers without creating new nodes.

**When to use:**
- Odd-even linked list
- Reorder list (first + reversed second half interleaved)
- Flatten a multilevel list
- Rotate list by K

**Key insight for Reorder List:**
1. Find middle
2. Reverse second half
3. Merge both halves alternately

---

## Pattern 6: Cycle Detection (Floyd's Algorithm)

**Detect cycle:** Fast and slow meet → cycle exists.

**Find cycle start:** After meeting, move one pointer to head. Move both one step at a time. They meet at the cycle start.

**Why it works:** The math works out — the distance from head to cycle start equals the distance from meeting point to cycle start (going forward).

---

## Pattern 7: Intersection of Two Lists

**The idea:** If two lists intersect, they share a tail. Make both pointers travel the same total distance by switching lists when they hit null.

**Analogy:** Two roads that merge into one. If you walk both roads (switching when you finish one), you'll arrive at the merge point at the same time.

---

## Doubly Linked List (DLL)

Each node has both `next` and `prev` pointers. Useful for:
- LRU Cache (O(1) insert + delete anywhere)
- Browser history (forward/back)
- Remove duplicates efficiently

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
