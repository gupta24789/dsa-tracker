## What is a Graph?

**Analogy:** A map of cities connected by roads. Cities are nodes (vertices), roads are edges. Some roads are one-way (directed), some have tolls (weighted).

**Types:**
- **Undirected** — edges go both ways (friendship)
- **Directed (Digraph)** — edges have direction (Twitter follow)
- **Weighted** — edges have costs (road distances)
- **DAG** — Directed Acyclic Graph (no cycles, like task dependencies)

**Representations:**
- **Adjacency List** — `graph[u] = [v1, v2, ...]` — space efficient, preferred
- **Adjacency Matrix** — `matrix[u][v] = 1` — fast edge lookup, expensive space

---

## Pattern 1: BFS (Breadth-First Search)

**The idea:** Explore level by level using a queue. Guarantees shortest path in unweighted graphs.

**Analogy:** Ripples in a pond. Drop a stone — ripples spread outward one ring at a time. BFS explores all nodes at distance 1, then distance 2, etc.

**Template:**
```
queue = deque([start])
visited = {start}
while queue:
    node = queue.popleft()
    for neighbor in graph[node]:
        if neighbor not in visited:
            visited.add(neighbor)
            queue.append(neighbor)
```

**When to use:**
- Shortest path in unweighted graph
- Level-order traversal
- Rotten oranges, 0/1 matrix, word ladder

---

## Pattern 2: DFS (Depth-First Search)

**The idea:** Go as deep as possible before backtracking. Uses recursion or an explicit stack.

**Analogy:** Exploring a cave system. You pick one tunnel and go as far as you can. When you hit a dead end, you backtrack and try the next tunnel.

**When to use:**
- Connected components
- Cycle detection
- Topological sort
- Flood fill, number of islands
- Path finding

---

## Pattern 3: Cycle Detection

**Undirected graph:** During DFS, if you visit a neighbor that's already visited and it's not your parent → cycle.

**Directed graph:** Track nodes in the current DFS path (recursion stack). If you visit a node already in the stack → cycle.

**Analogy (directed):** You're following a chain of instructions. If an instruction leads back to one you're currently executing → infinite loop (cycle).

---

## Pattern 4: Topological Sort

**The idea:** Order tasks so that all dependencies come before the task itself. Only works on DAGs.

**Two approaches:**
- **DFS-based:** Post-order DFS, push to stack when done. Reverse the stack.
- **Kahn's Algorithm (BFS):** Start with nodes that have no incoming edges (in-degree 0). Process them, reduce neighbors' in-degree, add new zero-in-degree nodes to queue.

**Analogy:** Getting dressed. You must put on socks before shoes, underwear before pants. Topological sort gives you a valid order.

**When to use:**
- Course schedule (detect cycle + order)
- Build systems, task dependencies
- Alien dictionary

---

## Pattern 5: Shortest Path

**Unweighted graph → BFS** (each edge has weight 1)

**Weighted graph with non-negative weights → Dijkstra's**
- Use a min-heap. Always expand the closest unvisited node.
- **Analogy:** GPS navigation. Always take the shortest available road next.

**Weighted graph with negative weights → Bellman-Ford**
- Relax all edges V-1 times. Detect negative cycles on the Vth pass.
- **Analogy:** A market where some trades lose money. Bellman-Ford finds the cheapest route even with losses.

**All pairs shortest path → Floyd-Warshall**
- DP: `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])` for all k.

---

## Pattern 6: Minimum Spanning Tree (MST)

**The idea:** Connect all nodes with minimum total edge weight, no cycles.

**Analogy:** Laying cables to connect all cities with minimum total cable length.

**Prim's Algorithm:** Greedy. Start from any node, always add the cheapest edge connecting the tree to a new node. Uses a min-heap.

**Kruskal's Algorithm:** Sort all edges by weight. Add edge if it doesn't create a cycle (use Union-Find to check).

---

## Pattern 7: Disjoint Set Union (Union-Find)

**The idea:** Track which nodes are in the same connected component. Supports union and find in near O(1) with path compression + union by rank.

**Analogy:** Social groups. Initially everyone is their own group. When two people become friends, their groups merge. "Are these two people in the same group?" is answered instantly.

**When to use:**
- Detect cycle in undirected graph
- Number of connected components
- Kruskal's MST
- Accounts merge, redundant connection

---

## Pattern 8: Bipartite Check

**The idea:** Try to 2-color the graph. If you can color it with 2 colors such that no two adjacent nodes share a color → bipartite.

**Analogy:** Dividing a group into two teams where no two teammates are enemies. BFS/DFS with alternating colors.

**When to use:**
- Is graph bipartite?
- Can we divide into two groups with no internal conflicts?

---

## Pattern 9: Strongly Connected Components (SCC)

**Kosaraju's Algorithm:**
1. DFS on original graph, push nodes to stack in finish order
2. Transpose the graph (reverse all edges)
3. DFS on transposed graph in stack order — each DFS tree is an SCC

**When to use:** Find groups where every node can reach every other node.

---

## Quick Reference

| Situation | Pattern |
|-----------|---------|
| Shortest path, unweighted | BFS |
| Connected components, paths | DFS |
| Shortest path, weighted (non-neg) | Dijkstra |
| Shortest path, negative weights | Bellman-Ford |
| All pairs shortest path | Floyd-Warshall |
| Task ordering, dependencies | Topological Sort |
| Minimum connection cost | Prim's / Kruskal's MST |
| Group membership, cycle detection | Union-Find |
| Two-team division | Bipartite Check |
| Mutual reachability groups | Kosaraju's SCC |

---

## Decision Flowchart

```mermaid
flowchart TD
    A([Graph Problem]) --> B{Shortest\npath needed?}
    B -->|Yes| C{Edge weights?}
    C -->|All equal / unweighted| D[BFS\nGuarantees shortest path]
    C -->|Non-negative weights| E[Dijkstra\nMin-Heap, expand closest]
    C -->|Negative weights| F[Bellman-Ford\nRelax all edges V-1 times]
    C -->|All pairs| G[Floyd-Warshall\nDP on intermediate nodes]
    B -->|No| H{Ordering /\ndependencies?}
    H -->|Yes| I{Has cycle?}
    I -->|Yes = invalid| J[Cycle Detection\nDFS recursion stack]
    I -->|No| K[Topological Sort\nDFS post-order or Kahn's BFS]
    H -->|No| L{Connected\ncomponents?}
    L -->|Yes| M{Dynamic merging?}
    M -->|Yes| N[Union-Find\npath compression + rank]
    M -->|No| O[BFS or DFS\ncount components]
    L -->|No| P{Minimum\nspanning tree?}
    P -->|Yes| Q{Dense or\nsparse graph?}
    Q -->|Dense| R[Prim's Algorithm\nMin-Heap]
    Q -->|Sparse| S[Kruskal's Algorithm\nSort edges + Union-Find]
    P -->|No| T{Two-colorable?}
    T -->|Yes| U[Bipartite Check\nBFS/DFS alternating colors]
    T -->|No| V[DFS / BFS\nfor traversal or flood fill]
```
