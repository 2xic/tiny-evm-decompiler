export const options = {
    manipulation: false,
    height: "90%",
    layout: {
        hierarchical: {
            enabled: true,
            levelSeparation: 500,
        },
    },
    edges: {
        length: 400 // Longer edges between nodes.
    },
    physics: {
        enabled: false,
        hierarchicalRepulsion: {
            nodeDistance: 500,
        },
        /*
        solver: "repulsion",
        repulsion: {
          nodeDistance: 400,
        },*/
    },
};


export function CreateVizNode({
    id,
    code
}: {
    id: string,
    code: string;
}) {
    return {
        id: id,
        size: 150,
        label: code,
        color: "#FFCFCF",
        shape: "box",
        font: { face: "monospace", align: "left" },
    }
}

export function CreateVizEdge({
    from,
    to
}: {
    from: string;
    to: string;
}) {
    return {
        from,
        to,
        arrows: "to",
        physics: false,
        smooth: { type: "cubicBezier" },
    };
}