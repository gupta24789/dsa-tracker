# Problem Solving Patterns in DSA

---

## 1. Prefix Sum + Hash Map

**Concept**
- Use cumulative sum (prefix sum) to avoid recalculating sums repeatedly  
- Combine with hash map to quickly check if a subarray with certain property exists  

**Usages**
- Subarray sum equals K  
- Longest subarray with sum = K  
- Number of subarrays with sum divisible by K  
- Detecting zero-sum subarray  

**When to Use**
- Problems asking about **subarray sums or counts** with conditions  
- When brute-force sum O(n^2) needs optimization to O(n)  

---

## 2. Sliding Window

**Concept**
- Maintain a moving window over array/string  
- Expand/shrink window to satisfy conditions  

**Usages**
- Constant Window → Max/Min/Average sum of subarray of size k  
- Dynamic Window → Longest substring without repeat, min window substring, smallest subarray ≥ K  

**When to Use**
- Problems with **contiguous subarray/substring**  
- Involves **sum, count, or frequency tracking**  

---

## 3. Two Pointers

**Concept**
- Use two indices moving in same/opposite directions to optimize search  

**Usages**
- Opposite direction → Pair sum, 3Sum, trapping rainwater, container with most water  
- Same direction → Remove duplicates, partition array, merge sorted arrays  

**When to Use**
- Array/string traversal problems  
- **Pair/triplet** problems (often sorted)  

---

## 4. Recursion + Backtracking

**Concept**
- Solve problems by breaking into smaller subproblems  
- Backtracking = exploring all possibilities with pruning  

**Usages**
- DFS in tree/graph  
- Subsets, permutations, combinations  
- N-Queens, Sudoku solver  
- Word search in grid  

**When to Use**
- Problems with **choices/paths**  
- Requires exploring **all possibilities**  

---

## 5. Stack

**Concept**
- LIFO structure, often used for parsing, monotonic order  

**Usages**
- Balanced parentheses  
- Next Greater/Smaller Element  
- Min/Max stack  
- Largest rectangle in histogram  
- DFS traversal  

**When to Use**
- Problems with **nested structure** or **reversing order**  
- Need to maintain **monotonic increasing/decreasing property**  

---

## 6. Queue

**Concept**
- FIFO structure for sequential processing  

**Usages**
- BFS traversal  
- Level-order traversal  
- Sliding window max/min (deque)  
- Task scheduling, caching  
- Producer-consumer  

**When to Use**
- Problems requiring **orderly processing**  
- BFS/shortest path in unweighted graph  

---

## 7. Trees

**Concept**
- Hierarchical structure with parent-child nodes  

**Usages**
- Traversals (inorder, preorder, postorder, level-order)  
- Lowest Common Ancestor (LCA)  
- Height, diameter, balanced tree check  
- Binary Search Tree (BST) operations  
- Segment trees / Fenwick trees for range queries  

**When to Use**
- Hierarchical data  
- Range queries, intervals  
- Problems with recursive relationships  

---

## 8. Graphs

**Concept**
- Vertices connected by edges, can be directed/undirected, weighted/unweighted  

**Usages**
- Traversal: BFS, DFS  
- Shortest path: Dijkstra, Bellman-Ford, Floyd-Warshall  
- Minimum spanning tree: Kruskal, Prim  
- Topological sort, cycle detection  
- Connected components, bipartite check  

**When to Use**
- Network, connectivity, shortest/longest path problems  
- Dependencies (topological order)  

---

## 9. Dynamic Programming (DP)

**Concept**
- Break problem into overlapping subproblems, store results to avoid recomputation  

**Types**
- 1D DP → Fibonacci, climbing stairs  
- 2D DP → Knapsack, grid paths, edit distance  
- DP on subsequences → LCS, LIS  
- DP on trees/graphs → Tree DP, DP on DAGs  

**When to Use**
- Problem has **overlapping subproblems** + **optimal substructure**  
- Usually optimization (min/max count, cost, ways)  

---

## 10. Heap / Priority Queue

**Concept**
- Binary heap supports efficient min/max retrieval  

**Usages**
- K largest/smallest elements  
- Merge K sorted lists  
- Dijkstra’s shortest path  
- Median in data stream  
- Scheduling with priority  

**When to Use**
- Problems needing **fast min/max retrieval**  
- Dynamic ordering (top-k, running median)  

---

## 11. Binary Search

**Concept**
- Divide and conquer approach on sorted data or monotonic condition  

**Usages**
- Search element in sorted array  
- First/last occurrence (lower/upper bound)  
- Search in rotated sorted array  
- Peak element  
- Binary search on answer (minimize/maximize under constraints)  

**When to Use**
- Input is **sorted** or has **monotonic property**  
- Optimization problems with **search space**  

---

## 12. Array Patterns

**Common Techniques**
- Prefix sum  
- Kadane’s algorithm (max subarray sum)  
- Sorting + two pointers  
- Hash map for frequency/count  
- Difference array (range updates)  
- Cyclic sort / index mapping  

**When to Use**
- Pure array problems (search, frequency, sum, order)  
- Optimize from O(n^2) → O(n) using clever rearrangement  

---

# Quick “When to Use What” Summary

- **Prefix Sum + Hash Map** → Subarray sum/count problems  
- **Sliding Window** → Contiguous subarray/substring with conditions  
- **Two Pointers** → Pair/triplet/searching in sorted arrays  
- **Recursion/Backtracking** → Choices, paths, generating all possibilities  
- **Stack** → Nested structure, monotonic sequences, next greater/smaller  
- **Queue** → BFS, processing in order, window max/min  
- **Trees** → Hierarchical, range queries, recursive relationships  
- **Graphs** → Connectivity, shortest/longest path, dependencies  
- **DP** → Overlapping subproblems + optimal substructure  
- **Heap/PQ** → Fast min/max retrieval, dynamic ordering  
- **Binary Search** → Sorted/monotonic condition, search space optimization  
- **Array Patterns** → Sum, frequency, rearrangement, in-place tricks  
