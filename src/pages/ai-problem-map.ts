import Sigma from "sigma";
import { EdgeDisplayData, NodeDisplayData } from "sigma/types";
import Graph from "graphology";
import aiProblemMapHtml from "./ai-problem-map.html?raw";

// import data from "../data/graph-data-test.json";
import data from "../data/ai-problem-map.json";

export function render(pageContainer: HTMLElement) {
  // Retrieve some useful DOM elements:
  pageContainer.innerHTML = aiProblemMapHtml;
  const container = document.getElementById("sigma-container") as HTMLElement;

  // Instantiate sigma:
  const graph = new Graph();
  graph.import(data);
  const renderer = new Sigma(graph, container, {
    edgeLabelSize: 10,
    renderEdgeLabels: true,
    defaultEdgeType: "arrow",
    edgeLabelRenderer: (
      context,
      edgeData,
      sourceData,
      targetData,
      settings
    ) => {
      let { label, color, size } = edgeData;
      size = 15;
      const { x: x1, y: y1 } = sourceData;
      const { x: x2, y: y2 } = targetData;

      const dx = x2 - x1;
      const dy = y2 - y1;
      const angle = Math.atan2(dy, dx);

      let x = x1 + dx / 2;
      let y = y1 + dy / 2;

      // Adjust to x and y so that the text is above the line
      x -= 12;
      y -= 12;

      context.save();

      context.translate(x, y);
      context.rotate(angle);
      // Flip the angle so that the text is right side up:
      context.rotate(Math.PI);

      context.font = `${settings.edgeLabelWeight.toLowerCase()} ${size}px ${
        settings.edgeLabelFont
      }`;
      context.fillStyle = color;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(label!, 0, 0);
      context.restore();
    },
    // edgeProgramClasses: {
    //   arrow: 
    // }
  });

  // Type and declare internal state:
  interface State {
    hoveredNode?: string;
    selectedNode?: string;
    hoveredNeighbors?: Set<string>;
  }
  const state: State = {};

  function setHoveredNode(node?: string) {
    if (node) {
      state.hoveredNode = node;
      state.hoveredNeighbors = new Set(graph.neighbors(node));
    } else {
      state.hoveredNode = undefined;
      state.hoveredNeighbors = undefined;
    }

    // Refresh rendering:
    renderer.refresh();
  }

  // Bind graph interactions:
  renderer.on("enterNode", ({ node }) => {
    setHoveredNode(node);
  });
  renderer.on("leaveNode", () => {
    setHoveredNode(undefined);
  });

  // Render nodes accordingly to the internal state:
  // 1. If a node is selected, it is highlighted
  // 2. If there is query, all non-matching nodes are greyed
  // 3. If there is a hovered node, all non-neighbor nodes are greyed
  renderer.setSetting("nodeReducer", (node, data) => {
    const res: Partial<NodeDisplayData> = { ...data };
    res.highlighted = false;
    if (
      state.hoveredNeighbors &&
      !state.hoveredNeighbors.has(node) &&
      state.hoveredNode !== node
    ) {
      res.label = "";
      res.color = "#f6f6f6";
    }

    if (state.selectedNode === node) {
      res.highlighted = true;
    }
    return res;
  });

  renderer.setSetting("edgeReducer", (edge, data) => {
    const res: Partial<EdgeDisplayData> = { ...data };

    if (state.hoveredNode && !graph.hasExtremity(edge, state.hoveredNode)) {
      res.hidden = true;
    } else {
      const label = data.label!;
      res.label = label;
      res.forceLabel = true;
      res.color = "#000000";
      res.zIndex = 100;
    }

    return res;
  });
}
