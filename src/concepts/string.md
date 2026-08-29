## Strings in DSA

**Analogy:** A string is like a necklace of beads. Each bead is a character. You can look at any bead directly (O(1) access), but inserting or removing a bead in the middle requires rethreading (O(n)).

**Key insight:** Most string problems are array problems in disguise. The same patterns apply — two pointers, sliding window, hashing, DP.

---

## Pattern 1: Two Pointer on Strings

**The idea:** Use left and right pointers moving toward each other.

```viz
{
  "title": "Palindrome Check — Two Pointers from both ends",
  "description": "s='racecar'. L starts at left, R at right. Compare chars, move inward.",
  "array": ["r", "a", "c", "e", "c", "a", "r"],
  "speed": 900,
  "steps": [
    { "pointers": { "L": 0, "R": 6 }, "highlight": [0,6], "label": "s[L]='r' == s[R]='r' ✓. Move inward." },
    { "pointers": { "L": 1, "R": 5 }, "highlight": [1,5], "label": "s[L]='a' == s[R]='a' ✓. Move inward." },
    { "pointers": { "L": 2, "R": 4 }, "highlight": [2,4], "label": "s[L]='c' == s[R]='c' ✓. Move inward." },
    { "pointers": { "L": 3, "R": 3 }, "highlight": [3], "label": "L==R (middle). Done.", "note": "'racecar' is a palindrome ✓. If any mismatch → not palindrome." }
  ]
}
```

**When to use:**
- Palindrome check (compare characters from both ends)
- Reverse a string in-place
- Valid Palindrome (skip non-alphanumeric)

> **In an interview:** trigger words are *"palindrome / reverse / compare ends"*. Clarify case-sensitivity and whether to skip non-alphanumeric characters.
> **Remember:** two pointers from both ends, marching inward.

---

## Pattern 2: Sliding Window on Strings

**The idea:** Maintain a window of characters, expand/shrink based on conditions.

```viz
{
  "title": "Longest Substring Without Repeating Characters",
  "description": "s = 'abcabc'. Expand R, shrink L when duplicate found. Track max window.",
  "array": ["a", "b", "c", "a", "b", "c"],
  "speed": 900,
  "steps": [
    { "pointers": { "L": 0, "R": 0 }, "highlight": [0], "label": "L=0, R=0. Window='a'. No repeat. max=1" },
    { "pointers": { "L": 0, "R": 1 }, "highlight": [0,1], "label": "R=1. Window='ab'. No repeat. max=2" },
    { "pointers": { "L": 0, "R": 2 }, "highlight": [0,1,2], "label": "R=2. Window='abc'. No repeat. max=3" },
    { "pointers": { "L": 0, "R": 3 }, "highlight": [0,1,2,3], "label": "R=3. Window='abca'. 'a' repeats! Shrink L until no repeat." },
    { "pointers": { "L": 1, "R": 3 }, "highlight": [1,2,3], "label": "L=1. Window='bca'. No repeat. max=3" },
    { "pointers": { "L": 1, "R": 4 }, "highlight": [1,2,3,4], "label": "R=4. Window='bcab'. 'b' repeats! Shrink L." },
    { "pointers": { "L": 2, "R": 4 }, "highlight": [2,3,4], "label": "L=2. Window='cab'. No repeat. max=3" },
    { "pointers": { "L": 2, "R": 5 }, "highlight": [2,3,4,5], "label": "R=5. Window='cabc'. 'c' repeats! Shrink L.", "note": "Final max = 3 ('abc') ✓" }
  ]
}
```

**When to use:**
- Longest substring without repeating characters
- Minimum window substring
- Permutation in string (fixed window = length of pattern)
- Longest substring with at most K distinct characters

> **In an interview:** trigger words are *"longest / shortest substring with condition X"* or *"contains all of ..."*. Ask if the window size is fixed (anagram search) or dynamic (longest-without-repeat).
> **Remember:** expand right, shrink left when the window violates the rule; track a char-count map.

---

## Pattern 3: Hashing for Anagrams / Frequency

**The idea:** Two strings are anagrams if they have the same character frequencies.

**Analogy:** Two bags of Scrabble tiles. They're anagrams if both bags contain exactly the same tiles.

