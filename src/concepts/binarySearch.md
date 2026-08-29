## What is Binary Search?

Think of a **dictionary**. You don't read every word from page 1. You open the middle, decide "too early" or "too late", and cut the search space in half each time. That's binary search — O(log n) instead of O(n).

```
  Linear search O(n):          Binary search O(log n):
  target = 7                   target = 7

  [1][2][3][4][5][6][7][8]     [1][2][3][4][5][6][7][8]
   ↑ no                         L               R
      ↑ no                          mid=4 → 4<7, go right
         ↑ no                               L       R
            ↑ no                               mid=6 → 6<7
               ↑ no                                  LR
                  ↑ no                               mid=7 ✓
                     ↑ yes!
  6 comparisons                3 comparisons
```

**The golden rule:** Binary search works whenever you can answer the question *"is the answer in the left half or the right half?"* — i.e., the search space has a **monotonic property**.

---

## Pattern 1: Classic Binary Search

**The idea:** Find a target in a sorted array by repeatedly halving the search space.

```viz
{
  "title": "Classic Binary Search — find target = 11",
  "description": "arr = [1, 3, 5, 7, 9, 11, 13]. Lifted cells = current search space [L..R]; M marks the probe. Watch it halve.",
  "array": [1, 3, 5, 7, 9, 11, 13],
  "speed": 900,
  "steps": [
    { "pointers": { "L": 0, "R": 6, "M": 3 }, "highlight": [0,1,2,3,4,5,6], "label": "Search space = whole array. mid=(0+6)/2=3, arr[3]=7 < 11 → discard left half + mid, L=4." },
    { "pointers": { "L": 4, "R": 6, "M": 5 }, "highlight": [4,5,6], "label": "Space halved to [4..6]. mid=(4+6)/2=5, arr[5]=11 == target ✓", "note": "Found at index 5 in 2 probes (vs 6 for linear). Each probe throws away half the space." }
  ]
}
```

**Template:**
```
left, right = 0, n - 1
while left <= right:
    mid = left + (right - left) // 2   # avoids overflow
    if arr[mid] == target: return mid
    elif arr[mid] < target: left = mid + 1
    else: right = mid - 1
return -1
```

**When to use:** Direct search in a sorted array.

> **In an interview:** trigger words are *"sorted array"* + *"find / exists"*. If the array isn't sorted, ask whether you may sort it, or whether a monotonic condition exists (then it's BS-on-answer).
> **Remember:** use `left + (right-left)//2` to avoid overflow, and be deliberate about `<=` vs `<`.

---

## Pattern 2: Lower Bound / Upper Bound

**The idea:** Find the first position where a condition becomes true.

**Analogy:** You're looking for the first seat in a row that's available. You don't check every seat — you binary search for the boundary.

```viz
{
  "title": "Lower Bound — first index where arr[i] >= 3",
  "description": "arr = [1, 3, 3, 3, 5, 7], target = 3. Lifted cells = search space [L..R]. On a match, don't stop — go LEFT to find the earliest.",
  "array": [1, 3, 3, 3, 5, 7],
  "speed": 1000,
  "steps": [
    { "pointers": { "L": 0, "R": 5, "M": 2 }, "highlight": [0,1,2,3,4,5], "label": "mid=2, arr[2]=3 >= 3 → candidate. Keep mid, search LEFT: R=M=2." },
    { "pointers": { "L": 0, "R": 2, "M": 1 }, "highlight": [0,1,2], "label": "mid=1, arr[1]=3 >= 3 → candidate. Search LEFT: R=M=1." },
    { "pointers": { "L": 0, "R": 1, "M": 0 }, "highlight": [0,1], "label": "mid=0, arr[0]=1 < 3 → too small. Go RIGHT: L=M+1=1." },
    { "pointers": { "L": 1, "R": 1 }, "highlight": [1], "label": "L == R → boundary found.", "note": "Lower bound = 1 (first 3). Count of 3s = upperBound(4) − lowerBound(1) = 3 ✓" }
  ]
}
```

- **Lower bound:** First index where `arr[i] >= target`
- **Upper bound:** First index where `arr[i] > target`

**When to use:**
- Find first/last occurrence of a number
- Count occurrences
- Floor and ceil in sorted array
- Search insert position

> **In an interview:** trigger words are *"first / last occurrence, count of, floor / ceil, insert position"*. Count of x = upperBound(x) − lowerBound(x).
> **Remember:** on a candidate match, don't stop — record it and keep going left (lower) or right (upper) to find the boundary.

---

## Pattern 3: Binary Search on Rotated Array

**The idea:** A rotated sorted array still has one half that is fully sorted. Use that to decide which half to search.

**Analogy:** Imagine a clock face cut and rotated. One arc is still in order — use that to navigate.

