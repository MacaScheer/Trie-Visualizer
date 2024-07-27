import type { Node, Edge } from '@xyflow/react';
import { XYCoord } from './Trie';

export type NodeGraph = {
    [x: number] : XYCoord
}

export class FlowNodesAndEdges {
    nodes: Array<Node>;
    edges: Array<Edge>;
    nodeGraph: NodeGraph;
    constructor() {
        this.edges = [];
        this.nodes = [];
        this.nodeGraph = {};
    }
    addNode(node: Node) {
        this.nodes.push(node);
        this.nodeGraph[node.position.x] = node.position;
    }
    addEdge(edge: Edge) {
        this.edges.push(edge);
    }
    clearNodesAndEdges() {
        this.edges = [];
        this.nodes = [];
    }
}