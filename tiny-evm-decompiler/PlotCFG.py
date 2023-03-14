import graphviz
import json
import sys

name = "cfg" if len(sys.argv) == 1 else sys.argv[1]
cfg = None
with open("cfg.json", "r") as file:
    cfg = json.load(file)

def map_block(block_entry):
    address = hex(block_entry["offset"])
    mnemonic = block_entry["opcode"]["mnemonic"]
    opcode_arguments = block_entry["opcode"]["arguments"]
    arguments = "0x" + "".join(list(map(lambda x: x[2:], opcode_arguments)))
    arguments += "\\l"

    return f"{address} {mnemonic} {arguments}"


dot = graphviz.Digraph(comment='cfg', format='png')
for i in cfg:
    block_of_code = "".join(list(map(map_block, i["block"])))
    print(i["name"])
    #if "HAS_LOG" in i["properties"]:
    #    dot.node(i["name"], block_of_code, color="red", shape="box", width="5")
    #else:
    dot.node(i["name"], block_of_code, shape="box")

for i in cfg:
    from_node = i["name"]
    # TODO: Should instead have this metadata in the json output
    is_jumpi = (2 == len(i["calls"]))
    for to_node in i["calls"]:
        if is_jumpi:
            if hex(i["endAddress"]) == "0x" + to_node:
                dot.edge(from_node, to_node, color="red")
            else:
                dot.edge(from_node, to_node, color="green")
        else:
            dot.edge(from_node, to_node)
dot.render(name, cleanup=True)
