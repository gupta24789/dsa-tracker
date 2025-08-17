## Stack and Queue

---

#### Stack

**Concept**
- **LIFO (Last In, First Out)** data structure  
- Operations: `push`, `pop`, `peek/top`, `isEmpty`  
- Think of a stack of plates: last one placed is the first one removed  

**Usages**
- Expression evaluation and parsing  
  - Balanced parentheses `()[]{}`  
  - Infix → Postfix/Prefix conversion  
  - Postfix evaluation  
- Undo/Redo operations  
- Function call stack (recursion)  
- Monotonic Stack (increasing/decreasing)  
  - Next Greater Element / Next Smaller Element  
  - Stock Span problem  
  - Largest Rectangle in Histogram  
- DFS traversal in graphs/trees  

**Patterns**
- **Simple Stack Usage**: push when condition valid, pop when invalid  
- **Monotonic Stack**: maintain increasing/decreasing order while traversing  
- **Auxiliary Stack**: sometimes a second stack is used (e.g., min stack)  

---

#### Queue

**Concept**
- **FIFO (First In, First Out)** data structure  
- Operations: `enqueue`, `dequeue`, `peek/front`, `isEmpty`  
- Think of a real-world queue (line at a store): first person in is first out  

**Types**
- **Simple Queue** → FIFO  
- **Circular Queue** → reuse space efficiently  
- **Deque (Double-ended Queue)** → insert/remove from both ends  
- **Priority Queue / Heap** → elements dequeued based on priority  

**Usages**
- Scheduling tasks (CPU scheduling, printer queue)  
- BFS (Breadth-First Search) in graphs/trees  
- Sliding Window Maximum / Minimum (using Deque)  
- Rate limiting / caching systems  
- Producer-consumer problems  
- Level order traversal of binary tree  

**Patterns**
- **BFS Traversal**: use queue to process nodes level by level  
- **Deque for Window Problems**: maintain max/min in O(n)  
- **Priority Queue (Heap)**: always fetch smallest/largest efficiently  

---

#### When to Use
- **Stack** → Problems involving **backtracking, undo, nested structures, next greater/smaller elements**  
- **Queue** → Problems involving **order of processing, BFS, sliding window, scheduling**  

---
