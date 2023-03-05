import graphviz  
import json

cfg = None
with open("debug_cfg.json", "r") as file:
    cfg = json.load(file)

def map_block(block_entry):
    address = hex(block_entry["offset"])
    mnemonic = block_entry["opcode"]["mnemonic"]
    arguments = " ".join(block_entry["opcode"]["arguments"])

    return f"{address} {mnemonic} {arguments}"

dot = graphviz.Digraph(comment='cfg', format='png')
for i in cfg:
    block_of_code = list(map(map_block, i["block"]))
    if 0 < len(i["properties"]):
        dot.node(i["name"], "\\n".join(block_of_code), color="red")
    else:
        dot.node(i["name"], "\\n".join(block_of_code))

for i in cfg:
    from_node = i["name"]
    for to_node in i["calls"]:
        print((from_node, to_node))
        dot.edge(from_node, to_node)
dot.render('cfg')

