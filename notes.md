# [EtherSolve: Computing an Accurate Control-Flow Graph from Ethereum Bytecode](https://arxiv.org/pdf/2103.09113.pdf)
Discusses the part of the CFG that is the most challenging, namely the handling of "orphan jumps" (as it's called in the paper). 
So the way they do it is having a symbolic stack execution. Which only deals with PUSH, DUP, and SWAP. All other opcodes dealing with the stack is only pushing unknown to the stack.
For instance `ADD` is not fully implemented, but instead consumes two items, and add a `UNKNOWN` item to the stack.



