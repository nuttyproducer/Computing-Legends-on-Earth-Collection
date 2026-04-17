# tony hoare

<img src="images/portrait.jpg" alt="Portrait" width="280" align="left">

*Sir Tony Hoare — invented Quicksort, then spent decades trying to mathematically prove software correct. Also invented the null reference, which he called his "billion dollar mistake."*

**Field:** Algorithms, Programming Languages, Formal Methods

- **Lifespan:** b. 1934
- **Key contribution:** Quicksort, Hoare logic (formal verification), CSP (Communicating Sequential Processes), null reference
- **Impact:** Gave us one of the fastest sorting algorithms and the tools to prove programs correct

<br clear="left"/>

## Biography

Charles Antony Richard Hoare was born in 1934 in Colombo, Sri Lanka (then Ceylon), where his father was a colonial civil servant. The family eventually returned to England, and young Tony went on to study at Oxford — but not computer science. He started with Classics (because apparently ancient Greek is a great warmup for algorithm design) and then pivoted to statistics.

In 1959, Hoare got a fascinating opportunity: a British Council exchange to study at Moscow State University. It was there, while learning Russian and studying probability theory, that he picked up programming. The Soviets were doing serious computing work, and Hoare dove right in. He was tasked with a machine translation project — translating Russian into English — and needed to sort words efficiently. The existing Shellsort algorithm was too slow for his needs, so at the ripe age of 26, he invented **Quicksort**. Just like that. Needed a faster sort, built one, changed computer science forever.

After returning from Moscow, Hoare joined **Elliott Brothers**, a small British computer company, where he worked on compilers for ALGOL 60. It was during this period that he also made his other famous (or infamous) contribution: the **null reference**, added to ALGOL W in 1965. More on that catastrophe later.

Hoare moved into academia, becoming a professor at **Queen's University Belfast** in 1968, and later at the **University of Oxford** in 1977, where he held the chair in computing for many years. In 1999, he surprised many by leaving Oxford to join **Microsoft Research Cambridge**, where he continued working on formal methods and program verification. Because when you've already invented one of the most important algorithms in history, you might as well help a tech giant build better software.

He was knighted in 2000, becoming **Sir Charles Antony Richard Hoare**. But everyone still just calls him Tony.

---

## Major Contributions

### 1. Quicksort (1960)

The algorithm that made Tony Hoare a household name — well, a household name in the specific households that discuss sorting algorithms at dinner. Quicksort works by picking a "pivot" element, partitioning the array into elements less than and greater than the pivot, and then recursively sorting the partitions.

- **Average time complexity:** O(n log n)
- **Worst case:** O(n²) — but this rarely happens with good pivot selection
- **Space complexity:** O(log n) with in-place partitioning

Why does it matter? Because it's *fast* in practice. Despite having a worse worst-case than Mergesort, Quicksort's cache-friendly access patterns and low overhead make it the default sorting algorithm in many standard libraries (C's `qsort`, Java's `Arrays.sort` for primitives, and many others). Hoare invented it because Shellsort wasn't cutting it for his Russian translation project. Sometimes necessity really is the mother of invention.

**Fun fact:** Hoare originally couldn't explain his algorithm to his colleagues. It wasn't until he learned about recursion from ALGOL 60 that he could express it clearly. Recursion: making algorithms explainable since 1960.

### 2. Hoare Logic (1969)

If Quicksort was Hoare's crowd-pleaser, **Hoare logic** was his magnum opus for the formal methods crowd. Published in his landmark paper "An Axiomatic Basis for Computer Programming," Hoare logic provides a formal system for reasoning about the correctness of programs.

The core idea is the **Hoare triple**:

```
{P} C {Q}
```

Where:
- **P** is the *precondition* (what must be true before the code runs)
- **C** is the *command* (the code itself)
- **Q** is the *postcondition* (what must be true after the code runs)

For example: `{x > 0} y := x * 2 {y > 0}` — if x is positive before the assignment, then y is positive after.

This framework made it possible to *mathematically prove* that programs are correct, rather than just testing them and hoping for the best (which, let's be honest, is what most of us still do). Hoare logic became the foundation of formal verification and influenced everything from theorem provers to design-by-contract programming in languages like Eiffel.

### 3. CSP — Communicating Sequential Processes (1978)

Hoare's book *Communicating Sequential Processes* introduced a formal language for describing patterns of interaction in concurrent systems. Instead of shared memory and locks (the bane of every concurrent programmer's existence), CSP models concurrency through message passing between independent processes.

