.PHONY: build build_vyper

# 
#build:
#	forge build --out $(PWD) --contracts $(PWD)/example/

build_no_optimization:
	forge build --out $(PWD) --optimizer-runs 0 --contracts $(PWD)/example/

build_vyper:
	vyper --no-optimize -f bytecode_runtime ./example_vyper/counter.vy | python3 vyper_2_foundry_like_json.py counter.vy/Counter.json
