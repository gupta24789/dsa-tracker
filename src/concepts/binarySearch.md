## What is Binary Search?

Think of a **dictionary**. You don't read every word from page 1. You open the middle, decide "too early" or "too late", and cut the search space in half each time. That's binary search — O(log n) instead of O(n).

**The golden rule:** Binary search works whenever you can answer the question *"is the answer in the left half or the right half?"* — i.e., the search space has a **monotonic property**.

---

## Pattern 1: Classic Binary Search

**The idea:** Find a target in a sorted array by repeatedly halving the search space.

**Template:**
```
left, right = 0, n - 1
while left <= right:
    mid = left + (right - left) // 2
    if arr[mid] == target: return mid
    elif arr[mid] < target: left = mid + 1
    else: right = mid - 1
return -1
```

**When to use:** Direct search in a sorted array.

---

## Pattern 2: Lower Bound / Upper Bound

**The idea:** Find the first position where a condition becomes true.

**Analogy:** You're looking for the first seat in a row that's available. You don't check every seat — you binary search for the boundary.

- **Lower bound:** First index where `arr[i] >= target`
- **Upper bound:** First index where `arr[i] > target`

**When to use:**
- Find first/last occurrence of a number
- Count occurrences
- Floor and ceil in sorted array
- Search insert position

---

## Pattern 3: Binary Search on Rotated Array

**The idea:** A rotated sorted array still has one half that is fully sorted. Use that to decide which half to search.

**Analogy:** Imagine a clock face cut and rotated. One arc is still in order — use that to navigate.

**Key insight:** At any `mid`, one of `[left..mid]` or `[mid..right]` is always sorted. Check which one, then decide where target lies.

**When to use:**
- Search in rotated sorted array
- Find minimum in rotated sorted array
- Count rotations

---

## Pattern 4: Binary Search on Answer (Most Powerful)

**The idea:** Instead of searching for a value in an array, you binary search on the **answer space** itself.

**Analogy:** You're guessing someone's age. You know it's between 1 and 100. You guess 50 — "too high". Guess 25 — "too low". You're not searching an array, you're searching the space of possible answers.

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
- Koko eating bananas (minimize eating speed)
- Capacity to ship packages (minimize capacity)
- Aggressive cows (maximize minimum distance)
- Book allocation (minimize maximum pages)

**The trick:** Write a `canAchieve(x)` function that checks if answer `x` is feasible. If it's monotonic (once true, always true), binary search works.

---

## Pattern 5: Peak Element

**The idea:** A peak is where `arr[mid] > arr[mid+1]`. Move toward the higher neighbor — a peak always exists in that direction.

**Analogy:** You're hiking in fog. You can only see one step ahead. Always walk uphill — you'll reach a peak.

**When to use:**
- Find peak element in unsorted array
- Find peak in 2D matrix

---

## Pattern 6: Binary Search in 2D Matrix

**Two types:**

1. **Fully sorted matrix** (row-major order): Treat it as a 1D array. `row = mid // cols`, `col = mid % cols`.

2. **Row and column sorted matrix**: Start from top-right corner. Go left if too big, go down if too small.

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
