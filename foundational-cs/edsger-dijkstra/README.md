# edsger dijkstra

![Portrait](images/portrait.jpg)
*Edsger Dijkstra — the man who found the shortest path to legendary status in computer science.*

**Field:** Algorithms, Software Engineering, Programming Methodology

- **Lifespan:** 1930–2002
- **Key contribution:** Dijkstra's algorithm, structured programming, semaphores, "Go To Statement Considered Harmful"
- **Impact:** Revolutionized how we think about writing correct software

---

## Biography

Edsger Wybe Dijkstra was born on May 11, 1930, in Rotterdam, the Netherlands. His father was a chemist who served as president of the Dutch Chemical Society, and his mother was a mathematician — so you could say rigorous thinking was in the family DNA.

Young Edsger originally set out to study theoretical physics, which is a perfectly respectable ambition. But then he discovered programming, realized it was a brand-new field with virtually no competition, and made possibly the smartest career pivot in scientific history. He studied mathematics and theoretical physics at the University of Leiden, but by 1951 he was already working as a programmer at the Mathematisch Centrum in Amsterdam.

Here's a fun detail: when Dijkstra got married, he listed his profession as "programmer" on his marriage certificate. The civil servant objected, saying that wasn't a real profession. Dijkstra was ahead of his time — today, half the economy runs on programmers, and the other half is trying to hire them.

He became one of the first people to argue — loudly and persistently — that programming should be treated as a rigorous scientific discipline, not a craft practiced by cowboys banging on keyboards. This made him simultaneously one of the most respected and most feared figures in the field.

Dijkstra held academic positions at the Eindhoven University of Technology and, later, at the University of Texas at Austin, where he held the Schlumberger Centennial Chair in Computer Sciences. He passed away on August 6, 2002, in Nuenen, the Netherlands, leaving behind a legacy that touches virtually every corner of modern computing.

---

## Major Contributions

### 1. Dijkstra's Algorithm (1956)

The shortest-path algorithm that made him immortal — and he came up with it in about 20 minutes while sitting at a café in Amsterdam with his fiancée, thinking about how to demonstrate the capabilities of a new computer. He wanted a problem that non-mathematicians could understand, and settled on finding the shortest route between two cities in the Netherlands. The result was an elegant algorithm for finding the shortest path in a weighted graph.

It was published in 1959 and is now used in every GPS navigation system, network routing protocol, and Google Maps query on the planet. Not bad for a coffee-break brainstorm.

### 2. "Go To Statement Considered Harmful" (1968)

Arguably the most famous letter ever published in the history of computer science. Dijkstra submitted it to *Communications of the ACM* with a more boring title, but editor Niklaus Wirth spiced it up — and accidentally created a meme template that persists to this day ("X Considered Harmful").

The letter argued that the `goto` statement was a source of endless bugs and unmaintainable code, and that programs should be written using structured control flow (loops, conditionals, subroutines). It sparked an absolute firestorm of debate, but Dijkstra won. Today, `goto` is about as welcome in most codebases as a raccoon in a kitchen.

### 3. Semaphores

Dijkstra invented semaphores, the fundamental synchronization primitive for concurrent programming. These are the traffic lights of multi-threaded code — they control which process gets to access a shared resource and when.

He named the two operations `P()` and `V()`, from the Dutch words *proberen* (to try) and *verhogen* (to increment). This has confused generations of English-speaking students, which Dijkstra would probably have considered a feature, not a bug.

### 4. THE Multiprogramming System (1968)

Dijkstra designed THE (Technische Hogeschool Eindhoven) operating system, which was the first OS to be built using a layered architecture. Each layer only interacted with the layer directly below it. This concept of software layering became a foundational principle of systems design — you see it everywhere from network protocols (the OSI model) to modern web applications.

### 5. Structured Programming

Beyond just attacking `goto`, Dijkstra was a tireless champion of structured programming — the idea that programs should be composed from clean, well-defined control structures like `if/then/else`, `while` loops, and subroutines. He co-authored the influential book *Structured Programming* (1972) with Tony Hoare and Ole-Johan Dahl.

