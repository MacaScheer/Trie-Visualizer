import { ReactFlow, Controls, Background, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../App.css'
import { FunctionComponent, useMemo, useState} from 'react';
import { Trie } from '../lib/Trie';
import { DiagramNode } from './DiagramNode';

type TrieProps = {
    trie: Trie,
}

export const TriesDiagram: FunctionComponent<TrieProps> = ({trie}) => {
    const nodeTypes =
        useMemo(() => (
            { diagramNode: DiagramNode }
        ), []);
    const [wordToInsert, setWordToInsert] = useState<string>('');
    const [nodes, setNodes] = useState<Array<Node>>([]);
    const [edges, setEdges] = useState<Array<Edge>>([]);
    const [prefixToSearch, setPrefixToSearch] = useState<string>('');
    
    const resetNodeAndEdges = () => {
        setNodes(trie.getNodes());
        setEdges(trie.getEdges());
    }
    const updateTrie = (word: string) => {
        trie.addWord(word);
        resetNodeAndEdges();
    };
    const searchWithPrefix = (): Array<string> => {
        trie.changeNodeColors(prefixToSearch);
        trie.getGraph();
        resetNodeAndEdges();
        return trie.wordsWithPrefix(prefixToSearch, trie.root);
    }
    return (
        <>
            <div className='triesFilmInsert'>
                <input placeholder="Film Name" type="text" onChange={e => setWordToInsert(e.target.value)} />
                <button name="add name" onClick={() => updateTrie(wordToInsert)}>add word</button>
                <input placeholder="Search Prefixes" type="text" onChange={e => setPrefixToSearch(e.target.value)} />
                <button name="add name" onClick={() => searchWithPrefix()}>search with prefix</button>
            </div>
            <div className='flowTriesContainer'>
                <ReactFlow fitView nodes={nodes} edges={edges} nodeTypes={nodeTypes}>
                    <Background />
                    <Controls showInteractive={false} />
                </ReactFlow>
            </div>
        </>
    );           
}