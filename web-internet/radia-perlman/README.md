# Radia Perlman

<img src="images/portrait.jpg" alt="Portrait" width="280" align="left">

**Field:** Computer Networks, Network Security  
**Born:** 1951, Portsmouth, Virginia, USA  
**Alma Mater:** MIT (BS & MS in Mathematics; PhD in Computer Science, 1988)  
**Known For:** Spanning Tree Protocol (STP), IS-IS, TRILL, Network Security  
**Nickname She Hates:** "Mother of the Internet"

<br clear="left"/>

## The One-Sentence Version

Radia Perlman invented the algorithm that makes large Ethernet networks actually work — and then spent decades being annoyed that people call her the "Mother of the Internet."

---

## Early Life & Education

Radia Perlman was born in 1951 in Portsmouth, Virginia. Both of her parents were engineers who worked for the US government — so you could say networking was in her DNA, even if the networks back then were made of people and paperwork rather than packets.

She went to MIT, where she earned a BS and MS in Mathematics, and later returned for a PhD in Computer Science (1988) under the supervision of **Dave Clark**, one of the key architects of the internet's protocols. Her doctoral work focused on network routing in the presence of Byzantine failures — because apparently regular network failures weren't challenging enough.

### TORTIS: Teaching Turtles Before It Was Cool

