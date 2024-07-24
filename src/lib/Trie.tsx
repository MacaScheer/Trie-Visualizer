import { Node, Edge } from '@xyflow/react';
import { FlowNodesAndEdges } from './FlowNodesAndEdges';

export class TrieNode {
    children: ChildNodes = {};
    isTerminal: boolean = false;
    letter: string;
    level: number;
    id: number;
    constructor( id: number, letter: string, level: number) {
        this.letter = letter;
        this.level = level;
        this.id = id;
    }
}
const ONE_EIGHTY_RADIANS = Math.PI;
export type FlowNodePosition = {
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
    trieNodes: Array<TrieNode | null>;
    constructor(id: number | null) {
        this.lastIdUsed = id == null ? 0 : id;
        this.root = new TrieNode(0, '<>', 0);
        this.nodesAndEdges = new FlowNodesAndEdges();
        this.trieNodes = [];
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
            nextNode = new TrieNode(this.lastIdUsed, letter, node.level + 1);
            node.children[letter] = nextNode
        } else {
            nextNode = node.children[letter]
        }
        this.insertRecursive(word.slice(1), nextNode)
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
        this.nodesAndEdges.clearNodesAndEdges();
    }
    getGraph(
        node: TrieNode, 
        parentFlowNode: FlowNode | null,
        numChild: number | null, 
        numChildren: number | null
    ) {
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
            this.nodesAndEdges.addEdge(edge);   
            this.getGraph(childNode, flowNode, i, numSiblings);
            i++;
        }
      return;
    }

    /* SPACING IDEAS:
        we might not need angle to calculate, if we are going to reconstruct each time
        although it could be more optimal bigO time/space.
    */
    resetTrieNodes() {
        this.getTrieNodes(this.root);
    }
    getTrieNodes(node: TrieNode) {
        this.nodesAndEdges.addTrieNode(node);
        for (const letter in node.children) {
            this.getTrieNodes(node.children[letter]);
        }
        return;
    }
// 

    createEdge(node: TrieNode, childNode: TrieNode): Edge {
        return {
            id: node.id + '::' + node.letter + '-' + 'edge' + '-' + (childNode.letter ?? ''),
            source: node.id.toString(),
            target: childNode.id.toString(),
        };
    }
    createFlowNode(
        parentFlowNodePosition: FlowNodePosition,
        node: TrieNode,
        numChild: number,
        numChildren: number
    ): FlowNode {
        console.log('LETTER: ', node.letter, 'child num: ', numChild, ' num children: ', numChildren);
        const nextAngle = this.calculateNextAngle(numChildren, numChild);
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
        return ONE_EIGHTY_RADIANS * ((childNum / numChildren) + .5);
    }
    calculateNodeCoordinates(angle: number, prevPosition: XYCoord): XYCoord {
        console.log('ANGLE: ', angle);
        console.log('Math.sin(angle)', Math.sin(angle), 'Math.cos(angle)', Math.cos(angle));
        return {x: Math.floor(Math.sin(angle) * 20) + prevPosition.x, y: prevPosition.y + 50};
    }
}