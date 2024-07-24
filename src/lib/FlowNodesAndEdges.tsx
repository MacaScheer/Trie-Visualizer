import type { Node, Edge } from '@xyflow/react';
import type {TrieNode, XYCoord } from './Trie';

export class FlowNodesAndEdges {
    nodes: Array<Node>;
    trieNodes: Array<TrieNode>;
    edges: Array<Edge>;
    flowNodeMap: {[id: number]: Node};
    constructor() {
        this.edges = [];
        this.nodes = [];
        this.flowNodeMap = {};
        this.trieNodes = [];
    }
    addNode(node: Node) {
        this.nodes.push(node);
        this.flowNodeMap[Number(node.id)] = node;
    }
    addEdge(edge: Edge) {
        this.edges.push(edge);
    }
    addTrieNode(node: TrieNode) {
        this.trieNodes.push(node);
    }
    clearNodesAndEdges() {
        this.edges = [];
        this.nodes = [];
        this.trieNodes = [];
    }
    adjustByLevel(level: number) {
        const nodeIDsAtLevel: Array<number> = [];
        this.trieNodes.forEach(node => {
                if (node.level === level) {
                    nodeIDsAtLevel.push(node.id);
                }
        });
        const nodesSortedByXCoord = this.sortNodesByXCoord(nodeIDsAtLevel);
        const medianXCoord = this.findMedianXCoord(nodesSortedByXCoord);
        if (nodeIDsAtLevel.length > 1) {
            for (let i = 1; i < nodeIDsAtLevel.length; i++){
                let prevFlowNode = this.flowNodeMap[nodeIDsAtLevel[i - 1]];
                let flowNode = this.flowNodeMap[nodeIDsAtLevel[i]];
                if (Math.abs(prevFlowNode.position.x - flowNode.position.x) < 50) {
                    prevFlowNode.position.x -= 25;
                }
            }
        }
        
    }
    sortNodesByXCoord(nodeIDs: Array<number>): Array<Node> {
        return nodeIDs.map(id => {
            return this.flowNodeMap[id];
        })
        .sort((a, b) => a.position.x - b.position.x);
    }
    findMedianXCoord(nodes: Array<Node>): number {
        const length = nodes.length;
        if (length % 2 === 0) {
            return ((nodes[length / 2].position.x + nodes[(length / 2) - 1].position.x) / 2);
        } else {
            return nodes[length / 2].position.x;
        }
    }
}