```viz
{
  "title": "Find All Anagrams in String — Sliding Window + Frequency Map",
  "description": "s='cbaebabacd', p='abc'. Fixed window of len(p)=3. Compare freq maps.",
  "array": ["c", "b", "a", "e", "b", "a", "b", "a", "c", "d"],
  "speed": 900,
  "steps": [
    { "pointers": { "L": 0, "R": 2 }, "highlight": [0,1,2], "label": "Window 'cba'. freq={c:1,b:1,a:1} == p_freq={a:1,b:1,c:1} ✓ Anagram at idx 0!" },
    { "pointers": { "L": 1, "R": 3 }, "highlight": [1,2,3], "label": "Slide: remove 'c', add 'e'. Window 'bae'. freq≠p_freq ✗" },
    { "pointers": { "L": 2, "R": 4 }, "highlight": [2,3,4], "label": "Slide: remove 'b', add 'b'. Window 'aeb'. freq≠p_freq ✗" },
    { "pointers": { "L": 3, "R": 5 }, "highlight": [3,4,5], "label": "Slide: remove 'a', add 'a'. Window 'eba'. freq≠p_freq ✗" },
    { "pointers": { "L": 4, "R": 6 }, "highlight": [4,5,6], "label": "Window 'bab'. freq≠p_freq ✗" },
    { "pointers": { "L": 5, "R": 7 }, "highlight": [5,6,7], "label": "Window 'aba'. freq={a:2,b:1}≠p_freq ✗" },
    { "pointers": { "L": 6, "R": 8 }, "highlight": [6,7,8], "label": "Window 'bac'. freq={b:1,a:1,c:1} == p_freq ✓ Anagram at idx 6!", "note": "Anagram indices: [0, 6] ✓" }
  ]
}
```

**When to use:**
- Valid anagram, Group anagrams
- Find all anagrams in a string (sliding window + frequency map)
- Isomorphic strings

> **In an interview:** trigger words are *"anagram / same characters / one-to-one mapping"*. A 26-int count array beats sorting and is O(n).
> **Remember:** anagrams share a frequency signature; isomorphic strings share a consistent bijection.

---

## Pattern 4: String Matching (KMP / Rabin-Karp / Z-Function)

**The idea:** Find a pattern inside a text efficiently — O(n + m) instead of O(n*m).

```viz
{
  "title": "KMP — Skip redundant comparisons using LPS array",
  "description": "pattern='ABCABC'. LPS=[0,0,0,1,2,3]. On mismatch, jump back using LPS instead of restarting.",
  "array": ["A", "B", "C", "A", "B", "C"],
  "speed": 1000,
  "steps": [
    { "pointers": { "i": 0 }, "highlight": [0], "label": "LPS[0]='A': no proper prefix=suffix. LPS[0]=0" },
    { "pointers": { "i": 1 }, "highlight": [1], "label": "LPS[1]='AB': no prefix=suffix. LPS[1]=0" },
    { "pointers": { "i": 2 }, "highlight": [2], "label": "LPS[2]='ABC': no prefix=suffix. LPS[2]=0" },
    { "pointers": { "i": 3 }, "highlight": [0,3], "label": "LPS[3]='ABCA': 'A'='A' → prefix=suffix of len 1. LPS[3]=1" },
    { "pointers": { "i": 4 }, "highlight": [0,1,3,4], "label": "LPS[4]='ABCAB': 'AB'='AB' → LPS[4]=2" },
    { "pointers": { "i": 5 }, "highlight": [0,1,2,3,4,5], "label": "LPS[5]='ABCABC': 'ABC'='ABC' → LPS[5]=3", "note": "LPS=[0,0,0,1,2,3]. On mismatch at pos 6, jump to pos 3 (not 0). Saves recomparing 'ABC'." }
  ]
}
```

**When to use:**
- Find pattern in text (KMP)
- Shortest palindrome (KMP on s + "#" + reverse(s))
- Longest happy prefix

> **In an interview:** trigger words are *"find pattern in text"*, *"longest prefix that is also a suffix"*. Building the LPS array is the reusable core — many problems reduce to it.
> **Remember:** LPS lets you resume after a mismatch instead of restarting — O(n+m), not O(nm).

---

## Pattern 5: Palindrome Techniques

**Expand Around Center:**

```viz
{
  "title": "Expand Around Center — Longest Palindromic Substring",
  "description": "s='babad'. For each center (char or gap), expand while chars match.",
  "array": ["b", "a", "b", "a", "d"],
  "speed": 1000,
  "steps": [
    { "pointers": { "L": 0, "R": 0 }, "highlight": [0], "label": "Center=0('b'): expand → L=-1 stop. Palindrome='b' len=1" },
    { "pointers": { "L": 0, "R": 2 }, "highlight": [0,1,2], "label": "Center=1('a'): expand → s[0]='b'==s[2]='b' ✓. Expand more → L=-1 stop. Palindrome='bab' len=3" },
    { "pointers": { "L": 1, "R": 3 }, "highlight": [1,2,3], "label": "Center=2('b'): expand → s[1]='a'==s[3]='a' ✓. Expand → L=0,R=4: 'b'≠'d' stop. Palindrome='aba' len=3" },
    { "pointers": { "L": 2, "R": 4 }, "highlight": [2,3,4], "label": "Center=3('a'): expand → s[2]='b'≠s[4]='d' stop. Palindrome='a' len=1" },
    { "pointers": { "L": 4, "R": 4 }, "highlight": [4], "label": "Center=4('d'): no expansion. Palindrome='d' len=1", "note": "Longest palindrome = 'bab' or 'aba' (len=3) ✓. O(n²) time, O(1) space." }
  ]
}
```