```viz
{
  "title": "Rotated Array Binary Search — find target = 4",
  "description": "arr = [6, 7, 9, 1, 2, 4, 5]. One half is always sorted — use it to decide where target lies.",
  "array": [6, 7, 9, 1, 2, 4, 5],
  "speed": 1100,
  "steps": [
    { "pointers": { "L": 0, "R": 6 }, "label": "Start: L=0, R=6. mid=3" },
    { "pointers": { "L": 0, "R": 6, "M": 3 }, "highlight": [3], "label": "arr[M]=1. Left half [6,7,9,1] — is arr[L]=6 <= arr[M]=1? No → RIGHT half [1,2,4,5] is sorted" },
    { "pointers": { "L": 0, "R": 6, "M": 3 }, "highlight": [3,4,5,6], "label": "Right half sorted [1,2,4,5]. Is target(4) in [1..5]? Yes → go RIGHT: L=M+1=4" },
    { "pointers": { "L": 4, "R": 6, "M": 5 }, "highlight": [5], "label": "arr[M]=4 == target ✓", "note": "Found at index 5!" }
  ]
}
```

**Key insight:** At any `mid`, one of `[left..mid]` or `[mid..right]` is always sorted. Check which one, then decide where target lies.

**When to use:**
- Search in rotated sorted array
- Find minimum in rotated sorted array
- Count rotations

> **In an interview:** trigger words are *"sorted but rotated"*. Ask if duplicates are allowed — they degrade the worst case to O(n) and need the shrink-both-ends tweak.
> **Remember:** identify which half is sorted first, then decide if the target lies inside it.

---

## Pattern 4: Binary Search on Answer (Most Powerful)

**The idea:** Instead of searching for a value in an array, you binary search on the **answer space** itself.

**Analogy:** You're guessing someone's age. You know it's between 1 and 100. You guess 50 — "too high". Guess 25 — "too low". You're not searching an array, you're searching the space of possible answers.

```viz
{
  "title": "BS on Answer — Koko Eating Bananas",
  "description": "piles=[3,6,7,11], h=8. Search the ANSWER space of speeds 1..11 (index = speed−1). Lifted cells = speeds still in play.",
  "array": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  "speed": 1000,
  "steps": [
    { "pointers": { "L": 0, "R": 10, "M": 5 }, "highlight": [0,1,2,3,4,5,6,7,8,9,10], "label": "Try speed=6: hours = 1+1+2+2 = 6 ≤ 8 → feasible. Try slower: R=M=5." },
    { "pointers": { "L": 0, "R": 5, "M": 2 }, "highlight": [0,1,2,3,4,5], "label": "Try speed=3: hours = 1+2+3+4 = 10 > 8 → too slow. Go faster: L=M+1=3." },
    { "pointers": { "L": 3, "R": 5, "M": 4 }, "highlight": [3,4,5], "label": "Try speed=5: hours = 1+2+2+3 = 8 ≤ 8 → feasible. Try slower: R=M=4." },
    { "pointers": { "L": 3, "R": 4, "M": 3 }, "highlight": [3,4], "label": "Try speed=4: hours = 1+2+2+3 = 8 ≤ 8 → feasible. Try slower: R=M=3." },
    { "pointers": { "L": 3, "R": 3 }, "highlight": [3], "label": "L == R → boundary found.", "note": "Minimum speed = 4 ✓. You never touched the piles array — you searched the space of answers using a monotonic feasibility test." }
  ]
}
```

**Template:**
```
left, right = min_possible_answer, max_possible_answer
while left < right:
    mid = (left + right) // 2
    if canAchieve(mid):
        right = mid        # try smaller
    else:
        left = mid + 1     # need bigger
return left
```

**When to use:**
- "Minimize the maximum" or "Maximize the minimum" problems
- Koko eating bananas, Capacity to ship packages
- Aggressive cows, Book allocation

**The trick:** Write a `canAchieve(x)` function that checks if answer `x` is feasible. If it's monotonic (once true, always true), binary search works.

> **In an interview:** trigger words are *"minimize the maximum"* / *"maximize the minimum"* / *"smallest capacity/speed/limit such that ..."*. State your search range [lo, hi] and the `feasible(x)` check out loud before coding.
> **Remember:** you're not searching the array — you're binary-searching the answer, using a monotonic feasibility test.

---

## Pattern 5: Peak Element

**The idea:** A peak is where `arr[mid] > arr[mid+1]`. Move toward the higher neighbor — a peak always exists in that direction.

**Analogy:** You're hiking in fog. You can only see one step ahead. Always walk uphill — you'll reach a peak.

```viz
{
  "title": "Peak Element — always walk uphill",
  "description": "arr = [1, 3, 5, 4, 2]. A peak is where arr[i] > arr[i+1]. Move toward the higher side.",
  "array": [1, 3, 5, 4, 2],
  "speed": 1000,
  "steps": [
    { "pointers": { "L": 0, "R": 4 }, "label": "Start: L=0, R=4. mid=2" },
    { "pointers": { "L": 0, "R": 4, "M": 2 }, "highlight": [2, 3], "label": "arr[M]=5 > arr[M+1]=4 → peak is at M or LEFT. R=M=2" },
    { "pointers": { "L": 0, "R": 2, "M": 1 }, "highlight": [1, 2], "label": "arr[M]=3 < arr[M+1]=5 → peak is to the RIGHT. L=M+1=2" },
    { "pointers": { "L": 2, "R": 2 }, "highlight": [2], "label": "L == R → done", "note": "Peak at index 2, value=5 ✓" }
  ]
}
```

