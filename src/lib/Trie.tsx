import { Edge, Node } from '@xyflow/react';
import { FlowNodesAndEdges } from './FlowNodesAndEdges';
import { ONE_FIFTY_RADIANS, ONE_NINETY_FIVE_RADIANS, TWO_SEVENTY_RADIANS, GREEN, RED } from './Constants';

export class FlowNode {
    id: string;
    type: string = 'diagramNode';
    position: FlowNodePosition;
    data: FlowNodeData;
    constructor(id: string, position: FlowNodePosition, data: FlowNodeData){
        this.id = id;
        this.data = data;
        this.position = position;
    }
}
export type FlowNodePosition = {
    x: number
    y: number
}
type FlowNodeData = {
    children: FlowNodeGraph;
    color: string
    isTerminal: boolean
    label: string
    letter: string
    level: number
}
export interface FlowNodeGraph {
    [id: string]: FlowNode;
}
export type XYCoord = {
    x: number,
    y: number
}
export type TrieGraphByCoord = {
    [coord: number]: Array<FlowNode>;
}
export class Trie {
    lastIdUsed: number;
    root: FlowNode;
    nodesAndEdges: FlowNodesAndEdges;
    allTrieNodesByID: FlowNodeGraph = {};
    allTrieNodesByX: TrieGraphByCoord = {};
    allTrieNodesByLevel: TrieGraphByCoord = {};
    constructor(id: number | null) {
        this.lastIdUsed = id == null ? 0 : id;
        const rootFlowData = {
            children: {},
            color: GREEN,
            isTerminal: false,
            label: '<>',
            letter: '<>',
            level: 0, 
        }
        this.root = new FlowNode('0', {x:0, y: 0}, rootFlowData);
        this.nodesAndEdges = new FlowNodesAndEdges();
        this.allTrieNodesByID[this.root.id] = this.root;
    }
    addWord(word: string): void {
        this.clearGraphNodesAndEdges();
        this.insertRecursive(word, this.root);
        this.getGraph();
    }
    showAllWords():Array<string> {
        return this.wordsWithPrefix('', this.root);
    }
    insertRecursive(word: string, node: FlowNode): void {
        if (word.length === 0) {
            node.data.isTerminal = true;
            return
        }
        const letter = word[0];
        let nextNode;
        if (!node.data.children[letter]) {
            this.lastIdUsed++;
            nextNode = new FlowNode(
                this.lastIdUsed.toString(),
                { x: 0, y: 0 },
                {
                    children: {},
                    color: GREEN,
                    isTerminal: false,
                    label: letter,
                    letter: letter,
                    level: node.data.level + 1
                },
            );
            if (!this.allTrieNodesByLevel[node.data.level]) {
                this.allTrieNodesByLevel[node.data.level]  = [nextNode];
            } else {
                this.allTrieNodesByLevel[node.data.level].push(nextNode);
            }
            this.allTrieNodesByID[nextNode.id] = nextNode;
            node.data.children[letter] = nextNode;
        } else {
            nextNode = node.data.children[letter];
        }
        this.insertRecursive(word.slice(1), nextNode);
    }
    wordsWithPrefix(prefix: string, node: FlowNode): Array<string> {
        node.data.color = RED;
        if (prefix.length === 0) {
            const allWords: Array<string> = [];
            if (node.data.isTerminal) allWords.push('');
            for (const letter in node.data.children) {
                const child = node.data.children[letter];
                const suffs = this.wordsWithPrefix('', child);
                const words = suffs.map(suf => letter + suf);
                allWords.push(...words);
            }
            return allWords;
        } else {
            const letter = prefix[0];
            if (node.data.children[letter] !== undefined) {
                const suffixes = this.wordsWithPrefix(prefix.slice(1), node.data.children[letter]);
                return suffixes.map(suf => letter + suf);
            } else {
                return []
            }
        }
    }
    resetRoot() {
        const rootFlowData = {
            children: {},
            color: GREEN,
            isTerminal: false,
            label: '<>',
            letter: '<>',
            level: 0, 
        }
        this.root = new FlowNode('0', {x:0, y: 0}, rootFlowData);
    }
    getEdges(): Array<Edge> {
        return this.nodesAndEdges.edges;
    }
    getNodes(): Array<Node> {
        return this.nodesAndEdges.nodes;
    }
    clearGraphNodesAndEdges(): void {
        this.nodesAndEdges.clearNodesAndEdges();
    }
    clearNodesOnly(): void {
        this.nodesAndEdges.nodes = [];
    }
    getGraph(): void {
        this.clearGraphNodesAndEdges();
        this.getGraphRecursive(this.root, null, 1, 0);
        // THIS IS BUGGY
        // this.findAndAdjustCoordinatesByLevel();
        // NEED TO RESET NODES IN this.nodesAndEdges
    }
    getGraphRecursive(
        node: FlowNode, 
        parentFlowNode: FlowNode | null,
        numChild: number, 
        numSiblings: number
    ): void {
        this.addNodePosition(
            parentFlowNode,
            node,
            numChild,
            numSiblings,
        );
        /* adding nodes to objects by id and x-coord */
        if (!this.allTrieNodesByX[node.position.x]) {
            this.allTrieNodesByX[node.position.x] = [node];
        } else {
            this.allTrieNodesByX[node.position.x].push(node);
        }
        if (!this.allTrieNodesByLevel[node.data.level]) {
            this.allTrieNodesByLevel[node.data.level] = [node];
        } else {
            this.allTrieNodesByLevel[node.data.level].push(node);
        }
        this.allTrieNodesByID[node.id] = node;
        this.nodesAndEdges.addNode(node);
        /* */

        let i = 1;
        for (const letter in node.data.children) {
            const numChildren = (Object.keys(node.data.children)).length;
            const childNode = node.data.children[letter];
            const edge: Edge = this.createEdge(node, childNode);
            this.nodesAndEdges.addEdge(edge);   
            this.getGraphRecursive(childNode, node, i, numChildren);
            i++;
        }
      return;
    }
    createEdge(node: FlowNode, childNode: FlowNode): Edge {
        return {
            id: node.id + '::' + node.data.letter + '-' + 'edge' + '-' + (childNode.data.letter ?? ''),
            source: node.id.toString(),
            target: childNode.id.toString(),
        };
    }
    addNodePosition(
        parentFlowNode: FlowNode | null,
        node: FlowNode,
        numChild: number,
        numSiblings: number
    ): void {
        const parentPosition = parentFlowNode == null ?
            { x: 0, y: 0 } :
            parentFlowNode.position;
        const nextAngle = this.calculateNextAngle(numChild, numSiblings);
        const position = this.calculateNodeCoordinates(numSiblings, nextAngle, parentPosition);
        node.position = position;
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
            Math.floor(Math.cos(angle) * 100) + prevPosition.x; 
        return { x: x, y: prevPosition.y + 50 }; //could use y: level * CONST
    }


