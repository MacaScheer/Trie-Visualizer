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
    const [words, setWords] = useState<Array<string | null>>([]);
    const resetNodeAndEdges = () => {
        setNodes(trie.getNodes());
        setEdges(trie.getEdges());
    }
    const updateTrie = (word: string) => {
        trie.addWord(word);
        resetNodeAndEdges();
    };
    const searchWithPrefix = () => {
        trie.getGraph();
        resetNodeAndEdges();
        const words = trie.wordsWithPrefix(prefixToSearch, trie.root);
        setWords(words);
        trie.getGraph();
        resetNodeAndEdges();
        return words;
    }
    return (
        <>
            <div id="tries-film-insert" className='triesFilmInsert'>
                <input id="tries-type-word-input" placeholder="word to insert" type="text" onChange={e => setWordToInsert(e.target.value)} />
                <button type="button" id="tries-add-add-word-button" onClick={() => updateTrie(wordToInsert)}>add word</button>
                <input placeholder="prefixes" type="text" onChange={e => setPrefixToSearch(e.target.value)} />
                <button id='tries-search-prefixes' onClick={() => searchWithPrefix()}>search with prefix</button>
                <>
                    <ul>
                        {words.map(word => <li>{word}</li>)}
                    </ul>
                </>
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