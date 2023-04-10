# Tiny Evm Decompiler
Simple EVM decompiler written as an exercise, can create a simple CFG and extract LOG arguments.

Uses a SymbolicStack like described in [EtherSolve: Computing an Accurate Control-Flow Graph from Ethereum Bytecode](https://arxiv.org/pdf/2103.09113.pdf)

- See [notes](./notes.md) for recourses and some notes I found helpful while doing this.

- See [example cfgs](./example_cfgs/) for the CFGs generated for the [example contracts](./example_contracts/).

- See [GetLogTopicsInteractor.unit.test.ts](./tiny-evm-decompiler/src/interactors/GetLogTopicsInteractor.unit.test.ts) fro the topic extraction example.

### One example 
![CFG example](./example_cfgs/HelloWorld.png)
