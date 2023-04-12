# [EtherSolve: Computing an Accurate Control-Flow Graph from Ethereum Bytecode](https://arxiv.org/pdf/2103.09113.pdf)
Discusses the part of the CFG that is the most challenging, namely the handling of "orphan jumps" (as it's called in the paper). 
So the way they do it is having a symbolic stack execution. Which only deals with PUSH, DUP, and SWAP. All other opcodes dealing with the stack is only pushing unknown to the stack.
For instance `ADD` is not fully implemented, but instead consumes two items, and add a `UNKNOWN` item to the stack.

# [Gigahorse: Thorough, Declarative Decompilation ofSmart Contracts](https://yanniss.github.io/gigahorse-icse19.pdf)
*In the abstract they mention they are one of the most precise and complete deocompilers*.
What does Gigahore do ? 
1. Find the basic blocks
2. Analyze of the stack is effected in a block
3. Create a control flow graph. 
4. Use the CFG to create a IR
5. Infer function boundaries, used to create a local CFG from a global one.
6. Infer function arguments

The IR representation is inspired by [Vandal: A Scalable Security Analysis Framework for Smart Contracts](https://arxiv.org/pdf/1809.03981.pdf).

To identity public functions Gigahorse analyzes the dispatcher pattern, and seeing where the `JUMP` lands. It also uses a database ([https://www.4byte.directory/](https://www.4byte.directory/)) to be able to find the function names.
The challenging part is of course to identify the private functions, this is more complex and is based on heuristics. One of the heuristics is seeing how the stack is filled with jump addresses, to be more precise it find a block that jumps to a "non-locally-derived" address that originates from another block that can reach a return block.

# [Building reliable EVM disassemblers](https://karmacoma.notion.site/Building-reliable-EVM-disassemblers-ecf689d965cc4ffc9c3b2e34f4227b46)
Great article on some pitfalls one can hit when writing a dissambler, and on the importance of dissamble should be possible to assemble.

# [recon 2018 - Rattle ](https://www.trailofbits.com/documents/RattleRecon.pdf)
Haven't watched the talk, but looks interesting, and should probably be investigated.

[Rattle – an Ethereum EVM binary analysis framework](https://blog.trailofbits.com/2018/09/06/rattle-an-ethereum-evm-binary-analysis-framework/)

### Single Static Assignment form
- Makes the code more readable 
- https://www.cs.cmu.edu/~fp/courses/15411-f08/lectures/09-ssa.pdf
- References https://pp.info.uni-karlsruhe.de/uploads/publikationen/braun13cc.pdf which seems good

# [Porosity: A Decompiler For Blockchain-Based Smart Contracts Bytecode](https://media.defcon.org/DEF%20CON%2025/DEF%20CON%2025%20presentations/DEF%20CON%2025%20-%20Matt-Suiche-Porosity-Decompiling-Ethereum-Smart-Contracts-WP.pdf)
Took a quick glance of it, looks like there are some tips and tricks here.

# [https://www.nevillegrech.com/publications/](https://www.nevillegrech.com/publications/)
Written a large part of the Gigahore code, and been part of many interesting papers. Should be followed!

## [Elipmoc: Advanced Decompilation of Ethereum Smart Contracts](https://www.nevillegrech.com/assets/pdf/elipmoc-oopsla22.pdf)
Haven't read it, but looks interesting, and should probably be investigated.

## [MadMax: Analyzing the Out-of-Gas World of Smart Contracts](https://www.nevillegrech.com/assets/pdf/madmax-cacm.pdf)
Haven't read it, but looks interesting, and should probably be investigated.


## Removing the floating block
[What is the cryptic part at the end of a solidity contract bytecode?](https://ethereum.stackexchange.com/questions/23525/what-is-the-cryptic-part-at-the-end-of-a-solidity-contract-bytecode)

[Deconstructing a Solidity Contract — Part VI: The Metadata Hash](https://blog.openzeppelin.com/deconstructing-a-solidity-contract-part-vi-the-swarm-hash-70f069e22aef/)

Basically the trick we can use is to check if the block has a JUMPDEST or not. 
So if there is no JUMPDEST, and the block is not the first block, and is not fallthorugh block from JUMPI it could be removed since it's not reachable.

## Handling the dispatcher
- You can see that the dispatcher is linear. Any block with a offset lower than the first block of RETURN / STOP will be a dispatcher.
- I also got this [hint](https://github.com/ethereum/solidity/blob/0aa85153e56ea6effbf37d6ddde0e0946d6937ab/libsolidity/codegen/ContractCompiler.cpp#L412) from [Tal](https://github.com/thevaizman)


I also found this paper (only partially looked at it), might be worth exploring [STAN: Towards Describing Bytecodes of Smart Contract](https://arxiv.org/pdf/2007.09696.pdf)

*TODO* need to look at some of the output, part of the dispatcher output does not make sense (form multiple functions, but might be some optimization). 

