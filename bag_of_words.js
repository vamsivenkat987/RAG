class BagOfWords {

  bagOfWords(text, vocabulary) {
    const words = text.toLowerCase().split(/\s+/);
    return vocabulary.map(word => 
      words.filter(w => w === word).length
    );
  }

  createSearchIndex(documents, vocabulary) {
    const searchIndex = documents.map(doc => ({
      text: doc,
      vector: this.bagOfWords(doc, vocabulary)
    }));
    return searchIndex;
  }

  cosineSimilarity(vec1, vec2) {
    const dotProduct = vec1.reduce((sum, a, i) => sum + a * vec2[i], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, a) => sum + a * a, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, a) => sum + a * a, 0));
    return dotProduct / (magnitude1 * magnitude2);
  }

  semanticSearch(query, searchIndex, vocabulary) {
    const queryVector = this.bagOfWords(query, vocabulary);
    const res1 = searchIndex
      .map(doc => ({
        ...doc,
        similarity: this.cosineSimilarity(queryVector, doc.vector)
      }));
    const res2 = res1.sort((a, b) => b.similarity - a.similarity);
    return res2;
  }
}

// Export the class
export default BagOfWords;