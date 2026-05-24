(function () {
  const terms = [

    // — AuriOS™ System Terms —
    { term: 'AISP™',                def: 'AI Service Provider — the category AuriOS™ defines. As ISPs provided internet access, AISPs provide personal AI infrastructure.' },
    { term: 'AISP',                 def: 'AI Service Provider — the category AuriOS™ defines. As ISPs provided internet access, AISPs provide personal AI infrastructure.' },
    { term: 'MEIL™',                def: 'Memory Entity Infrastructure Layer — the cooperative infrastructure operated by Custos Aurum™ on behalf of Members.' },
    { term: 'MEIL',                 def: 'Memory Entity Infrastructure Layer — the cooperative infrastructure operated by Custos Aurum™ on behalf of Members.' },
    { term: 'PAIPy™',               def: 'Personal AI Interface Protocol (pronounced "pappy") — the open standard that connects any device or service to your personal AI layer.' },
    { term: 'PAIPy',                def: 'Personal AI Interface Protocol (pronounced "pappy") — the open standard that connects any device or service to your personal AI layer.' },
    { term: 'MQI™',                 def: 'Memory Query Interface — the structured API through which external services access AuriOS™ Member memory at Member-defined disclosure levels.' },
    { term: 'MQI',                  def: 'Memory Query Interface — the structured API through which external services access AuriOS™ Member memory at Member-defined disclosure levels.' },
    { term: 'CIIM™',                def: 'Career Industry Intelligence Monitor — tracks industry signals relevant to a Member\'s professional domain.' },
    { term: 'CIIM',                 def: 'Career Industry Intelligence Monitor — tracks industry signals relevant to a Member\'s professional domain.' },
    { term: 'IBT Mode™',            def: 'Intelligent Blended Thinking — sends a single query to all active Partner AIs simultaneously and synthesizes the best combined response.' },
    { term: 'IBT Mode',             def: 'Intelligent Blended Thinking — sends a single query to all active Partner AIs simultaneously and synthesizes the best combined response.' },
    { term: 'IRT',                  def: 'In Real Time — memory updates and session events in AuriOS™ happen instantly, not on a delay.' },
    { term: 'YOU Inventory',        def: 'AuriOS™\'s structured record of everything known about a Member — preferences, history, relationships, domain expertise, and more.' },
    { term: 'Grounded Extraction',  def: 'AuriOS™\'s process of pulling verifiable facts from a Member\'s own documents and conversations directly into long-term memory.' },
    { term: 'L1 Hot Tier',          def: 'Active working memory — the most recent, fastest-access layer of AuriOS™ memory. Used for current session context.' },
    { term: 'L2 Warm Tier',         def: 'Recent but not active memory — retrieved quickly when needed. Bridges hot and cold storage.' },
    { term: 'L3 Cold Tier',         def: 'Long-term archival memory — stores older accumulated history. Slower to retrieve but permanently retained.' },
    { term: 'Partner AIs',          def: 'AI models (GPT-4, Gemini, Claude, etc.) that AuriOS™ routes queries to on behalf of a Member.' },
    { term: 'Partner AI',           def: 'Any AI model (GPT-4, Gemini, Claude, etc.) that AuriOS™ routes queries to on behalf of a Member.' },
    { term: 'ReAct pattern',        def: 'Reason + Act — an agent architecture where the AI alternates between reasoning steps and taking real-world actions.' },

    // — AI & Technical Terms —
    { term: 'large language models', def: 'Foundation AI models trained on vast text datasets. Examples: GPT-4, Gemini, Claude.' },
    { term: 'large language model',  def: 'A foundation AI model trained on vast text datasets. Examples: GPT-4, Gemini, Claude.' },
    { term: 'LLM',                  def: 'Large Language Model — a foundation AI model trained on vast text datasets. Examples: GPT-4, Gemini, Claude.' },
    { term: 'context windows',      def: 'The text an AI holds in active memory during one session. When the session ends, the window clears — the core problem AuriOS™ solves.' },
    { term: 'context window',       def: 'The text an AI holds in active memory during one session. When the session ends, the window clears — the core problem AuriOS™ solves.' },
    { term: 'Transformer',          def: 'The neural network architecture underlying all modern AI models including GPT, Gemini, and Claude. Introduced in 2017.' },
    { term: 'transformer',          def: 'The neural network architecture underlying all modern AI models including GPT, Gemini, and Claude. Introduced in 2017.' },
    { term: 'neural networks',      def: 'Computing systems loosely modeled on the human brain — layers of connected nodes that learn patterns from examples.' },
    { term: 'neural network',       def: 'A computing system loosely modeled on the human brain — layers of connected nodes that learn patterns from examples.' },
    { term: 'deep learning',        def: 'A branch of machine learning using multi-layer neural networks capable of learning complex patterns from large datasets.' },
    { term: 'backpropagation',      def: 'The algorithm that trains neural networks — calculating errors and adjusting connection weights backward through the network.' },
    { term: 'self-attention',       def: 'The mechanism in transformer models that lets every word in a sentence relate to every other word simultaneously.' },
    { term: 'semantic search',      def: 'Search that understands meaning and intent, not just matching keywords. Finds relevant results even when exact words differ.' },
    { term: 'hybrid search',        def: 'Combining keyword search and semantic search to get both exact matches and meaning-based results.' },
    { term: 'embeddings',           def: 'Numerical representations of text meaning that enable semantic search — finding content by meaning rather than exact words.' },
    { term: 'embedding',            def: 'Converting text into a numerical representation that captures its meaning, enabling semantic search and similarity matching.' },
    { term: 'vector',               def: 'A numerical representation of meaning. Vectors allow semantic search — finding content by meaning rather than exact words.' },
    { term: 'tokens',               def: 'Chunks of text (roughly words or word-fragments) that AI models process. Context windows are measured in tokens.' },
    { term: 'token',                def: 'A chunk of text (roughly a word or word-fragment) that AI models process. Context windows are measured in tokens.' },
    { term: 'RAG',                  def: 'Retrieval-Augmented Generation — relevant documents are fetched and injected into an AI prompt before generating a response.' },
    { term: 'fine-tuning',          def: 'Training a pre-built AI model further on specific data to specialize its behavior for a particular use case.' },
    { term: 'inference',            def: 'The act of an AI model generating a response. Inference is what happens when you send a query and the model produces an answer.' },
    { term: 'hallucination',        def: 'When an AI generates confident but factually incorrect information — a known limitation of current language models.' },
    { term: 'Hallucination',        def: 'When an AI generates confident but factually incorrect information — a known limitation of current language models.' },
    { term: 'emergent capabilities', def: 'Abilities that appear in large AI models that weren\'t explicitly trained for — surprising even the researchers who built them.' },
    { term: 'emergent capability',  def: 'An ability that appears in a large AI model that wasn\'t explicitly trained for — surprising even the researchers who built it.' },
    { term: 'Constitutional AI',    def: 'Anthropic\'s safety technique — training AI using a written set of principles rather than relying solely on human ratings.' },
    { term: 'RLHF',                 def: 'Reinforcement Learning from Human Feedback — humans rate AI responses to guide the model toward better, safer behavior.' },
    { term: 'open source',          def: 'Software whose source code is publicly available for anyone to inspect, modify, and distribute.' },
    { term: 'natural language',     def: 'Human speech or text, as opposed to programming languages or formal query syntax.' },
    { term: 'in real time',         def: 'Processed immediately as it happens — no delay between event and system response.' },

    // — Internet & History Terms —
    { term: 'ARPA',                 def: 'Advanced Research Projects Agency — the U.S. government body that funded early internet and AI research, later renamed DARPA.' },
    { term: 'DARPA',                def: 'Defense Advanced Research Projects Agency — the U.S. government body that funded early internet and AI research.' },
    { term: 'ARPANET',              def: 'The precursor to the internet, built by ARPA in the late 1960s to connect university and military research computers.' },
    { term: 'TCP/IP',               def: 'The foundational communication protocols of the internet. TCP ensures data integrity; IP handles addressing and routing.' },
    { term: 'IoT',                  def: 'Internet of Things — physical devices (thermostats, cars, sensors) connected to and communicating over the internet.' },
    { term: 'HIPAA',                def: 'Health Insurance Portability and Accountability Act — U.S. law governing medical data privacy and security standards.' },
    { term: 'NDA',                  def: 'Non-Disclosure Agreement — a legal contract requiring the recipient to keep information confidential.' },

  ];

  const css = `
    .auri-tip {
      border-bottom: 1px dashed var(--gold, #F5A623);
      cursor: help;
      position: relative;
    }
    .auri-tip::after {
      content: attr(data-tip);
      position: absolute;
      bottom: calc(100% + 10px);
      left: 50%;
      transform: translateX(-50%);
      background: var(--navy, #0D1F5C);
      color: #fff;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.74rem;
      font-weight: 400;
      line-height: 1.55;
      padding: 10px 14px;
      width: 260px;
      text-align: left;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s ease;
      z-index: 9999;
      white-space: normal;
    }
    .auri-tip::before {
      content: '';
      position: absolute;
      bottom: calc(100% + 4px);
      left: 50%;
      transform: translateX(-50%);
      border: 6px solid transparent;
      border-top-color: var(--navy, #0D1F5C);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s ease;
      z-index: 9999;
    }
    .auri-tip:hover::after,
    .auri-tip:hover::before { opacity: 1; }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function processTextNode(node) {
    let html = node.textContent;
    let modified = false;

    for (const { term, def } of terms) {
      const escaped = escapeRegex(term);
      const regex = new RegExp('(?<![\\w])(' + escaped + ')(?![\\w™])', 'gi');
      if (regex.test(html)) {
        const safedef = def.replace(/"/g, '&quot;');
        html = html.replace(
          new RegExp('(?<![\\w])(' + escaped + ')(?![\\w™])', 'gi'),
          (match) => `<span class="auri-tip" data-tip="${safedef}">${match}</span>`
        );
        modified = true;
      }
    }

    if (modified) {
      const wrapper = document.createElement('span');
      wrapper.innerHTML = html;
      node.parentNode.replaceChild(wrapper, node);
    }
  }

  function walkAndProcess(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const tag = node.parentElement?.tagName?.toLowerCase();
        if (!tag) return NodeFilter.FILTER_REJECT;
        if (['script','style','code','pre','sup','nav'].includes(tag)) return NodeFilter.FILTER_REJECT;
        if (node.parentElement?.classList?.contains('auri-tip')) return NodeFilter.FILTER_REJECT;
        if (node.textContent.trim().length < 3) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(processTextNode);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const content = document.querySelector('.fd-content') || document.body;
    walkAndProcess(content);
  });
})();
