# Geoffrey Hinton

<img src="images/geoffrey-hinton.jpg" alt="Portrait of Geoffrey Hinton" width="280" align="left">

> *"The pooling operation used in convolutional neural networks is a big mistake and the fact that it works so well is a disaster."*


**Field:** Machine Learning · Deep Learning · Neural Networks · Artificial Intelligence

- **Born:** December 6, 1947, London, England
- **Nationality:** British-Canadian
- **Key Contributions:** Backpropagation, Boltzmann Machines, Deep Belief Networks, Capsule Networks
- **Impact:** Widely regarded as one of the "Godfathers of Deep Learning" — the person most responsible for making neural networks actually work

<br clear="left"/>

## Biography

### Early Life & Education

Geoffrey Everest Hinton was born in London in 1947 into what can only be described as an absurdly accomplished family. His great-great-grandfather was [George Boole](../../pioneers/george-boole/) — yes, *that* Boole, the one behind Boolean algebra, the logic that literally makes every computer on Earth tick. He's also related to George Everest, the surveyor after whom the world's tallest mountain is named. No pressure growing up, right?

Hinton studied experimental psychology at King's College, Cambridge, earning his BA in 1970. He was fascinated by how the brain learns — not in the hand-wavy philosophical sense, but in the "can we actually build something that does this?" sense. This led him to the University of Edinburgh, where he completed his PhD in artificial intelligence in 1978 under Christopher Longuet-Higgins.

### Career

Hinton's timing could not have been worse — or, depending on how you look at it, better. He committed himself to neural networks right when [Marvin Minsky](../../ai-pioneers/marvin-minsky/) and Seymour Papert's 1969 book *Perceptrons* had essentially convinced the AI community that neural networks were a dead end. Funding dried up. Colleagues moved on. The "AI winter" was brutal.

Hinton didn't care. He kept working.

After his PhD, he did postdoctoral work at the University of Sussex and UC San Diego. In 1982, he joined Carnegie Mellon University, where he began the work that would eventually change everything. But Hinton was politically uncomfortable in Reagan-era America, and in 1987 he moved to the University of Toronto — a decision that would accidentally turn Toronto into one of the world's great AI research hubs.

In 1985, he and Terry Sejnowski developed **Boltzmann Machines**, the first successful learning algorithm for neural networks with hidden units. Then in 1986, along with David Rumelhart and Ronald Williams, Hinton published the landmark paper on **backpropagation** — the algorithm for training multi-layer neural networks by propagating errors backward through the network. This wasn't technically a new invention (the math had been around), but their paper is what made it *practical* and *popular*. Backpropagation is, without exaggeration, the single most important algorithm in deep learning.

Still, the AI community remained skeptical. For two more decades, neural networks were considered a niche interest — the "weird uncle" at the AI family reunion, if you will.

Then came 2006. Hinton published his work on **Deep Belief Networks**, showing that deep neural networks could be effectively trained by pre-training each layer as a Restricted Boltzmann Machine. This paper is widely cited as the moment that reignited the deep learning revolution. People started paying attention again.

But the real earthquake came in 2012. Hinton's student Alex Krizhevsky, along with Ilya Sutskever, built **AlexNet** — a deep convolutional neural network that won the ImageNet Large Scale Visual Recognition Challenge by a *staggering* margin. The computer vision community was shocked. AlexNet didn't just win; it obliterated the competition, cutting the error rate nearly in half compared to traditional approaches. And it did this using GPUs, which was considered unorthodox at the time. This single result is often credited with launching the modern deep learning era.

In 2013, Google acquired Hinton's startup DNNresearch (which was basically Hinton and two grad students) and he joined **Google Brain** as a Vice President and Engineering Fellow, splitting his time between Google and the University of Toronto.

Never one to rest on his laurels, Hinton introduced **Capsule Networks** in 2017 — his attempt to address fundamental limitations in how CNNs handle spatial hierarchies and viewpoint changes. The idea was elegant, though capsule networks haven't (yet) achieved the same widespread adoption as his earlier innovations.