His philosophy was simple: programs should be written to be *understood by humans first*, and executed by computers second. Revolutionary stuff, and still widely ignored.

### 6. The Dining Philosophers Problem

Dijkstra formulated this classic concurrency problem in 1965: five philosophers sit around a table, each needing two forks to eat spaghetti, but there are only five forks total (one between each pair). How do you prevent deadlock and starvation? It's a beautifully simple illustration of the nightmares that await anyone doing concurrent programming, and it remains a staple of every operating systems course.

### 7. Self-Stabilizing Systems

Later in his career, Dijkstra pioneered the concept of self-stabilizing distributed systems — systems that can recover from any arbitrary state and eventually return to correct behavior without external intervention. This work was ahead of its time and has become increasingly relevant in the age of large-scale distributed computing.

---

## Fun Facts

- **Handwritten everything.** Dijkstra wrote all his manuscripts by hand with a fountain pen and had them photocopied for distribution. He never used email and was deeply skeptical of most technology tools. The irony of a computer science legend avoiding computers was not lost on anyone.

- **The EWD manuscripts.** His handwritten notes and papers were numbered sequentially from EWD0 to EWD1318. These "EWDs" circulated among colleagues like samizdat literature and are now archived online. They cover everything from algorithms to education to scathing critiques of bad software.

- **Strong opinions, strongly held.** Dijkstra had famously savage views on popular programming languages:
  - On **BASIC**: *"It is practically impossible to teach good programming to students that have had a prior exposure to BASIC: as potential programmers they are mentally mutilated beyond hope of regeneration."*
  - On **FORTRAN**: Called it *"the infantile disorder"* of computing.
  - On **COBOL**: Called it *"the disease that has been the most debilitating."*
  - On **PL/I**: *"Using PL/I must be like flying a plane with 7,000 buttons, switches, and handles to manipulate in the cockpit."*

- **Turing Award.** He received the ACM Turing Award in 1972, often called the "Nobel Prize of Computing," for his fundamental contributions to programming as a high, intellectual challenge.

- **Teaching style.** His university courses were legendary for their rigor. He believed computer science education was in a terrible state and wasn't shy about saying so.

---

## Notable Quotes

> "Computer Science is no more about computers than astronomy is about telescopes."

> "The question of whether a computer can think is no more interesting than the question of whether a submarine can swim."

> "If debugging is the process of removing software bugs, then programming must be the process of putting them in."

> "Testing shows the presence, not the absence of bugs."

> "Simplicity is a prerequisite for reliability."

> "The competent programmer is fully aware of the strictly limited size of his own skull."

> "How do we convince people that in programming simplicity and clarity — in short: what mathematicians call 'elegance' — are not a dispensable luxury, but a crucial matter that decides between success and failure?"

---

## Related Figures

- [Donald Knuth](../donald-knuth/) — Fellow giant of algorithms and programming methodology. Knuth and Dijkstra had enormous mutual respect, despite very different working styles.
- [Tony Hoare](../tony-hoare/) — Collaborated on structured programming. Invented quicksort and CSP. Another champion of program correctness.
- [Alan Turing](../alan-turing/) — The foundational figure whose theoretical work underpinned everything Dijkstra built upon.

---

## References & Further Reading

- Dijkstra, E. W. "A Note on Two Problems in Connexion with Graphs." *Numerische Mathematik*, 1959.
- Dijkstra, E. W. "Go To Statement Considered Harmful." *Communications of the ACM*, 1968.
- Dijkstra, E. W., Dahl, O.-J., and Hoare, C. A. R. *Structured Programming*. Academic Press, 1972.
- [EWD Archive (University of Texas)](https://www.cs.utexas.edu/~EWD/) — The complete collection of his handwritten manuscripts.
- [ACM Turing Award Citation (1972)](https://amturing.acm.org/award_winners/dijkstra_1053701.cfm)

## Navigation

- [← Main Index](../../README.md)
- [← Previous: Donald Knuth](../donald-knuth/)
- [↑ Category Overview](../README.md)
- [Next: Tony Hoare →](../tony-hoare/)

---

**Last Updated:** 2026-04-13
