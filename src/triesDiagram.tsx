import { ReactFlow, Controls, Background, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css'
import { FunctionComponent, useState} from 'react';
import { Trie } from './lib/Trie';

type TrieProps = {
    trie: Trie,
}

export const TriesDiagram: FunctionComponent<TrieProps> = ({trie}) => {
    const [wordToInsert, setWordToInsert] = useState<string>('');
    const [nodes, setNodes] = useState<Array<Node>>([]);
    const [edges, setEdges] = useState<Array<Edge>>([]);

    const updateTrie = (word: string) => {
        trie.addWord(word);
        trie.getGraph(trie.root, null, 1, 1);
        setNodes(trie.getNodes());
        setEdges(trie.getEdges());
    };

    return (
        <>
            <div className='triesFilmInsert'>
                <input placeholder="Film Name" type="text" onChange={e => setWordToInsert(e.target.value)} />
                <button name="add name" onClick={() => updateTrie(wordToInsert)}>Add Word </button>
            </div>
            <div className='flowTriesContainer'>
                <ReactFlow fitView nodes={nodes} edges={edges}>
                    <Background />
                    <Controls showInteractive={false} />
                </ReactFlow>
            </div>
        </>
    );           
}