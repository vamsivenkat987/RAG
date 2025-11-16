
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import BagOfWords from './bag_of_words.js';

class SemanticSearchEngine {
  constructor() {
    this.bow = new BagOfWords();
    this.vocabulary = [];
  }

  async processDocument(pdfPath) {
    const loader = new PDFLoader(pdfPath);
    const docs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 200,
      chunkOverlap: 40,
    });

    const allSplits = await textSplitter.splitDocuments(docs);
    const allTexts = allSplits.map(split => split.pageContent);

    this.vocabulary = [...new Set(
      allTexts.join(' ').toLowerCase().split(/\s+/).filter(w => w.length > 0)
    )];

    return this.bow.createSearchIndex(allTexts, this.vocabulary);
  }

  search(query, searchIndex) {
    return this.bow.semanticSearch(query, searchIndex, this.vocabulary);
  }
}

class vector_search {
    constructor(file_name, query) {
        this.file_name = file_name;
        this.query = query;
    }

    async get_semanitc_search_values(topK = null) {
        const engine = new SemanticSearchEngine();
        const searchIndex = await engine.processDocument(this.file_name);
        const results = engine.search(this.query, searchIndex);
        // Sort by similarity (highest first) and limit if topK is specified
        const sortedResults = results
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, topK || results.length);
        return sortedResults.map(result => ({
            pageContent: result.text,
            metadata: { 
                source: this.file_name,  // Fixed: was this.document
                similarity: result.similarity 
            }
        }));
    }
}
export default vector_search;
