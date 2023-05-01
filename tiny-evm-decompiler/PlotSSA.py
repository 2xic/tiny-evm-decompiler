import graphviz
import json
import sys

def map_block(block_entry):
    address = hex(block_entry["address"])
    mnemonic = block_entry["mnemonic"]
    return f"{address}: {mnemonic} \\l"

if __name__ == "__main__":
    name = "ssa" if len(sys.argv) == 1 else sys.argv[1]
    cfg = None
    with open("ssa.json", "r") as file:
        cfg = json.load(file)

    dot = graphviz.Digraph(comment='ssa', format='png')

    for i in cfg:
        block_of_code = "".join(list(map(map_block, i["block"])))
        dot.node(i["name"], block_of_code, shape="box")

    for i in cfg:
        from_node = i["name"]
        # TODO: Should instead have this metadata in the json output
        is_jumpi = (2 == len(i["calls"]))
        for to_node in i["calls"]:
            if is_jumpi:
                if hex(i["endAddress"]) == "0x" + to_node:
                    dot.edge(from_node, to_node, color="red", label="f")
                else:
                    dot.edge(from_node, to_node, color="green", label="t")
            else:
                dot.edge(from_node, to_node)

    dot.render(name, cleanup=True)
