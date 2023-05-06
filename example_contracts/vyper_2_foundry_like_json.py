import sys
import json
import os

lines = []
for line in sys.stdin:
    lines.append(line)

file_path = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    sys.argv[1]
)
os.makedirs(
    os.path.dirname(file_path),
    exist_ok=True
)
with open(file_path, "w") as file:
    file.write(json.dumps({
        "deployedBytecode": {
            "object": "".join(lines).replace("\n", "")
        }
    }))