**When to use:**
- Find peak element in unsorted array
- Find peak in 2D matrix

> **In an interview:** trigger words are *"find any peak / local maximum"* in O(log n) on an **unsorted** array — the surprise is that binary search applies without sorting.
> **Remember:** always step toward the higher neighbor; a peak must exist that way.

---

## Pattern 6: Binary Search in 2D Matrix

**Two types:**

```viz
{
  "title": "2D Matrix Binary Search — Fully Sorted (row-major)",
  "description": "matrix = [[1,3,5],[7,9,11],[13,15,17]], target=9. Treat as 1D: row=mid//cols, col=mid%cols.",
  "array": [1, 3, 5, 7, 9, 11, 13, 15, 17],
  "speed": 1000,
  "steps": [
    { "pointers": { "L": 0, "R": 8 }, "label": "L=0, R=8 (9 elements). mid=4" },
    { "pointers": { "L": 0, "R": 8, "M": 4 }, "highlight": [4], "label": "mid=4 → row=4//3=1, col=4%3=1 → matrix[1][1]=9 == target ✓", "note": "Found at row=1, col=1 ✓. O(log(m*n))" }
  ]
}
```

1. **Fully sorted matrix** (row-major order): Treat it as a 1D array. `row = mid // cols`, `col = mid % cols`.

2. **Row and column sorted matrix**: Start from top-right corner. Go left if too big, go down if too small.

> **In an interview:** first clarify which kind of sorted matrix it is — fully row-major sorted (treat as 1D binary search) vs only row-and-column sorted (top-right staircase walk). They need different approaches.
> **Remember:** fully sorted → `row = mid // cols, col = mid % cols`; row+col sorted → start top-right, go left/down.

---

## Common Mistakes

- Using `(left + right) / 2` — can overflow. Use `left + (right - left) / 2`.
- Off-by-one errors: know when to use `left <= right` vs `left < right`.
- Forgetting to check which half is sorted in rotated array problems.

---

## Quick "When to Use What"

| Situation | Pattern |
|-----------|---------|
| Find value in sorted array | Classic BS |
| First/last occurrence, floor/ceil | Lower/Upper Bound |
| Search in rotated array | Rotated Array BS |
| Minimize/maximize under constraints | BS on Answer |
| Find local peak | Peak Element BS |
| Search in 2D grid | 2D BS |

---

## Decision Flowchart

```mermaid
flowchart TD
    A([Binary Search Problem]) --> B{Is input\nsorted?}
    B -->|Yes| C{What are\nyou searching?}
    B -->|No| D{Monotonic\ncondition exists?}
    D -->|Yes| E[Binary Search\non Answer Space]
    D -->|No| F[Not a BS problem]
    C -->|Exact value| G{Array rotated?}
    G -->|No| H[Classic Binary Search]
    G -->|Yes| I[Rotated Array BS\nfind sorted half first]
    C -->|First/Last position\nFloor/Ceil| J[Lower / Upper Bound]
    C -->|Peak element| K[Peak Element BS\nmove toward higher neighbor]
    C -->|In 2D matrix| L{Fully sorted\nrow-major?}
    L -->|Yes| M[Treat as 1D array\nmid = row*cols + col]
    L -->|No| N[Start top-right\ngo left if too big\ngo down if too small]
    E --> O{Minimize or\nMaximize?}
    O -->|Minimize max| P[Binary search answer\ncheck if feasible\nright = mid if yes]
    O -->|Maximize min| Q[Binary search answer\ncheck if feasible\nleft = mid+1 if no]
```

---

## Problem → Pattern Cross-References

Every problem in the binary-search list lives under exactly one pattern (its interview-default framing). Notes on the ones whose home isn't obvious:

| Problem | Home pattern | Why (and what else it touches) |
|---------|--------------|-------------------------------|
| Single element in a Sorted Array | Rotated Array BS | Uses index parity as the monotonic property (same "which half" reasoning) |
| Kth Missing Positive Number | Binary Search on Answer | Search on the count-of-missing function, which is monotonic |
| Median of 2 sorted arrays | Advanced BS | Binary search on the partition point, not on a value |
| Aggressive Cows / Book Allocation / Painter's / Split Array | Binary Search on Answer | All are "maximize the minimum" or "minimize the maximum" with a `feasible(x)` check |
| Find Peak Element (2D) | 2D BS | Binary search on columns, find max in the mid column |

**Pulled in from the Array list (its true home):**

- **Search a 2D Matrix** (LeetCode 74) → lives here under *2D Binary Search*. A fully row-major-sorted matrix is just a 1D sorted array: `row = mid // cols`, `col = mid % cols`. (The row-and-column-sorted variant, LeetCode 240, is the top-right staircase walk and also lives here.)

> **The unifying idea:** every pattern above is the same question — *"can I discard half the search space?"* Classic/boundary/rotated search a **value space**; Binary Search on Answer searches a **feasibility space**. If you can write a monotonic `check(x)`, it's a BS-on-answer problem even when no array is sorted.