- O(n²) time, O(1) space
- Use for: Longest palindromic substring, count palindromic substrings

**When to use:**
- Longest palindromic substring
- Count palindromic substrings

> **In an interview:** trigger words are *"longest / count palindromic substring"*. Expand-around-center is O(n²)/O(1)-space and easy to code; mention Manacher's for O(n) if pushed.
> **Remember:** try all 2n−1 centers (chars and gaps); expand while both ends match.

---

## Pattern 6: String DP

**When to use:**
- Edit distance (insert/delete/replace to convert s1 to s2)
- Longest Common Subsequence
- Wildcard matching / Regex matching

```viz
{
  "type": "table",
  "title": "Edit Distance — Convert 'horse' to 'ros'",
  "description": "dp[i][j] = min operations to convert s1[0..i-1] to s2[0..j-1]. Operations: insert, delete, replace.",
  "cols": ["", "", "r", "o", "s"],
  "rows": ["", "h", "o", "r", "s", "e"],
  "speed": 1000,
  "steps": [
    {
      "cells": [
        [0, 1, 2, 3],
        [1, "?", "?", "?"],
        [2, "?", "?", "?"],
        [3, "?", "?", "?"],
        [4, "?", "?", "?"],
        [5, "?", "?", "?"]
      ],
      "active": [1, 1],
      "highlight": [[0, 1]],
      "label": "dp[1][1]: 'h'≠'r' → min(replace=dp[0][0]+1=1, delete=dp[0][1]+1=2, insert=dp[1][0]+1=2) = 1"
    },
    {
      "cells": [
        [0, 1, 2, 3],
        [1, 1, "?", "?"],
        [2, "?", "?", "?"],
        [3, "?", "?", "?"],
        [4, "?", "?", "?"],
        [5, "?", "?", "?"]
      ],
      "active": [2, 1],
      "highlight": [[1, 1], [2, 0]],
      "label": "dp[2][1]: 'o'≠'r' → min(dp[1][0]+1=2, dp[1][1]+1=2, dp[2][0]+1=3) = 2"
    },
    {
      "cells": [
        [0, 1, 2, 3],
        [1, 1, "?", "?"],
        [2, 2, "?", "?"],
        [3, "?", "?", "?"],
        [4, "?", "?", "?"],
        [5, "?", "?", "?"]
      ],
      "active": [3, 2],
      "highlight": [[2, 1], [3, 1]],
      "label": "dp[3][2]: 'r'≠'o' → min(dp[2][1]+1, dp[2][2]+1, dp[3][1]+1) = 2"
    },
    {
      "cells": [
        [0, 1, 2, 3],
        [1, 1, "?", "?"],
        [2, 2, "?", "?"],
        [3, "?", 2, "?"],
        [4, "?", "?", "?"],
        [5, "?", "?", "?"]
      ],
      "active": [4, 3],
      "highlight": [[3, 2], [4, 2]],
      "label": "dp[4][3]: 's'=='s' → dp[3][2]=2 (no cost)"
    },
    {
      "cells": [
        [0, 1, 2, 3],
        [1, 1, "?", "?"],
        [2, 2, "?", "?"],
        [3, "?", 2, "?"],
        [4, "?", "?", 2],
        [5, "?", "?", "?"]
      ],
      "active": [5, 3],
      "highlight": [[4, 3]],
      "label": "dp[5][3]: 'e'≠'s' → min(dp[4][2]+1, dp[4][3]+1, dp[5][2]+1) = 3",
      "note": "Edit distance = 3 ✓ (replace h→r, delete r, delete e)"
    }
  ]
}
```

**Key insight:** Most string DP uses a 2D table where `dp[i][j]` represents the answer for `s1[0..i]` and `s2[0..j]`.

> **In an interview:** trigger words are *"edit / convert / match two strings"*, *"subsequence"*. Two strings + "min operations" or "how many ways" almost always means a 2D DP.
> **Remember:** `dp[i][j]` compares prefixes; branch on whether s1[i] and s2[j] match. (Full family lives in `dp.md`.)

---

## Pattern 7: Prefix / Suffix Tricks

**Longest Common Prefix:** Sort the array. Compare only first and last strings — their common prefix is the answer for all.

**Analogy:** If the shortest and tallest person in a group both fit through a door, everyone fits.