    findAndAdjustCoordinatesByLevel(): void {
        for (const level in this.allTrieNodesByLevel) {
            const nodesAtLevelSortedbyX = this.allTrieNodesByLevel[level].sort((nodeA, nodeB) => nodeA.position.x - nodeB.position.x)
            const needsRestructure = this.areAnyXCoordsCloseOfNodesAtLevel(nodesAtLevelSortedbyX);
            if (needsRestructure) {
                const medianXCoord = nodesAtLevelSortedbyX[Math.floor(nodesAtLevelSortedbyX.length / 2)].position.x;
                const nodesAtLevel = this.restructureNodePositionByLevel(nodesAtLevelSortedbyX, medianXCoord);
                this.allTrieNodesByLevel[level] = nodesAtLevel;
            }
        }
        this.syncNodesAfterRestructureByLevel();
    }
    syncNodesAfterRestructureByLevel(): void {
        this.clearNodesOnly();
        this.nodesAndEdges.addNode(this.root);
        for (const level in this.allTrieNodesByLevel) {
            for (let i = 0; i < this.allTrieNodesByLevel[level].length; i++){
                this.nodesAndEdges.addNode(this.allTrieNodesByLevel[level][i]);
            }
        }
    }
    restructureNodePositionByLevel(nodes: Array<FlowNode>, medianXCoord: number): Array<FlowNode>{
        console.log('MEDIAN X COORD: ', medianXCoord);
        const medianIdx = Math.floor(nodes.length / 2);
        let h = 1;
        let i = medianIdx - 1;
        let j = medianIdx;
        while (i >= 0 && j < nodes.length) {
            console.log('BEFORE nodes[i].position.x ', nodes[i].position.x);
            console.log('i', i, 'j', j, 'h', h);
            nodes[i].position.x = medianXCoord - (h * 50);
            nodes[j].position.x = medianXCoord + (h * 50);
            console.log('AFTER nodes[j].position.x ', nodes[j].position.x);
            console.log('AFTER nodes[i].position.x ', nodes[i].position.x);

            h++;
            i--;
            j++;
        }
        return nodes;
    }
    areAnyXCoordsCloseOfNodesAtLevel(nodes: Array<FlowNode>): boolean {
        const xCoords = nodes.map(node => node.position.x);
        for (let i = 1; i < xCoords.length; i++){
            if (Math.abs(xCoords[i] - xCoords[i - 1]) <= 50) {
                return true;
            }
        }
        return false;
    }
}