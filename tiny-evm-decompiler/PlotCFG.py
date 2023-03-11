import graphviz
import json

cfg = None
with open("cfg.json", "r") as file:
    cfg = json.load(file)

def map_block(block_entry):
    address = hex(block_entry["offset"])
    mnemonic = block_entry["opcode"]["mnemonic"]
    opcode_arguments = block_entry["opcode"]["arguments"]
    arguments = ""

    step_size = 6
    if step_size < len(opcode_arguments):
        for index, i in enumerate(opcode_arguments):
            if index > 1:
                arguments += " "
            if index % step_size == 0 and index > 0:
                if index == step_size:
                    arguments += "\\l"                
                else:
                    arguments += "\n"
            arguments += i
    else:
        arguments = " ".join(opcode_arguments) + "\\l"

    return f"{address} {mnemonic} {arguments}"


dot = graphviz.Digraph(comment='cfg', format='png')
for i in cfg:
    block_of_code = "".join(list(map(map_block, i["block"])))
    print(i["name"])
    if 0 < len(i["properties"]):
        dot.node(i["name"], block_of_code, color="red", shape="box", width="5")
    else:
        dot.node(i["name"], block_of_code, shape="box")

for i in cfg:
    from_node = i["name"]
    for to_node in i["calls"]:
        print((from_node, to_node))
        dot.edge(from_node, to_node)
dot.render('cfg')