Fun fact: Hinton has a notoriously bad back and has worked standing up for years. He reportedly hasn't sat down for extended periods in decades. The man literally cannot sit still — which, metaphorically, also describes his research career.

### Later Life & Legacy

In May 2023, Hinton made headlines by **leaving Google** specifically so he could speak freely about the dangers of artificial intelligence. He became one of the most prominent and credible voices warning about existential risks from AI — a remarkable turn for someone who spent his entire career building the technology. When the "Godfather of Deep Learning" says he's worried, people listen.

In 2024, Hinton was awarded the **Nobel Prize in Physics** alongside John Hopfield for their foundational work on artificial neural networks and machine learning. A Nobel Prize. In *Physics*. For work on neural networks. If that doesn't tell you how much the world has changed, nothing will.

---

## Major Contributions

### Backpropagation (1986)

- **Year:** 1986
- **Context:** Co-authored with David Rumelhart and Ronald Williams while at Carnegie Mellon. Neural networks had been considered impractical for complex tasks because there was no efficient way to train multi-layer networks.
- **Technical Details:** The paper "Learning representations by back-propagating errors" described how to compute gradients of the loss function with respect to each weight by applying the chain rule iteratively from the output layer back to the input layer. This made training deep networks computationally feasible.
- **Impact:** Arguably the single most important algorithm in modern deep learning. Every neural network you've ever heard of — from GPT to DALL-E to AlphaFold — relies on backpropagation for training.

### Boltzmann Machines (1985)

- **Year:** 1985
- **Context:** Developed with Terry Sejnowski. Named after Ludwig Boltzmann and inspired by statistical mechanics.
- **Technical Details:** A stochastic recurrent neural network that could learn internal representations. The first neural network model with a successful learning algorithm for hidden units, using simulated annealing to find configurations that minimized an energy function.
- **Impact:** Introduced probabilistic approaches to neural network learning and laid groundwork for generative models.

### Deep Belief Networks (2006)

- **Year:** 2006
- **Context:** Published during the deepest point of neural network skepticism. Most AI researchers had moved on to SVMs and other methods.
- **Technical Details:** Showed that deep networks could be effectively trained by greedily pre-training each layer as a Restricted Boltzmann Machine, then fine-tuning the entire network with backpropagation. This solved the "vanishing gradient" problem that had plagued deep networks.
- **Impact:** Widely regarded as the paper that launched the deep learning revolution. Suddenly, "deep" wasn't a dirty word in machine learning anymore.

### AlexNet (2012)

- **Year:** 2012
- **Context:** Hinton's student Alex Krizhevsky, with Ilya Sutskever, entered the ImageNet competition. Previous winners used hand-crafted features.
- **Technical Details:** An 8-layer deep convolutional neural network trained on two GPUs using ReLU activations, dropout regularization, and data augmentation. Reduced the top-5 error rate from 26% to 15.3%.
- **Impact:** Shocked the entire computer vision community and is the single event most often cited as the beginning of the modern AI boom. After AlexNet, everyone wanted to do deep learning.

### Capsule Networks (2017)

- **Year:** 2017
- **Context:** Hinton had been dissatisfied with CNNs' reliance on pooling operations (see the quote at the top of this page) and their inability to handle spatial hierarchies.
- **Technical Details:** Capsule networks use groups of neurons ("capsules") to encode both the presence and the properties (pose, orientation, scale) of features, using dynamic routing to build part-whole relationships.
- **Impact:** An ambitious rethinking of CNN architecture. While not yet as widely adopted as CNNs, capsule networks represent an important research direction for more robust visual understanding.

---

## Key Publications

