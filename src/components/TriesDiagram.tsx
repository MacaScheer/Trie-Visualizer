import { ReactFlow, Controls, Background, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../App.css'
import { FunctionComponent, useState} from 'react';
import { Trie } from '../lib/Trie';
import { WORDS } from '../lib/Constants';
import { DiagramNode } from './DiagramNode';
type TrieProps = {
    trie: Trie,
}

export const TriesDiagram: FunctionComponent<TrieProps> = ({trie}) => {
    const nodeTypes = { diagramNode: DiagramNode };
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
        const words = trie.wordsWithPrefix(prefixToSearch, trie.root);
        setWords(words);
        trie.getGraph();
        resetNodeAndEdges();
        return words;
    }
    console.log('nodes: ', trie.getNodes().map(n => n));
   
        
    const addTestWords = () => {
        WORDS.forEach(w => trie.addWord(w));
        resetNodeAndEdges();
}
    /*
    NOW NODES ARE NOT always BEING PLACED WHERE THEIR POSITIONS INDICATE.
    NODES AND THEIR POSITIONS PROPS GET UPDATED PROPERLY.
    */ 
    
    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div id="tries-film-insert" className='triesFilmInsert'>
                <div className="tries-add-add-wordlist">
                    <button type="button" id="tries-add-add-wordlist-button" onClick={() => addTestWords()}>add word set</button>
                </div>
                <input id="tries-type-word-input" placeholder="word to insert" type="text" onChange={e => setWordToInsert(e.target.value)} />
                <button type="button" id="tries-add-add-word-button" onClick={() => updateTrie(wordToInsert)}>add custom word</button>
                <input placeholder="prefixes" type="text" onChange={e => setPrefixToSearch(e.target.value)} />
                <button id='tries-search-prefixes' onClick={() => searchWithPrefix()}>search with prefix</button>
                <>
                    <ul>
                        {words.map((word, i) => <li key={i}>{word}</li>)}
                    </ul>
                </>
            </div>
            <div className='flowTriesContainer'>
                <ReactFlow fitView nodes={nodes} edges={edges} nodeTypes={nodeTypes}>
                    <Background />
                    <Controls showInteractive={false} />
                </ReactFlow>
            </div>
        </div>
    );           
}