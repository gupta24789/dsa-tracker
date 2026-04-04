## What is a Tree?

**Analogy:** A family tree. One ancestor at the top (root), children below, and so on. Each person (node) knows their children but not their siblings directly.

**Key definitions:**
- **Binary Tree** — each node has at most 2 children
- **Full Binary Tree** — every node has 0 or 2 children (never 1)
- **Complete Binary Tree** — all levels filled except possibly the last, filled left to right
- **Perfect Binary Tree** — all leaves at same level, every internal node has 2 children
- **BST** — left subtree values < node < right subtree values

**Node indexing (1-indexed root):**
- Left child = `2 * i`, Right child = `2 * i + 1`, Parent = `i / 2`

---

## Pattern 1: Tree Traversals

**DFS Traversals — think of when you "visit" the node:**
- **Preorder (Root → Left → Right):** Visit node first. Good for copying/serializing a tree.
- **Inorder (Left → Root → Right):** Visits BST nodes in sorted order.
- **Postorder (Left → Right → Root):** Visit node last. Good for deletion, computing subtree values.

**Analogy:** You're exploring a building.
- Preorder = note the room as you enter
- Inorder = note the room when you're done with the left wing but before the right
- Postorder = note the room only after fully exploring both wings

**BFS / Level Order:** Use a queue. Process all nodes at depth 1, then depth 2, etc.

**Morris Traversal:** Inorder/Preorder in O(1) space by temporarily modifying tree pointers.

---

## Pattern 2: Tree Properties (Height, Diameter, Balance)

**The idea:** Most tree property problems follow the same pattern — compute something for left subtree, compute for right subtree, combine at current node.

**Analogy:** You're measuring the height of a tree. You can't measure from the top — you measure each branch from the bottom up and combine.

**Template (post-order thinking):**
```
def solve(node):
    if not node: return base_value
    left = solve(node.left)
    right = solve(node.right)
    # combine left + right + current node
    return combined_result
```

**When to use:**
- Height of tree
- Diameter (longest path between any two nodes)
- Check if balanced
- Maximum path sum
- Count nodes

---

## Pattern 3: Views (Top, Bottom, Left, Right)

**The idea:** Use BFS with column/level tracking, or DFS with level tracking.

- **Left/Right View:** BFS level order — take first/last node of each level
- **Top/Bottom View:** BFS with column index — top view takes first node per column, bottom view takes last
- **Vertical Order:** Group nodes by column index

**Analogy:** You're photographing a tree from different angles. Each angle reveals different nodes.

---

## Pattern 4: Lowest Common Ancestor (LCA)

**The idea:** The LCA of two nodes p and q is the deepest node that has both as descendants.

**Analogy:** Two cousins tracing their family tree. The LCA is the most recent common ancestor — the first person who appears in both family lines.

**Algorithm:**
- If current node is null, p, or q → return current node
- Recurse left and right
- If both sides return non-null → current node is LCA
- Otherwise return whichever side is non-null

**When to use:**
- LCA in binary tree
- LCA in BST (simpler — use BST property to navigate)
- Distance between two nodes

---

## Pattern 5: BST Operations

**BST property:** Inorder traversal gives sorted order. Use this constantly.

**Search:** Go left if target < node, right if target > node. O(log n) average.

**Insert:** Find the correct null position using BST property.

**Delete:** Three cases:
1. Leaf node → just remove
2. One child → replace with child
3. Two children → replace with inorder successor (smallest in right subtree)

**Validate BST:** Pass min/max bounds down. Each node must be within its valid range.

**When to use BST patterns:**
- Kth smallest/largest → inorder traversal
- Floor/Ceil → navigate using BST property
- Two Sum in BST → inorder gives sorted array, then two pointers

---

## Pattern 6: Tree Construction

**Key rules:**
- Preorder + Inorder → unique tree (preorder gives root, inorder splits left/right)
- Postorder + Inorder → unique tree (postorder gives root from end)
- Preorder + Postorder → NOT unique

**Template (Preorder + Inorder):**
```
root = preorder[0]
mid = inorder.index(root)
root.left = build(preorder[1:mid+1], inorder[:mid])
root.right = build(preorder[mid+1:], inorder[mid+1:])
```

---

## Pattern 7: Tree DP

**The idea:** Compute a value at each node using values from its children. Classic post-order pattern.

**When to use:**
- Maximum path sum (track max path through each node)
- Diameter of tree
- Largest BST in binary tree
- Burn tree (find farthest node)

---

## Pattern 8: Serialize / Deserialize

**The idea:** Convert tree to string (preorder with null markers), reconstruct from string.

**When to use:** Store/transmit a tree, clone a tree.

---

## Quick Reference

| Situation | Pattern |
|-----------|---------|
| Visit all nodes | DFS (pre/in/post) or BFS |
| Sorted order from BST | Inorder traversal |
| Height, diameter, balance | Post-order + combine |
| Level-by-level processing | BFS with queue |
| Views (top/bottom/left/right) | BFS + column tracking |
| Deepest common ancestor | LCA algorithm |
| Build tree from traversals | Preorder/Postorder + Inorder |
| Optimize over subtrees | Tree DP |

---

## Decision Flowchart

```mermaid
flowchart TD
    A([Tree Problem]) --> B{What kind\nof tree?}
    B -->|BST| C{BST operation?}
    C -->|Search/Insert/Delete| D[Use BST property\nLeft smaller, Right larger]
    C -->|Kth smallest| E[Inorder traversal\ngives sorted order]
    C -->|Validate BST| F[Pass min/max bounds\ndown recursively]
    C -->|LCA in BST| G[Navigate using values\nboth smaller = go left\nboth larger = go right]
    B -->|Binary Tree| H{What to compute?}
    H -->|Traversal order| I{Which order?}
    I -->|Sorted / BST ops| J[Inorder\nLeft → Root → Right]
    I -->|Copy / Serialize| K[Preorder\nRoot → Left → Right]
    I -->|Delete / Subtree values| L[Postorder\nLeft → Right → Root]
    I -->|Level by level| M[BFS with Queue]
    H -->|Height / Diameter\nBalance / Path sum| N[Post-order pattern\ncompute left + right\ncombine at node]
    H -->|Views Top/Bottom\nLeft/Right| O[BFS + column tracking\nor DFS with level]
    H -->|LCA| P[If both sides return\nnon-null = current is LCA]
    H -->|Build from traversals| Q{Which pair?}
    Q -->|Preorder + Inorder| R[Preorder gives root\nInorder splits left/right]
    Q -->|Postorder + Inorder| S[Postorder last = root\nInorder splits left/right]
    H -->|Serialize/Deserialize| T[Preorder with null markers]
```
