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
const ONE_FIFTY_RADIANS = 150 * Math.PI / 180;
const ONE_NINTEY_FIVE_RADIANS = 195 * Math.PI / 180;
export type FlowNodePosition = {
    x: number
    y: number
}
type FlowNodeData = {
    label: string
    letter: string
    level: number
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
            parentFlowNode,
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

    /* HORIZONTAL NODE SPACING IDEAS:
        we might not need angle to calculate, if we are going to reconstruct each time
        although it could be more optimal bigO time/space.
    */
    
   adjustByLevel(level: number) {
        const nodesAtLevel: Array<Node> = [];
        const nodesAtOtherLevels: Array<Node> = [];
        this.nodesAndEdges.nodes.forEach(node => {
                if (node.data.level === level) {
                    nodesAtLevel.push(this.nodesAndEdges.flowNodeMap[Number(node.id)]);
                } else {
                    nodesAtOtherLevels.push(this.nodesAndEdges.flowNodeMap[Number(node.id)])
                }
        });
       console.log('NODES AT LEVEL: ', nodesAtLevel);
        const nodesAtLevelSortedByXCoord = this.sortNodesByXCoord(nodesAtLevel);
        if (nodesAtLevelSortedByXCoord.length > 1) {
            let endIdx = nodesAtLevelSortedByXCoord.length - 1;
            let startIdx = 0;
            while (startIdx < endIdx) {
                nodesAtLevelSortedByXCoord[startIdx].position.x -= 150;
                nodesAtLevelSortedByXCoord[endIdx].position.x += 150;
                endIdx--;
                startIdx++;
            }
        }
        this.nodesAndEdges.nodes = nodesAtLevelSortedByXCoord.concat(nodesAtOtherLevels);
    }
    sortNodesByXCoord(nodes: Array<Node>): Array<Node> {
        return nodes.map(node => {
            return this.nodesAndEdges.flowNodeMap[Number(node.id)];
        })
        .sort((a, b) => a.position.x - b.position.x);
    }
    // 
    // resetTrieNodes() {
    //     this.getTrieNodes(this.root);
    // }
    // getTrieNodes(node: TrieNode) {
    //     this.nodesAndEdges.addTrieNode(node);
    //     for (const letter in node.children) {
    //         this.getTrieNodes(node.children[letter]);
    //     }
    //     return;
    // }
// 

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
        numChildren: number
    ): FlowNode {
        const parentPosition = parentFlowNode == null ?
            { x: 0, y: 0 } :
            parentFlowNode.position;
        const nodeLevel = node.level;
        
        const nextAngle = this.calculateNextAngle(numChildren, numChild);
            console.log('node: ', node.letter, ' angle: ', (nextAngle * 180/Math.PI));
        
        return new FlowNode(
            node.id.toString(),
            {
                label: node.letter,
                letter: node.letter,
                level: node.level,
            },
            this.calculateNodeCoordinates(nodeLevel, numChildren, nextAngle, parentPosition),
        );
    }
    calculateNextAngle(childNum: number, numChildren: number): number{
        return childNum * ONE_FIFTY_RADIANS / numChildren + ONE_NINTEY_FIVE_RADIANS;
    }
    calculateNodeCoordinates(level: number, numChildren: number, angle: number, prevPosition: XYCoord): XYCoord {
        // console.log('ANGLE: ', angle);
        const x = numChildren === 1 ?
            prevPosition.x :
            Math.floor(Math.cos(angle) * 20) + prevPosition.x; 
        // console.log('Math.sin(angle)', Math.sin(angle), 'Math.cos(angle)', Math.cos(angle));
        const nextPosition = { x: x, y: prevPosition.y + 50 };
        console.log('NEXT POSITION: ', nextPosition);
        return nextPosition;
    }
}