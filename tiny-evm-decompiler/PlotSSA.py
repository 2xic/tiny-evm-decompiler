import graphviz
import json
import sys

name = "ssa" if len(sys.argv) == 1 else sys.argv[1]
cfg = None
with open("ssa.json", "r") as file:
    cfg = json.load(file)

def map_block(block_entry):
    address = ""# hex(block_entry["offset"])
    mnemonic = block_entry["mnemonic"]
#    opcode_arguments = block_entry["opcode"]["arguments"]
    arguments = ""
 #   if len(opcode_arguments):
 #       arguments = "0x" + "".join(list(map(lambda x: x[2:], opcode_arguments)))
    arguments += "\\l"

    return f"{address} {mnemonic} {arguments}"


dot = graphviz.Digraph(comment='ssa', format='png')

for i in cfg:
    block_of_code = "".join(list(map(map_block, i["block"])))
    dot.node(i["name"], block_of_code, shape="box")

dot.render(name, cleanup=True)