| Year | Publication | Significance |
|------|------------|--------------|
| 1985 | "A Learning Algorithm for Boltzmann Machines" (with Sejnowski) | First successful hidden-unit learning algorithm |
| 1986 | "Learning Representations by Back-propagating Errors" (with Rumelhart & Williams) | Popularized backpropagation for multi-layer networks |
| 2006 | "A Fast Learning Algorithm for Deep Belief Nets" (with Osindero & Teh) | Sparked the deep learning revolution |
| 2012 | "ImageNet Classification with Deep Convolutional Neural Networks" (Krizhevsky, Sutskever & Hinton) | AlexNet — launched the modern AI era |
| 2014 | "Dropout: A Simple Way to Prevent Neural Networks from Overfitting" (with Srivastava et al.) | Widely-used regularization technique |
| 2015 | "Distilling the Knowledge in a Neural Network" (with Vinyals & Dean) | Introduced knowledge distillation for model compression |
| 2017 | "Dynamic Routing Between Capsules" (with Sabour & Frosst) | Introduced capsule networks |

---

## Awards & Honors

| Year | Award | Notes |
|------|-------|-------|
| 2001 | Rumelhart Prize | For contributions to the theoretical foundations of human cognition |
| 2005 | IJCAI Award for Research Excellence | For sustained excellence in AI research |
| 2010 | Herzberg Canada Gold Medal | Canada's top science and engineering prize |
| 2011 | BBVA Foundation Frontiers of Knowledge Award | For contributions to machine learning |
| 2016 | IEEE/RSE James Clerk Maxwell Medal | For groundbreaking contributions to deep learning |
| 2018 | **ACM A.M. Turing Award** | Shared with [Yann LeCun](../yann-lecun/) and [Yoshua Bengio](../yoshua-bengio/) — the "Godfathers of AI" |
| 2021 | Dickson Prize in Science | From Carnegie Mellon University |
| 2022 | Princess of Asturias Award for Technical & Scientific Research | Shared with LeCun, Bengio, Demis Hassabis, and others |
| 2024 | **Nobel Prize in Physics** | Shared with John Hopfield — for foundational discoveries enabling machine learning with artificial neural networks |

---

## Notable Quotes

> *"The pooling operation used in convolutional neural networks is a big mistake and the fact that it works so well is a disaster."*

> *"I console myself with the thought that God started with something a lot simpler than a human brain."*

> *"We ceased to be students of artificial intelligence in June 2023. We became combatants."* — on AI safety

> *"It is hard to see how you can prevent the bad actors from using it for bad things."* — on leaving Google

---

## Influence & Legacy

Geoffrey Hinton's influence on modern computing is difficult to overstate. He spent decades in the wilderness, stubbornly insisting that neural networks would eventually work when almost the entire AI community had written them off. He was right.

The lineage of his research reads like a history of deep learning itself: backpropagation made training possible, Boltzmann Machines introduced probabilistic learning, Deep Belief Networks proved depth was valuable, and AlexNet proved it to everyone who was still skeptical. His students and collaborators — including Yann LeCun, Ilya Sutskever, Alex Krizhevsky, and [Andrew Ng](../andrew-ng/) — went on to lead AI research at virtually every major technology company and university.

His decision to leave Google in 2023 to warn about AI risks added a dramatic late chapter to his story. The person who did more than anyone to create modern AI became one of its most vocal critics — not because he thought the technology was bad, but because he understood better than most just how powerful it was becoming.

The University of Toronto, which he joined somewhat randomly in the 1980s, became a global center for AI research largely because of his presence. The "Toronto school" of deep learning shaped a generation of researchers.

When they gave him the Turing Award in 2018, it felt overdue. When they gave him the Nobel Prize in 2024, it felt inevitable.

---

## Related Figures

