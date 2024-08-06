import './App.css'
import { TriesDiagram } from './components/TriesDiagram';

import { Trie } from './lib/Trie';

function App() {
  const trie = new Trie(0);
  return (
    <div className="appMain">
      <TriesDiagram trie={trie} />
    </div>
  )
}

export default App;