The influence of CSP is enormous:
- **Go's goroutines and channels** are directly inspired by CSP
- **Erlang's actor model** shares philosophical DNA with CSP
- **Occam programming language** was built directly on CSP principles

If you've ever used Go channels and thought "wow, this is a really clean way to handle concurrency," you have Tony Hoare to thank.

### 4. The Null Reference (1965) — "My Billion-Dollar Mistake"

While working on ALGOL W, Hoare introduced the **null reference** — a special value indicating that a reference doesn't point to any object. It seemed like a convenient idea at the time. It was easy to implement. What could go wrong?

*Everything.* Everything could go wrong.

Null pointer exceptions, null reference errors, segmentation faults — the null reference has caused an almost incomprehensible number of bugs, crashes, system failures, and security vulnerabilities across virtually every programming language that adopted the concept (which is almost all of them). In a 2009 talk, Hoare himself said:

> "I call it my billion-dollar mistake. It was the invention of the null reference in 1965. At that time, I was designing the first comprehensive type system for references in an object oriented language (ALGOL W). My goal was to ensure that all use of references should be absolutely safe, with checking performed automatically by the compiler. But I couldn't resist the temptation to put in a null reference, simply because it was so easy to implement. This has led to innumerable errors, vulnerabilities, and system crashes, which have probably caused a billion dollars of pain and damage in the last forty years."

Modern languages have learned from this. Rust has `Option<T>`, Kotlin has nullable types, Swift has optionals — all trying to fix Tony Hoare's moment of weakness from 1965. A billion dollars is probably an underestimate at this point.

### 5. Monitors

Hoare also contributed the concept of **monitors** — a synchronization construct for controlling access to shared resources in concurrent programming. Monitors bundle together shared data, the procedures that operate on it, and the synchronization needed to make it all thread-safe. Java's `synchronized` keyword and its monitor-based concurrency model owe a debt to this work.

---

## Key Quotes

> "There are two ways of constructing a software design: One way is to make it so simple that there are obviously no deficiencies, and the other way is to make it so complicated that there are no obvious deficiencies."

This is one of the most quoted lines in software engineering, and it's as true today as when Hoare said it. Most of us are building the second kind.

> "I call it my billion-dollar mistake. It was the invention of the null reference in 1965."

Peak self-awareness from a computer scientist. Most people would try to sweep something like that under the rug. Hoare put it in a keynote.

> "Premature optimization is the root of all evil."

This one is frequently attributed to Donald Knuth, and Knuth did use it in his famous 1974 paper. But Knuth himself attributed it to Hoare. Hoare has denied saying it. The authorship remains one of computing's great unsolved mysteries. Whoever said it first, they were right.

---

## Awards and Honors

| Award | Year |
|-------|------|
| ACM Turing Award | 1980 |
| Fellow of the Royal Society (FRS) | 1982 |
| Knighthood (Knight Bachelor) | 2000 |
| Kyoto Prize | 2000 |
| IEEE John von Neumann Medal | 2011 |

The Turing Award citation recognized his "fundamental contributions to the definition and design of programming languages." Which is a polite way of saying "he invented Quicksort and then proved it correct."

---


## 🔗 Related Figures

| Person | Connection | Link |
|--------|-----------|------|
| **Donald Knuth** | Fellow algorithms giant; the Knuth-Hoare quote attribution mystery endures | [Donald Knuth](../donald-knuth/) |
| **Edsger Dijkstra** | Shared Hoare's passion for formal methods and program correctness; they were kindred spirits in the "programs should be provably correct" camp | [Edsger Dijkstra](../edsger-dijkstra/) |
| **Alan Turing** | The award Hoare received in 1980 bears this man's name, and for good reason | [Alan Turing](../alan-turing/) |

---

## References and Further Reading

- Hoare, C.A.R. "Quicksort." *The Computer Journal*, 5(1), 1962
- Hoare, C.A.R. "An Axiomatic Basis for Computer Programming." *Communications of the ACM*, 12(10), 1969
- Hoare, C.A.R. *Communicating Sequential Processes*. Prentice Hall, 1985 (freely available online)
- Hoare, C.A.R. "Null References: The Billion Dollar Mistake." QCon London, 2009
- [ACM Turing Award — C.A.R. Hoare](https://amturing.acm.org/award_winners/hoare_4622167.cfm)
- [Tony Hoare at Microsoft Research](https://www.microsoft.com/en-us/research/people/thoare/)

## Navigation

- [← Main Index](../../README.md)
- [← Previous: Edsger Dijkstra](../edsger-dijkstra/)
- [↑ Category Overview](../README.md)

---

**Last Updated:** 2026-04-13
