

function compare(){
    echo $2
    optimized_path=$(echo "$2" | sed "s/unoptimized/optimized/")
    node dist/BuildEtherSolveCFG.js -c $2 -o unoptimized.json
    node dist/BuildEtherSolveCFG.js -c $optimized_path -o optimized.json
    python3 PlotSideBySideCfg.py $1 "unoptimized.json" "optimized.json"
}

function vyper(){
    echo $2
    vyper_path=$(echo "$2" | sed "s/sol/vy/")
    node dist/BuildEtherSolveCFG.js -c $2 -o solc.json
    node dist/BuildEtherSolveCFG.js -c $vyper_path -o vyper.json
    python3 PlotSideBySideCfg.py $1 "solc.json" "vyper.json"
}

npm run build 
compare "../example_cfgs_unoptimized_vs_optimized/hello_world" "../../example_contracts/unoptimized/hello_world.sol/HelloWorld.json"
compare "../example_cfgs_unoptimized_vs_optimized/counter" "../../example_contracts/unoptimized/counter.sol/Counter.json"
compare "../example_cfgs_unoptimized_vs_optimized/multiple_dummy_functions" "../../example_contracts/unoptimized/multiple_functions_dummy_functions.sol/MultipleDummyFunctions.json"
vyper "../example_cfgs_vyper_vs_solc/counter" "../../example_contracts/unoptimized/counter.sol/Counter.json"
vyper "../example_cfgs_vyper_vs_solc/hello_world" "../../example_contracts/unoptimized/hello_world.sol/HelloWorld.json"
vyper "../example_cfgs_vyper_vs_solc/hello_world_optimized" "../../example_contracts/optimized/hello_world.sol/HelloWorld.json"
