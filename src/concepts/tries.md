## What is a Trie?

**Analogy:** A trie is like an autocomplete system on your phone. As you type "ca", it shows "cat", "car", "cake". Each letter you type narrows down the tree. The trie stores words by their shared prefixes — "cat" and "car" share the "ca" branch.

**Structure:** Each node represents one character. The path from root to a node spells out a prefix. A node marked as "end" means a complete word ends there.

**Why use a Trie over a HashMap?**
- HashMap stores full words — no prefix sharing
- Trie shares prefixes — efficient for prefix queries
- Trie supports "starts with" in O(L) where L = word length

**Time complexity:** Insert, Search, StartsWith — all O(L) where L = length of word.

**Space:** O(total characters across all words) — shared prefixes save space.

---

## Pattern 1: Basic Trie (Insert / Search / StartsWith)

**The idea:** Each node has up to 26 children (for lowercase letters) and an `isEnd` flag.

```viz
{
  "type": "table",
  "title": "Trie Insert — 'cat', 'car', 'cake'",
  "description": "Each row = one trie level. Shared prefixes share the same node. isEnd marks a complete word.",
  "speed": 1000,
  "cols": ["", "Level 1", "Level 2", "Level 3", "Level 4", "Level 5"],
  "rows": ["cat", "car", "cake"],
  "cells": [
    ["c", "a", "t*", "-", "-"],
    ["c", "a", "r*", "-", "-"],
    ["c", "a", "k", "e*", "-"]
  ],
  "steps": [
    {
      "cells": [["?","?","?","-","-"],["?","?","?","-","-"],["?","?","?","?","-"]],
      "label": "Start: trie is empty."
    },
    {
      "cells": [["c","?","?","-","-"],["?","?","?","-","-"],["?","?","?","?","-"]],
      "active": [0,0],
      "label": "Insert 'cat': create node 'c' at level 1."
    },
    {
      "cells": [["c","a","?","-","-"],["?","?","?","-","-"],["?","?","?","?","-"]],
      "active": [0,1],
      "label": "Create node 'a' at level 2."
    },
    {
      "cells": [["c","a","t*","-","-"],["?","?","?","-","-"],["?","?","?","?","-"]],
      "active": [0,2],
      "label": "Create node 't' at level 3. Mark isEnd=true. 'cat' inserted ✓"
    },
    {
      "cells": [["c","a","t*","-","-"],["c","a","r*","-","-"],["?","?","?","?","-"]],
      "highlight": [[1,0],[1,1]],
      "active": [1,2],
      "label": "Insert 'car': 'c' and 'a' already exist (shared!). Only add new node 'r*'."
    },
    {
      "cells": [["c","a","t*","-","-"],["c","a","r*","-","-"],["c","a","k","e*","-"]],
      "highlight": [[2,0],[2,1]],
      "active": [2,3],
      "label": "Insert 'cake': 'c' and 'a' shared again. Add 'k' then 'e*'.",
      "note": "3 words share the 'c→a' prefix. Trie saves space vs storing full strings separately ✓"
    }
  ]
}
```

**When to use:**
- Autocomplete / word suggestions
- Spell checker
- Longest word with all prefixes valid
- Count distinct substrings

> **In an interview:** trigger words are *"prefix"*, *"starts with"*, *"autocomplete"*, or many words sharing structure. If it's exact-match only, a hash set is simpler — say so.
> **Remember:** path from root spells a prefix; `isEnd` marks a complete word.

---

## Pattern 2: Trie for XOR Problems

**The idea:** Store numbers in a binary trie (bit by bit, from MSB to LSB). To maximize XOR with a number, greedily go to the opposite bit at each level.

**Analogy:** You're trying to be as different as possible from a given number. At each bit, if the number has a 0, you want a 1 (and vice versa). The trie lets you greedily pick the most different path.

