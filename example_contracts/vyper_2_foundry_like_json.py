import sys
import json
import os

lines = []
for line in sys.stdin:
    lines.append(line)


with open(os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    sys.argv[1]
), "w") as file:
    file.write(json.dumps({
        "deployedBytecode": {
            "object": "".join(lines).replace("\n", "")
        }
    }))
