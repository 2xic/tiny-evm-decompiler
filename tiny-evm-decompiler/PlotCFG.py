import graphviz
import json
import sys
from Get4ByteName import find_signature


def map_block(block_entry):
    address = hex(block_entry["offset"])
    mnemonic = block_entry["opcode"]["mnemonic"]
    opcode_arguments = block_entry["opcode"]["arguments"]
    arguments = opcode_arguments

    return f"{address} {mnemonic} {arguments} \\l"

def create_function_table():
    table = [
        "{",
        "Functions"
    ]
    for i in cfg["functions"]:
        if 1 < len(table):
            table.append("|")
        signature = find_signature(str(i["value"]))
        if "raw" in signature:
            table.append(signature["raw"])
        else:
            table.append(signature["text_signature"])
    table.append("}")
    print(table)
    return " ".join(table)

if __name__ == "__main__":
    name = "cfg" if len(sys.argv) == 1 else sys.argv[1]
    cfg = None
    with open("cfg.json", "r") as file:
        cfg = json.load(file)

    dot = graphviz.Digraph(comment='cfg', format='png')
    if len(cfg["functions"]):
        dot.node(
            "Node A", 
            shape="record", 
            label=create_function_table(),
            pos='0, 0'
        )
    dot.attr(label="(Gray background means the block is part of the function dispatcher)", labelloc="t")
    graph = cfg["graph"]

    for i in graph:
        block_of_code = "".join(list(map(map_block, i["block"])))
        is_path_of_dispatcher = i.get("isPartOfDispatcher", False)
        print(i["name"], is_path_of_dispatcher)

        if is_path_of_dispatcher:
            dot.node(i["name"], block_of_code, shape="box", fontcolor="black", fillcolor="#dbdbdb", style="filled")
        else:
            dot.node(i["name"], block_of_code, shape="box")

    for i in graph:
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
