import { Node, Edge } from '@xyflow/react';
import { FlowNodesAndEdges } from './FlowNodesAndEdges';

export class TrieNode {
    children: ChildNodes = {};
    isTerminal: boolean = false;
    letter: string;
    id: number;
    constructor(letter: string, id: number) {
        this.letter = letter;
        this.id = id;
    }
}
const TOTAL_ANGLE_RADIANS = 135 * Math.PI / 180;
type FlowNodePosition = {
    x: number
    y: number
}
type FlowNodeData = {
    label: string
    letter: string
}
export class FlowNode {
    id: string;
    data: FlowNodeData;
    position: FlowNodePosition;
    type: string;
    constructor(id: string, data: FlowNodeData, position: FlowNodePosition){
        this.id = id;
        this.data = data;
        this.position = position;
        this.type = 'output';
    }
}
export interface ChildNodes {
    [index: string]: TrieNode;
}
export interface FlowNodeGraph {
    [index: number]: FlowNode
}
export type XYCoord = {
    x: number,
    y: number
}
export class Trie {
    lastIdUsed: number;
    root: TrieNode;
    nodesAndEdges: FlowNodesAndEdges;
    // nodeGraph: FlowNodeGraph;

    constructor(num: number | null) {
        this.lastIdUsed = num == null ? 0 : num;
        this.root = new TrieNode('', 0);
        // this.nodeGraph = {}
        this.nodesAndEdges = new FlowNodesAndEdges();
    }
    addWord(word: string) {
        this.clearGraphNodesAndEdges();
        this.insertRecursive(word, this.root);
    }
    showAllWords() {
        return this.wordsWithPrefix('', this.root);
    }
    insertRecursive(word: string, node: TrieNode) {
        if (word.length === 0) {
            node.isTerminal = true;
            return
        }
        const letter = word[0];
        let nextNode;
        if (!node.children[letter]) {
            this.lastIdUsed++;
            nextNode = new TrieNode(letter, this.lastIdUsed);
            node.children[letter] = nextNode
        } else {
            nextNode = node.children[letter]
        }
        if (nextNode != null) {
            this.insertRecursive(word.slice(1), nextNode)
        }
    }
    wordsWithPrefix(prefix: string, node: TrieNode):Array<string> {
        if (prefix.length === 0) {
            const allWords: Array<string> = []
            if (node.isTerminal) allWords.push('')
            for (const letter in node.children) {
                const child = node.children[letter]
                const suffs = this.wordsWithPrefix('', child)
                const words = suffs.map(suf => letter + suf)
                allWords.push(...words)
            }
            return allWords
        } else {
            const letter = prefix[0];
            if (node.children[letter] !== undefined) {
                const suffixes = this.wordsWithPrefix(prefix.slice(1), node.children[letter])
                return suffixes.map(suf => letter + suf);
            } else {
                return []
            }
        }
    }
    getEdges(): Array<Edge> {
        return this.nodesAndEdges.edges;
    }
    getNodes(): Array<Node> {
        return this.nodesAndEdges.nodes;
    }
    clearGraphNodesAndEdges() {
        // this.nodeGraph = {};
        this.nodesAndEdges.clearNodesAndEdges();
    }
    getGraph(
        node: TrieNode, 
        parentFlowNode: FlowNode | null,
        numChild: number | null, 
        numChildren: number | null
    ) {
        console.log('getGraph NODE ID: ', node.id)
        const flowNode: FlowNode = this.createFlowNode(
            parentFlowNode == null ?
            { x: 0, y: 0 } :
            parentFlowNode.position,
            node,
            numChild == null ? 1 : numChild,
            numChildren == null ? 1 : numChildren,
        );
        this.nodesAndEdges.addNode(flowNode);
        let i = 1;
        for (const letter in node.children) {
            const numSiblings = (Object.keys(node.children)).length;
            const childNode = node.children[letter];
            const edge: Edge = this.createEdge(node, childNode);
            console.log('EDGE: ', edge);
            this.nodesAndEdges.addEdge(edge);   
            this.getGraph(childNode, flowNode, i, numSiblings);
            i++;
        }
      return;
    }
    createEdge(node: TrieNode, childNode: TrieNode): Edge {
        return {
            id: node.id.toString() + '-' + 'edge' + '-' + (childNode.id ?? ''),
            label: node.letter,
            source: node.id.toString(),
            target: childNode.id.toString(),
            // type: 'step'
        };
    }
    createFlowNode(
        parentFlowNodePosition: FlowNodePosition,
        node: TrieNode,
        numChild: number,
        numChildren: number
    ): FlowNode {
        const nextAngle = this.calculateNextAngle(numChildren, numChild);
        console.log('create flow node letter: ', node.letter);
        return new FlowNode(
            node.id.toString(),
            {
                label: node.letter,
                letter: node.letter,
            },
            this.calculateNodeCoordinates(nextAngle, parentFlowNodePosition),
        );
        
    }
    calculateNextAngle(childNum: number, numChildren: number): number{
        if (numChildren === 1){
            return 0;
        }
        return Math.floor(TOTAL_ANGLE_RADIANS / numChildren) * childNum;
    }
    calculateNodeCoordinates(angle: number, prevPosition: XYCoord): XYCoord {
        return {x: Math.floor(Math.sinh(angle) * 100) + prevPosition.x, y: Math.floor(Math.cosh(angle) * 100) + prevPosition.y};
    }

}