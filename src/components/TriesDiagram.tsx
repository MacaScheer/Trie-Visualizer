import { ReactFlow, Controls, Background, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../App.css'
import {
    FunctionComponent,
    useMemo,
    useState
} from 'react';
import { Trie } from '../lib/Trie';
// import { WORDS } from '../lib/Constants';
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
    const resetNodeAndEdges = (): void => {
        setNodes(trie.getNodes());
        setEdges(trie.getEdges());
    };
    const updateTrie = (word: string): void => {
        trie.addWord(word);
        resetNodeAndEdges();
    };
    const searchWithPrefix = (): void => {
        const words = trie.wordsWithPrefix(prefixToSearch, trie.root);
        setWords(words);
        trie.getGraph();
        resetNodeAndEdges();
    };
    const addTestWords = (): void => {
        const levelOne = 'abcdefghijk';
        levelOne.split('').forEach(w => trie.addWord(w));
        resetNodeAndEdges();
    };
    const adjustNodesAtLevels = (): void => {
        trie.findAndAdjustCoordinatesByLevel();
        trie.getGraph();
        resetNodeAndEdges();
    };
    const clear = (): void => {
        trie.resetRoot();
        trie.clearGraphNodesAndEdges();
        resetNodeAndEdges();
        setWords([]);
    };
    console.log('nodes: ', nodes.map(n => n.data.letter + ':: ' + n.position.x.toString()));

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div id="tries-film-insert" className='triesFilmInsert'>
                <div className="tries-add-add-wordlist">
                    <button type="button" id="tries-add-add-wordlist-button" onClick={() => addTestWords()}>add word set</button>
                    <button id='tries-adjust-levels' onClick={() => adjustNodesAtLevels()}>adjust level</button>
                </div>
                <input id="tries-type-word-input" placeholder="word to insert" type="text" onChange={e => setWordToInsert(e.target.value)} />
                <button type="button" id="tries-add-add-word-button" onClick={() => updateTrie(wordToInsert)}>add custom word</button>
                <input placeholder="prefixes" type="text" onChange={e => setPrefixToSearch(e.target.value)} />
                <button id='tries-search-prefixes' onClick={() => searchWithPrefix()}>search with prefix </button>
                <button id='clear-nodes-and-edges' onClick={() => clear()}>clear nodes and edges</button>
                
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