Before she revolutionized networking, Perlman did something arguably even harder: she made programming accessible to small children. At MIT, she designed **TORTIS** (Toddler's Own Recursive Turtle Interpreter System), a programming language that let young kids — some as young as 3½ — control the LOGO turtle. This was pioneering computer science education work, years before "teach kids to code" became a Silicon Valley talking point.

---

## The Spanning Tree Protocol (STP)

### The Problem

In the mid-1980s, Ethernet networks had a scaling problem. If you connected network bridges in a loop (which you'd want to do for redundancy), packets would circulate forever, duplicating themselves and bringing the network to its knees. It was basically a network meltdown waiting to happen every time someone plugged in a redundant cable.

### The Solution

In 1985, while working at **Digital Equipment Corporation (DEC)**, Perlman invented the **Spanning Tree Protocol (STP)**. The idea is elegant: take a network with redundant paths (which might contain loops) and dynamically compute a loop-free subset — a *spanning tree* — that still reaches every node. Redundant links are kept as backups but deactivated until needed.

Without STP, Ethernet networks simply could not scale beyond trivial topologies. Every large Ethernet network in the world has depended on this protocol or its descendants. It's not an exaggeration to say that STP is one of the invisible foundations of modern networking.

### Algorhyme

Perlman, who has a gift for making the deeply technical feel approachable, wrote a poem about it:

> *I think that I shall never see*  
> *A graph more lovely than a tree.*  
>  
> *A tree whose crucial property*  
> *Is loop-free connectivity.*  
>  
> *A tree that must be sure to span*  
> *So packets can reach every LAN.*  
>  
> *First, the root must be selected.*  
> *By ID, it is elected.*  
>  
> *Least-cost paths from root are traced.*  
> *In the tree, these paths are placed.*  
>  
> *A mesh is made by folks like me,*  
> *Then bridges find a spanning tree.*

If you can explain a fundamental network algorithm in a poem, you understand it better than anyone.

---

## Beyond STP: A Career of Making Networks Work

### IS-IS (Intermediate System to Intermediate System)

Perlman designed the **IS-IS routing protocol**, which became one of the core routing protocols of the internet backbone. Many of the world's largest ISPs use IS-IS to route traffic. It's the kind of infrastructure that's so fundamental most people don't even know it exists — which is exactly how good infrastructure should work.

### TRILL (Transparent Interconnection of Lots of Links)

Decades after STP, Perlman developed **TRILL**, intended as a more efficient replacement. Where STP disables redundant links (wasting bandwidth), TRILL allows all links to be active simultaneously while still preventing loops. It was, in essence, Perlman fixing the limitations of her own earlier invention — which is a pretty boss move.

### Network Security

Perlman made major contributions to **network security**, including:

- Designing **authentication protocols** for link-state routing
- Significant work on **PKI (Public Key Infrastructure)**
- Contributions to protocols that help ensure the packets traversing those spanning trees aren't being tampered with

She holds **over 100 patents** in networking and security.

---

## "Mother of the Internet" — Please Don't

The media loves a catchy title, and "Mother of the Internet" is undeniably catchy. Perlman, however, actively dislikes it. As she has said:

> *"The internet was not done by any individual, and no one person could have done it."*

She finds the title annoying and reductive — not because she's being modest (though she is), but because she thinks it's just *wrong*. The internet is the product of thousands of people's work over decades. Reducing it to a single "mother" or "father" is a distortion of history that she has zero interest in perpetuating.

She's also noted the gendered absurdity: Vint Cerf gets called the "Father of the Internet" for TCP/IP, and then someone decided she must be the "Mother." As if the internet is a nuclear family.

> *"I did this because somebody asked me to solve a problem, not to become famous."*

That's Radia Perlman in a nutshell: solve the problem, skip the hype.

---

## Publications

Perlman is the author of two definitive networking textbooks:

- **"Interconnections: Bridges, Routers, Switches, and Internetworking Protocols"** — widely considered *the* networking textbook. If you've taken a serious networking course, you've probably encountered this book.
- **"Network Security: Private Communication in a Public World"** (with Charlie Kaufman and Mike Speciner) — a comprehensive treatment of network security that's both rigorous and readable.

---

## Awards & Honors

- **SIGCOMM Award** — the highest honor in data communications
- **Internet Hall of Fame** inductee
- **Computer History Museum Fellow**
- **National Inventors Hall of Fame** inductee
- Holder of **100+ patents**
- Numerous lifetime achievement awards in networking

---

## Career Timeline

| Period | Role |
|--------|------|
| 1970s | MIT — TORTIS / LOGO turtle research |
| 1980s–1990s | Digital Equipment Corporation (DEC) — STP, IS-IS |
| 1990s–2000s | Sun Microsystems |
| 2010s | Intel |
| Present | Dell Technologies |

---

## Personality & Legacy

Perlman is known for being **modest, direct, and having zero patience for hype**. In a field that often rewards self-promotion, she has consistently let her work speak for itself — and her work has been *very* loud.

She's also funny. The "Algorhyme" poem alone would be enough, but she regularly delivers dry, deadpan observations about the networking industry that cut through the noise. She's the kind of engineer who would rather fix a protocol than give a keynote about disrupting one.

Her legacy is literally woven into the fabric of every network you use. Every time you connect to Wi-Fi, browse the web, or stream a video, packets are flowing over networks that rely on algorithms and protocols Radia Perlman designed. She may not want to be called the Mother of the Internet, but the internet definitely wouldn't be the same without her.

---

## Related Figures

- [Vint Cerf](../vint-cerf/) — "Father of the Internet" and TCP/IP co-creator (she dislikes the "Mother" counterpart label)
- [Bob Kahn](../bob-kahn/) — TCP/IP co-creator and internet architecture pioneer
- [Tim Berners-Lee](../tim-berners-lee/) — the Web runs on the networks she helped make reliable
- [Grace Hopper](../../foundational-cs/grace-hopper/) — fellow pioneering woman in computing
- [Frances Allen](../../systems-languages/frances-allen/) — fellow woman Turing Award–adjacent pioneer in systems
- [Barbara Liskov](../../systems-languages/barbara-liskov/) — fellow woman Turing Award winner from MIT

---

## References & Further Reading

1. Perlman, R. *Interconnections: Bridges, Routers, Switches, and Internetworking Protocols.* Addison-Wesley.
2. Perlman, R., Kaufman, C., & Speciner, M. *Network Security: Private Communication in a Public World.* Prentice Hall.
3. IEEE 802.1D — Spanning Tree Protocol standard
4. RFC 1142 — OSI IS-IS Intra-domain Routing Protocol
5. RFC 6325 — TRILL: Transparent Interconnection of Lots of Links
6. Internet Hall of Fame profile: [Radia Perlman](https://www.internethalloffame.org/inductee/radia-perlman/)
7. Computer History Museum Fellow page

## Navigation

- [← Main Index](../../README.md)
- [← Previous: Vint Cerf](../vint-cerf/)
- [↑ Category Overview](../README.md)
- [Next: Tim Berners-Lee →](../tim-berners-lee/)

---

**Last Updated:** 2026-04-13