```viz
{
  "type": "table",
  "title": "Binary Trie — Maximum XOR of two numbers",
  "description": "nums=[3,10,5,25]. Each row = one number's 5-bit binary. Greedy: for num=3, pick opposite bit at each level to maximize XOR.",
  "speed": 1000,
  "cols": ["", "bit4", "bit3", "bit2", "bit1", "bit0"],
  "rows": ["3", "10", "5", "25", "→XOR(3)"],
  "cells": [
    [0, 0, 0, 1, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 1],
    [1, 1, 0, 0, 1],
    ["?", "?", "?", "?", "?"]
  ],
  "steps": [
    {
      "cells": [[0,0,0,1,1],[0,1,0,1,0],[0,0,1,0,1],[1,1,0,0,1],["?","?","?","?","?"]],
      "highlight": [[0,0],[1,0],[2,0],[3,0]],
      "label": "All 4 numbers inserted in binary trie. Now find max XOR for 3=00011."
    },
    {
      "cells": [[0,0,0,1,1],[0,1,0,1,0],[0,0,1,0,1],[1,1,0,0,1],["1","?","?","?","?"]],
      "active": [4,0],
      "highlight": [[3,0]],
      "label": "bit4: 3 has 0 → want 1. Trie has 1 (from 25=11001). XOR bit=1. Follow 1."
    },
    {
      "cells": [[0,0,0,1,1],[0,1,0,1,0],[0,0,1,0,1],[1,1,0,0,1],["1","1","?","?","?"]],
      "active": [4,1],
      "highlight": [[3,1]],
      "label": "bit3: 3 has 0 → want 1. Trie has 1 (from 25). XOR bit=1. Follow 1."
    },
    {
      "cells": [[0,0,0,1,1],[0,1,0,1,0],[0,0,1,0,1],[1,1,0,0,1],["1","1","0","?","?"]],
      "active": [4,2],
      "highlight": [[3,2]],
      "label": "bit2: 3 has 0 → want 1. No 1 available → follow 0. XOR bit=0."
    },
    {
      "cells": [[0,0,0,1,1],[0,1,0,1,0],[0,0,1,0,1],[1,1,0,0,1],["1","1","0","1","?"]],
      "active": [4,3],
      "highlight": [[3,3]],
      "label": "bit1: 3 has 1 → want 0. Trie has 0 (from 25). XOR bit=1. Follow 0."
    },
    {
      "cells": [[0,0,0,1,1],[0,1,0,1,0],[0,0,1,0,1],[1,1,0,0,1],["1","1","0","1","0"]],
      "active": [4,4],
      "highlight": [[3,4]],
      "label": "bit0: 3 has 1 → want 0. No 0 → follow 1. XOR bit=0.",
      "note": "XOR row = 11010 = 26. Max XOR = 3 XOR 25 = 26 ✓. Greedy: always pick opposite bit when available."
    }
  ]
}
```

**Template (Max XOR):**
```
# Insert number bit by bit (from bit 31 to bit 0)
# To find max XOR with x:
node = root
xor = 0
for i in range(31, -1, -1):
    bit = (x >> i) & 1
    want = 1 - bit          # we want the opposite bit
    if want in node.children:
        xor |= (1 << i)
        node = node.children[want]
    else:
        node = node.children[bit]
return xor
```

**When to use:**
- Maximum XOR of two numbers in an array
- Maximum XOR with an element from array (with queries)

> **In an interview:** trigger words are *"maximum XOR pair"* — the leap is realizing a bit-by-bit trie turns an O(n²) pair search into O(32n).
> **Remember:** insert numbers MSB-first; to maximize XOR, greedily walk toward the opposite bit.

---

## Pattern 3: Trie for String Matching

**The idea:** Build a trie of patterns, then search text against it. More efficient than checking each pattern separately.

**Analogy:** Instead of scanning the grid for each word one by one, you build a single trie of all words. As you DFS through the grid, you simultaneously walk the trie — one traversal finds all matching words at once.

