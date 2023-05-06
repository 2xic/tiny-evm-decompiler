import graphviz
import json
import sys
from PlotCFG import plot_cfg

if __name__ == "__main__":
    name = sys.argv[1]
    first_cfg = sys.argv[2]
    second_cfg = sys.argv[3]

    dot = graphviz.Digraph(comment='cfg', format='png')
    with dot.subgraph(name="cluster_outside1") as outside1:
        outside1.attr(label=name)

        for entry in [first_cfg, second_cfg]:
            print(entry)
            cfg = None
            with open(entry, "r") as file:
                cfg = json.load(file)
            graph = cfg["graph"]

            with outside1.subgraph(name="cluster_" + entry) as inside2:
                inside2.attr(label=entry, labelloc="t")
                graph = cfg["graph"]

                plot_cfg(inside2, graph, entry)

    dot.render(name, cleanup=True)
