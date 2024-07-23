import {FlowNodePosition, Trie} from './Trie';
/*
This module works to space out the trie branches and nodes appropriately.

Previously, I attempted to calculate note position by
dividing up π radians by the number of child nodes, and then caluculating x and y by cos/sin * constant
This was buggy, and doesn't account for child nodes further down on other branches which could overlap
so we should map levels, across all trie branches, and number of branches at that level.

we need to traverse the trie, accumulating the number of branches, as we descend from node to all child branches of that node.
*/
export type NodeCoords = {
    [trieId: number]: FlowNodePosition
}
export interface NodeLevels {
    [level: number]: [numBranches: number]
}
export class NodeSpace {
    trie: Trie;
    constructor(trie: Trie){
        this.trie = trie;
    }

}