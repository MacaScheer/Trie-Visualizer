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
    const updateTrie = (word: string) => {
        trie.addWord(word);
        trie.getGraph(trie.root, null, null, null);
        setNodes(trie.getNodes());
        setEdges(trie.getEdges());
        // trie.resetTrieNodes();
    };

    // 
    const [level, setLevel] = useState<number>(0);
    const adjustNodeLevel = () => {
        trie.adjustByLevel(level);
        setNodes(trie.getNodes());
    }
    // console.log('NODES', nodes);
// 
    return (
        <>
            <div className='triesFilmInsert'>
                <input placeholder="Film Name" type="text" onChange={e => setWordToInsert(e.target.value)} />
                <button name="add name" onClick={() => updateTrie(wordToInsert)}>add word </button>
                {/*  */}
                <input placeholder="Level" type="number" onChange={e => setLevel(Number(e.target.value))} />
                <button name="adjust level" onClick={() => adjustNodeLevel()}>adjust node level </button>
                {/*  */}
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