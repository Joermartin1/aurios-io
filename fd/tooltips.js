(function () {
  const terms = [
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
    { term: 'NDA',                  def: 'Non-Disclosure Agreement — a legal contract requiring the recipient to keep information confidential.' },
    { term: 'LLM',                  def: 'Large Language Model — a foundation AI model trained on vast text datasets. Examples: GPT-4, Gemini, Claude.' },
    { term: 'large language models', def: 'Foundation AI models trained on vast text datasets. Examples: GPT-4, Gemini, Claude.' },
    { term: 'large language model',  def: 'A foundation AI model trained on vast text datasets. Examples: GPT-4, Gemini, Claude.' },
    { term: 'context window',       def: 'The text an AI holds in active memory during one session. When the session ends, the window clears — which is the problem AuriOS™ solves.' },
    { term: 'context windows',      def: 'The text an AI holds in active memory during one session. When the session ends, the window clears — which is the problem AuriOS™ solves.' },
    { term: 'in real time',         def: 'Processed immediately as it happens — no delay between event and system response.' },
    { term: 'natural language',     def: 'Human speech or text, as opposed to programming languages or formal query syntax.' },
    { term: 'semantic search',      def: 'Search that understands meaning and intent, not just matching keywords. Finds relevant results even when exact words differ.' },
    { term: 'Partner AIs',          def: 'AI models (GPT-4, Gemini, Claude, etc.) that AuriOS™ routes queries to on behalf of a Member.' },
    { term: 'Partner AI',           def: 'Any AI model (GPT-4, Gemini, Claude, etc.) that AuriOS™ routes queries to on behalf of a Member.' },
    { term: 'RAG',                  def: 'Retrieval-Augmented Generation — relevant documents are fetched and injected into an AI prompt before generating a response.' },
    { term: 'embeddings',           def: 'Numerical representations of text meaning that enable semantic search — finding content by meaning rather than exact words.' },
    { term: 'embedding',            def: 'Converting text into a numerical representation that captures its meaning, enabling semantic search and similarity matching.' },
    { term: 'vector',               def: 'A numerical representation of meaning. Vectors allow semantic search — finding content by meaning rather than exact words.' },
    { term: 'token',                def: 'A chunk of text (roughly a word or word-fragment) that AI models process. Context windows are measured in tokens.' },
    { term: 'tokens',               def: 'Chunks of text (roughly words or word-fragments) that AI models process. Context windows are measured in tokens.' },
    { term: 'inference',            def: 'The act of an AI model generating a response. Inference is what happens when you send a query and the model produces an answer.' },
    { term: 'fine-tuning',          def: 'Training a pre-built AI model further on specific data to specialize its behavior for a particular use case.' },
    { term: 'open source',          def: 'Software whose source code is publicly available for anyone to inspect, modify, and distribute.' },
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