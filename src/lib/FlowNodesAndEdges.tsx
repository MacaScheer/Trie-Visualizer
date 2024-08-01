import type {Node, Edge } from '@xyflow/react';

export class FlowNodesAndEdges {
    nodes: Array<Node>;
    edges: Array<Edge>;
    constructor() {
        this.edges = [];
        this.nodes = [];
    }
    addNode(
        flowNode: Node,
    ) {
        this.nodes.push(flowNode);
    }
    addEdge(edge: Edge) {
        this.edges.push(edge);
    }
    clearNodesAndEdges() {
        this.edges = [];
        this.nodes = [];
    }
}