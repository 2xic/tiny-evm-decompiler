import sys
import json
import os
import glob

path = os.path.join(
    os.path.dirname(os.path.abspath(__name__)),
    "*.sol/*.json"
)
for i in glob.glob(path):
    data = None
    with open(i, "r") as file:
        data = json.loads(file.read())["deployedBytecode"]["object"].replace("0x", "")

    bin_i = i.replace(".json", ".bin")
    with open(bin_i, "w") as file:
        file.write(data)
    
