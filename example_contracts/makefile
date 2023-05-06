.PHONY: build build_vyper

build_vyper:
	vyper --no-optimize -f bytecode_runtime ./example_vyper/counter.vy | python3 vyper_2_foundry_like_json.py unoptimized/counter.vy/Counter.json
	vyper --no-optimize -f bytecode_runtime ./example_vyper/hello_world.vy | python3 vyper_2_foundry_like_json.py unoptimized/hello_world.vy/HelloWorld.json
	vyper -f bytecode_runtime ./example_vyper/hello_world.vy | python3 vyper_2_foundry_like_json.py optimized/hello_world.vy/HelloWorld.json

build: 
	forge build --out $(PWD)/optimized/ --optimize --optimizer-runs 200 --contracts $(PWD)/example/
	forge build --out $(PWD)/unoptimized/ --optimizer-runs 0 --contracts $(PWD)/example/
