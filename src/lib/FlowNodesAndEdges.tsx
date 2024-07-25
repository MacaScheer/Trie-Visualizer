import type { Node, Edge } from '@xyflow/react';
// import type {TrieNode} from './Trie';

export class FlowNodesAndEdges {
    nodes: Array<Node>;
    // trieNodes: Array<TrieNode>;
    edges: Array<Edge>;
    flowNodeMap: {[id: number]: Node};
    constructor() {
        this.edges = [];
        this.nodes = [];
        this.flowNodeMap = {};
        // this.trieNodes = [];
    }
    addNode(node: Node) {
        this.nodes.push(node);
        this.flowNodeMap[Number(node.id)] = node;
    }
    addEdge(edge: Edge) {
        this.edges.push(edge);
    }
    // addTrieNode(node: TrieNode) {
    //     this.trieNodes.push(node);
    // }
    clearNodesAndEdges() {
        this.edges = [];
        this.nodes = [];
        // this.trieNodes = [];
    }



    // adjustByLevel(level: number) {
    //     const nodesAtLevel: Array<Node> = [];
    //     const nodesAtOtherLevels: Array<Node> = [];
    //     this.trieNodes.forEach(node => {
    //             if (node.level === level) {
    //                 nodesAtLevel.push(this.flowNodeMap[node.id]);
    //             } else {
    //                 nodesAtOtherLevels.push(this.flowNodeMap[node.id])
    //             }
    //     });
    //     const nodesAtLevelSortedByXCoord = this.sortNodesByXCoord(nodesAtLevel);
    //     if (nodesAtLevelSortedByXCoord.length > 1) {
    //         let endIdx = nodesAtLevelSortedByXCoord.length - 1;
    //         let startIdx = 0;
    //         while (startIdx > endIdx) {
    //             nodesAtLevelSortedByXCoord[startIdx].position.x -= 25;
    //             nodesAtLevelSortedByXCoord[endIdx].position.x += 25;
    //             endIdx--;
    //             startIdx++;
    //         }
    //     }
    //     this.nodes = nodesAtLevelSortedByXCoord.concat(nodesAtOtherLevels);
    // }
    // sortNodesByXCoord(nodes: Array<Node>): Array<Node> {
    //     return nodes.map(node => {
    //         return this.flowNodeMap[Number(node.id)];
    //     })
    //     .sort((a, b) => a.position.x - b.position.x);
    // }
    // findMedianNode(nodes: Array<Node>): number {
    //         return nodes[Math.floor(nodes.length / 2)].id;
    // }
}