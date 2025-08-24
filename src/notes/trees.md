### Definition  

- **Binary Tree**: A tree where each node can have at most two children.  

- **Full Binary Tree**: A tree where every node has either **0 or 2 children**. No node has only one child.  

- **Complete Binary Tree**: A tree where all levels are fully filled except maybe the last one, which is filled **from left to right**.  

- **Perfect Binary Tree**: A tree where:  
  - All leaf nodes are at the **same level**.  
  - Every non-leaf node has **exactly 2 children**.  

- **Binary Search Tree (BST)**: A tree where each node follows this rule:  **Left < Node < Right** (values on the left are smaller, values on the right are bigger).  

<hr>

### Traversal (Ways to Visit Nodes)  

- **DFS (Depth First Search)**  

  - **InOrder**: Left → Node → Right  
  - **PreOrder**: Node → Left → Right  
  - **PostOrder**: Left → Right → Node  

- **BFS (Breadth First Search)** 

  - **Level Order**: Visit nodes level by level.  
  - **Vertical Order**: Visit nodes column by column (top to bottom).  


<hr>

### Node Indexing  

- **If root starts at index 0**  
  - Left child = `2 * i + 1`  
  - Right child = `2 * i + 2`  

- **If root starts at index 1**  
  - Left child = `2 * i`  
  - Right child = `2 * i + 1`  

<hr>

### Child Sum Property  

A **Binary Tree** follows the **Child Sum Property** if:  

- For every node, the **value of the node** = **sum of the values of its left and right children**.  
- If a child is missing, its value is treated as `0`.  

<hr>

### Construction of Binary Tree  

- **Preorder + Postorder** → No unique binary tree possible  
- **Preorder + Inorder** → Unique binary tree can be constructed  
- **Postorder + Inorder** → Unique binary tree can be constructed  


<hr>

### Complexity  

- **PreOrder**: Time = `O(n)`, Space = `O(n)`  
- **PostOrder**: Time = `O(n)`, Space = `O(n)`  
- **InOrder**: Time = `O(n)`, Space = `O(n)`  
- **LevelOrder**: Time = `O(n)`, Space = `O(n)`  
- **VerticalOrder**: Time = `O(n)`, Space = `O(n)`  
- **Morris PreOrder**: Time = `O(n)`, Space = `O(1)`  
- **Morris InOrder**: Time = `O(n)`, Space = `O(1)`  
- **BST Operations** (average case):  
  - Search: `O(log n)`  
  - Insert: `O(log n)`  
  - Delete: `O(log n)`  
  - Worst case (skewed tree): `O(n)`  

<hr>