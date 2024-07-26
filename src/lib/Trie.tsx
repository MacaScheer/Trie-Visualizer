import { Node, Edge } from '@xyflow/react';
import { FlowNodesAndEdges } from './FlowNodesAndEdges';
import { ONE_FIFTY_RADIANS, ONE_NINETY_FIVE_RADIANS, TWO_SEVENTY_RADIANS, GREEN, RED } from './Constants';

export class TrieNode {
    children: ChildNodes = {};
    color: string;
    isTerminal: boolean = false;
    letter: string;
    level: number;
    id: number;
    constructor(id: number, letter: string, level: number) {
        this.letter = letter;
        this.level = level;
        this.id = id;
        this.color = GREEN;
    }
}
export type FlowNodePosition = {
    x: number
    y: number
}
type FlowNodeData = {
    label: string
    letter: string
    level: number
    color: string
}
export class FlowNode {
    id: string;
    data: FlowNodeData;
    position: FlowNodePosition;
    type: string = 'diagramNode';
    constructor(id: string, data: FlowNodeData, position: FlowNodePosition){
        this.id = id;
        this.data = data;
        this.position = position;
    }
}
export interface ChildNodes {
    [index: string]: TrieNode;
}
export type XYCoord = {
    x: number,
    y: number
}
export class Trie {
    lastIdUsed: number;
    root: TrieNode;
    nodesAndEdges: FlowNodesAndEdges;
    constructor(id: number | null) {
        this.lastIdUsed = id == null ? 0 : id;
        this.root = new TrieNode(0, '<>', 0);
        this.nodesAndEdges = new FlowNodesAndEdges();
    }
    addWord(word: string) {
        this.clearGraphNodesAndEdges();
        this.insertRecursive(word, this.root);
        this.getGraph();
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
            nextNode = new TrieNode(this.lastIdUsed, letter, node.level + 1);
            node.children[letter] = nextNode;
        } else {
            nextNode = node.children[letter];
        }
        this.insertRecursive(word.slice(1), nextNode);
    }
    wordsWithPrefix(prefix: string, node: TrieNode):Array<string> {
        node.color = RED;
        if (prefix.length === 0) {
            const allWords: Array<string> = [];
            if (node.isTerminal) allWords.push('');
            for (const letter in node.children) {
                const child = node.children[letter];
                const suffs = this.wordsWithPrefix('', child);
                const words = suffs.map(suf => letter + suf);
                allWords.push(...words);
            }
            return allWords;
        } else {
            const letter = prefix[0];
            if (node.children[letter] !== undefined) {
                const suffixes = this.wordsWithPrefix(prefix.slice(1), node.children[letter]);
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
        this.nodesAndEdges.clearNodesAndEdges();
    }
    getGraph() {
        this.clearGraphNodesAndEdges();
        this.getGraphRecursive(this.root, null, 1, 0);
    }
    getGraphRecursive(
        node: TrieNode, 
        parentFlowNode: FlowNode | null,
        numChild: number | null, 
        numSiblings: number | null
    ) {
        const flowNode: FlowNode = this.createFlowNode(
            parentFlowNode,
            node,
            numChild == null ? 1 : numChild,
            numSiblings == null ? 1 : numSiblings,
        );
        this.nodesAndEdges.addNode(flowNode);
        let i = 1;
        for (const letter in node.children) {
            const numChildren = (Object.keys(node.children)).length;
            const childNode = node.children[letter];
            const edge: Edge = this.createEdge(node, childNode);
            this.nodesAndEdges.addEdge(edge);   
            this.getGraphRecursive(childNode, flowNode, i, numChildren);
            i++;
        }
      return;
    }
    createEdge(node: TrieNode, childNode: TrieNode): Edge {
        return {
            id: node.id + '::' + node.letter + '-' + 'edge' + '-' + (childNode.letter ?? ''),
            source: node.id.toString(),
            target: childNode.id.toString(),
        };
    }
    createFlowNode(
        parentFlowNode: FlowNode | null,
        node: TrieNode,
        numChild: number,
        numSiblings: number
    ): FlowNode {
        const parentPosition = parentFlowNode == null ?
            { x: 0, y: 0 } :
            parentFlowNode.position;
        const nextAngle = this.calculateNextAngle(numChild, numSiblings);
        return new FlowNode(
            node.id.toString(),
            {
                color: node.color,
                label: node.letter,
                letter: node.letter,
                level: node.level,
            },
            this.calculateNodeCoordinates(numSiblings, nextAngle, parentPosition),
        );
    }
    calculateNextAngle(numChild: number, numSiblings: number): number {
        if (numSiblings === 0){
            return TWO_SEVENTY_RADIANS;
        }
        return numChild * ONE_FIFTY_RADIANS / numSiblings + ONE_NINETY_FIVE_RADIANS;
    }
    calculateNodeCoordinates(numChildren: number, angle: number, prevPosition: XYCoord): XYCoord {
        const x = numChildren === 1 ?
            prevPosition.x :
            Math.floor(Math.cos(angle) * 80) + prevPosition.x; 
        return { x: x, y: prevPosition.y + 50 };
    }
}