- [Yann LeCun](../yann-lecun/) — Fellow "Godfather of AI," Turing Award co-recipient (2018), pioneer of convolutional neural networks
- [Yoshua Bengio](../yoshua-bengio/) — Fellow "Godfather of AI," Turing Award co-recipient (2018), pioneer of sequence modeling and attention mechanisms
- [Marvin Minsky](../../ai-pioneers/marvin-minsky/) — His *Perceptrons* (1969) nearly killed neural network research; Hinton proved him wrong
- [George Boole](../../pioneers/george-boole/) — Hinton's great-great-grandfather (!) — inventor of Boolean algebra
- [Andrew Ng](../andrew-ng/) — Student of Hinton's intellectual tradition, helped bring deep learning to the mainstream

---

## Resources

- [Geoffrey Hinton's Google Scholar Profile](https://scholar.google.com/citations?user=JicYPdAAAAAJ)
- [University of Toronto — Geoffrey Hinton](https://www.cs.toronto.edu/~hinton/)
- [Turing Award Citation (2018)](https://amturing.acm.org/award_winners/hinton_4791679.cfm)
- [Nobel Prize in Physics 2024](https://www.nobelprize.org/prizes/physics/2024/)
- [Hinton's Talk: "The Foundations of Deep Learning" (YouTube)](https://www.youtube.com/results?search_query=geoffrey+hinton+foundations+of+deep+learning)
- [Interview: "Godfather of AI" on risks (CBS 60 Minutes)](https://www.youtube.com/results?search_query=geoffrey+hinton+60+minutes)

---

## Timeline

| Year | Event |
|------|-------|
| 1947 | Born in London, England |
| 1970 | BA in Experimental Psychology, King's College, Cambridge |
| 1978 | PhD in Artificial Intelligence, University of Edinburgh |
| 1982 | Joins Carnegie Mellon University |
| 1985 | Develops Boltzmann Machines with Terry Sejnowski |
| 1986 | Publishes landmark backpropagation paper with Rumelhart and Williams |
| 1987 | Moves to the University of Toronto |
| 2004 | Co-founds the Canadian Institute for Advanced Research (CIFAR) Neural Computation program |
| 2006 | Publishes Deep Belief Networks paper — sparks the deep learning revolution |
| 2012 | AlexNet (Krizhevsky, Sutskever & Hinton) wins ImageNet and changes everything |
| 2013 | Google acquires DNNresearch; Hinton joins Google Brain |
| 2017 | Introduces Capsule Networks |
| 2018 | Awarded the ACM A.M. Turing Award with LeCun and Bengio |
| 2023 | Leaves Google to speak freely about AI safety risks |
| 2024 | Awarded the Nobel Prize in Physics with John Hopfield |

---

## References

1. Rumelhart, D. E., Hinton, G. E., & Williams, R. J. (1986). "Learning representations by back-propagating errors." *Nature*, 323(6088), 533–536.
2. Hinton, G. E., & Sejnowski, T. J. (1985). "A learning algorithm for Boltzmann machines." *Cognitive Science*, 9(1), 147–169.
3. Hinton, G. E., Osindero, S., & Teh, Y.-W. (2006). "A fast learning algorithm for deep belief nets." *Neural Computation*, 18(7), 1527–1554.
4. Krizhevsky, A., Sutskever, I., & Hinton, G. E. (2012). "ImageNet classification with deep convolutional neural networks." *Advances in Neural Information Processing Systems*, 25.
5. Sabour, S., Frosst, N., & Hinton, G. E. (2017). "Dynamic routing between capsules." *Advances in Neural Information Processing Systems*, 30.
6. ACM A.M. Turing Award — Geoffrey E. Hinton. https://amturing.acm.org/award_winners/hinton_4791679.cfm
7. The Nobel Prize in Physics 2024. NobelPrize.org. https://www.nobelprize.org/prizes/physics/2024/

## Navigation

- [← Main Index](../../README.md)
- [← Previous: Judea Pearl](../judea-pearl/)
- [↑ Category Overview](../README.md)
- [Next: Yann LeCun →](../yann-lecun/)

---

**Last Updated:** 2026-04-13