```viz
{
  "type": "table",
  "title": "Word Search II — Trie + DFS on Grid",
  "description": "3×3 grid. DFS each cell while walking the trie simultaneously. Prune when prefix not in trie.",
  "speed": 1000,
  "cols": ["", "col0", "col1", "col2"],
  "rows": ["row0", "row1", "row2"],
  "cells": [
    ["e", "a", "t"],
    ["t", "e", "a"],
    ["n", "a", "t"]
  ],
  "steps": [
    {
      "cells": [["e","a","t"],["t","e","a"],["n","a","t"]],
      "label": "Grid built. Trie contains: eat, tea, tan, ate, nat, bat. Start DFS from each cell."
    },
    {
      "cells": [["e","a","t"],["t","e","a"],["n","a","t"]],
      "active": [0,0],
      "label": "DFS from (0,0)='e'. Trie has 'e' prefix → continue."
    },
    {
      "cells": [["e","a","t"],["t","e","a"],["n","a","t"]],
      "highlight": [[0,0]],
      "active": [0,1],
      "label": "Move to (0,1)='a'. Trie path 'ea' exists → continue."
    },
    {
      "cells": [["e","a","t"],["t","e","a"],["n","a","t"]],
      "highlight": [[0,0],[0,1]],
      "active": [0,2],
      "label": "Move to (0,2)='t'. Trie path 'eat' → isEnd=true! Found 'eat' ✓"
    },
    {
      "cells": [["e","a","t"],["t","e","a"],["n","a","t"]],
      "active": [1,0],
      "label": "DFS from (1,0)='t'. Trie has 't' prefix (tea, tan) → continue."
    },
    {
      "cells": [["e","a","t"],["t","e","a"],["n","a","t"]],
      "highlight": [[1,0]],
      "active": [1,1],
      "label": "Move to (1,1)='e'. Trie path 'te' exists → continue."
    },
    {
      "cells": [["e","a","t"],["t","e","a"],["n","a","t"]],
      "highlight": [[1,0],[1,1]],
      "active": [0,1],
      "label": "Move to (0,1)='a'. Trie path 'tea' → isEnd=true! Found 'tea' ✓",
      "note": "Trie pruning: if prefix not in trie → stop DFS immediately. All 6 words found ✓"
    }
  ]
}
```

**When to use:**
- Word search II (find all words from a list in a grid)
- Multi-pattern matching

> **In an interview:** trigger is searching a grid/text for **many** words at once. Building one trie and walking it during DFS beats running a search per word.
> **Remember:** trie lets you prune the instant a prefix leaves the word set.

---

## When to Use a Trie

| Situation | Why Trie |
|-----------|----------|
| Prefix search / autocomplete | O(L) prefix lookup |
| Longest word with all prefixes | DFS on trie |
| Count distinct substrings | Insert all suffixes |
| Maximum XOR of pairs | Binary trie, greedy bit choice |
| Word search in grid with word list | Trie + DFS/backtracking |

---

## Trie vs HashMap

| Operation | HashMap | Trie |
|-----------|---------|------|
| Exact word search | O(L) | O(L) |
| Prefix search | O(n*L) scan | O(L) |
| All words with prefix | O(n*L) scan | O(L + results) |
| Space | O(n*L) | O(n*L) but shared prefixes |

---

## Decision Flowchart

```mermaid
flowchart TD
    A([Trie Problem]) --> B{What kind\nof query?}
    B -->|Prefix search\nor autocomplete| C[Basic Trie\nInsert + StartsWith]
    B -->|Exact word search| D[Basic Trie\nInsert + Search with isEnd]
    B -->|Longest word where\nall prefixes exist| E[Insert all words\nDFS on trie\nonly go deeper if isEnd]
    B -->|Count distinct\nsubstrings| F[Insert all suffixes\nCount nodes added]
    B -->|Maximum XOR\nof two numbers| G[Binary Trie\nStore bit by bit MSB first]
    G --> H[For each number\ngreedily pick opposite bit\nto maximize XOR]
    B -->|Find all words\nfrom list in grid| I[Build Trie of word list\nDFS on grid\nPrune using trie]
    C --> J{Need to also\ncount words?}
    J -->|Yes| K[Store count at\neach end node]
    J -->|No| L[Just isEnd flag\nis enough]
```

---

## Problem → Pattern Cross-References

The problems list mirrors the 3 patterns above. Notes:

| Problem | Home pattern | Why (and what else it touches) |
|---------|--------------|-------------------------------|
| Design Add and Search Words | Basic Trie | Search with '.' wildcard → DFS across children at that level |
| Replace Words | Basic Trie | Walk each word until the first matching root (isEnd) |
| Longest String with All Prefixes | Basic Trie | DFS, only descend through nodes that are themselves words |
| Number of Distinct Substrings | Basic Trie | Insert all suffixes; each new node = one distinct substring |
| Word Search II | String Matching | Build a trie of the word list, DFS the grid, prune off-trie paths |

**Notes on curation:**

- Added the canonical **Implement Trie (Prefix Tree)** (LeetCode 208) alongside the count-based **Implement Trie II**.
- "Bit Prerequisites for Trie" is reading material, not a problem — see `bits.md` for the actual XOR problems that build the intuition for the Binary Trie pattern.

> **When a trie beats a hashmap:** any time the query is about *prefixes* (autocomplete, "all words starting with…") or *bitwise paths* (max XOR). For exact-match-only lookups, a hashmap is simpler — reach for a trie when structure is shared.
