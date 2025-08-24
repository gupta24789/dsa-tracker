## Sliding Window and Two Pointers

---

#### Sliding Window

**Usages**
- Optimizing subarray/subsequence problems
- Finding maximum/minimum/average values in subarrays
- Tracking frequency/count of elements in a window
- String/substring problems (longest substring without repeating characters, anagrams, etc.)
- Useful when dealing with **contiguous** elements

**Pattern**
- **Constant Window**  
  - Window size is fixed  
  - Example:  
    - Maximum sum of subarray of size `k`  
    - Average of subarray of size `k`  
    - Number of subarrays of size `k` with some property  

- **Dynamic Window**  
  - Window size changes depending on constraints  
  - Example:  
    - Longest subarray with sum ≤ K  
    - Smallest subarray with sum ≥ K  
    - Longest substring without repeating characters  
    - Minimum window substring  

**Steps**
1. Initialize left and right pointers  
2. Expand right pointer to include new elements  
3. Shrink left pointer when condition breaks  
4. Update result whenever condition is satisfied  

---

#### Two Pointer Pattern

**Usages**
- Usually requires **sorted arrays** (but not always for opposite direction moves)  
- Works for both positive and negative numbers  
- Often used for problems involving **pairs/triplets**  
- Reduces time complexity from `O(n^2)` to `O(n)` in many cases  

**Pattern**
- **Opposite Direction Pointers**  
  - Start from both ends and move inward  
  - Example:  
    - Pair sum in a sorted array  
    - 3Sum / 4Sum problem  
    - Trapping rainwater  
    - Container with most water  

- **Same Direction Pointers**  
  - Both pointers move forward  
  - Example:  
    - Removing duplicates from sorted array  
    - Partitioning array (Dutch National Flag problem)  
    - Merging two sorted arrays  

**Steps**
1. Sort array if not already sorted (if required)  
2. Initialize two pointers (left, right)  
3. Move pointers based on condition:  
   - If sum is too large → move right pointer left  
   - If sum is too small → move left pointer right  
4. Record or return result  

---

#### When to Use
- **Sliding Window** → Best for **contiguous subarray/substring** problems  
- **Two Pointers** → Best for **pair/triplet** or **searching within sorted arrays** problems  

---