```viz
{
  "title": "Longest Common Prefix — Sort and compare extremes",
  "description": "words=['flower','flow','flight']. Sort → ['flight','flow','flower']. Compare first and last only.",
  "array": ["f", "l", "i", "g", "h", "t"],
  "speed": 900,
  "steps": [
    { "pointers": { "i": 0, "j": 0 }, "highlight": [0], "label": "Compare first='flight' vs last='flower'. Pos 0: 'f'=='f' ✓" },
    { "pointers": { "i": 1, "j": 1 }, "highlight": [1], "label": "Pos 1: 'l'=='l' ✓" },
    { "pointers": { "i": 2, "j": 2 }, "highlight": [2], "label": "Pos 2: 'i' vs 'o'. MISMATCH → stop.", "note": "LCP = 'fl' ✓. If first and last share prefix 'fl', all words in between also share it (sorted order)." }
  ]
}
```

**When to use:**
- Longest common prefix
- Group strings by prefix
- Trie (for prefix queries at scale)

> **In an interview:** trigger words are *"common prefix / group by prefix"*. For repeated prefix queries at scale, pivot to a trie.
> **Remember:** sort, then only the first and last strings bound the common prefix.

---

## Common String Operations Complexity

| Operation | Complexity |
|-----------|------------|
| Access character | O(1) |
| Substring | O(k) where k = length |
| Concatenation | O(n) — use StringBuilder |
| Comparison | O(min(n,m)) |
| Sort characters | O(n log n) |

---

## Quick Reference

| Situation | Pattern |
|-----------|---------|
| Palindrome check | Two pointers from ends |
| Longest substring with condition | Sliding window |
| Anagram / frequency matching | HashMap |
| Find pattern in text | KMP / Rabin-Karp |
| Longest palindromic substring | Expand around center |
| Convert one string to another | String DP (Edit Distance) |
| Prefix queries at scale | Trie |

---

## Decision Flowchart

```mermaid
flowchart TD
    A([String Problem]) --> B{Substring /\nsubsequence?}
    B -->|Contiguous substring| C{Fixed or\ndynamic window?}
    C -->|Fixed length| D[Sliding Window Fixed\nAnagram in string]
    C -->|Condition-based| E[Sliding Window Dynamic\nLongest without repeat\nMin window substring]
    B -->|Subsequence| F{Two strings?}
    F -->|Yes| G[String DP\nLCS / Edit Distance\n2D table]
    F -->|No| H[1D DP or\nTwo Pointer]
    B -->|No| I{Palindrome\ncheck?}
    I -->|Single string| J{Longest or\ncount?}
    J -->|Longest substring| K[Expand around center\nO-n²-]
    J -->|Longest subsequence| L[LCS with reverse\nof same string]
    J -->|Just check| M[Two pointers\nfrom both ends]
    I -->|No| N{Anagram /\nfrequency match?}
    N -->|Yes| O[HashMap\ncharacter frequencies]
    N -->|No| P{Pattern\nin text?}
    P -->|Yes| Q{Multiple patterns\nor single?}
    Q -->|Single pattern| R[KMP Algorithm\nBuild LPS array first]
    Q -->|Multiple patterns| S[Trie + DFS\nor Aho-Corasick]
    P -->|No| T{Prefix\nqueries?}
    T -->|Yes| U[Trie]
    T -->|No| V[Two Pointer\nor Linear Scan]
```

---

## Problem → Pattern Cross-References

The problems list now mirrors the 7 patterns above. The old file grouped by loose labels ("String Manipulation", "String Pattern") and had duplicates — "Reverse Words" was listed twice (same LeetCode 151). Now deduped. Notes:

| Problem | Home pattern | Why (and what else it touches) |
|---------|--------------|-------------------------------|
| Valid Anagram / Isomorphic Strings | Hashing | Character-frequency / bijection maps — moved here from `array.md` |
| Sort Characters by Frequency | Hashing | Count then order by frequency |
| Longest Palindromic Substring | Palindrome | Expand-around-center (also a DP problem — cross-links to `dp.md`) |
| Count Palindromic Subsequences | Palindrome | 2D interval DP over the string |
| Shortest Palindrome / Longest Happy Prefix | String Matching | Both reduce to building the KMP LPS array |
| Longest Common Prefix | String Matching | Sort + compare extremes, or vertical scan |

**Notes on curation & cross-topic homes:**

- Removed the duplicate "Reverse Every Word in A String" (same as "Reverse Words in a String").
- **Implement Atoi** is the home for recursive-atoi (referenced from `recursion.md`).
- Heavy two-string DP (LCS, Edit Distance, Distinct Subsequences, Wildcard/Regex) lives in `dp.md` under *LCS / String DP* — Pattern 6 above points there rather than duplicating them.

> **The disguise principle:** most string problems are array problems wearing letters. Two pointer, sliding window, hashing, and DP transfer directly — recognize the underlying array pattern first.
