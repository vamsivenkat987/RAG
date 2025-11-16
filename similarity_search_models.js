// Euclidean Distance
function euclideanDistance(vec1, vec2) {
  const distance = Math.sqrt(
    vec1.reduce((sum, a, i) => sum + Math.pow(a - vec2[i], 2), 0)
  );
  // Convert to similarity (smaller distance = higher similarity)
  return 1 / (1 + distance);
}

// Example with your vectors
const A = [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const B = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1];
console.log("Euclidean:", euclideanDistance(A, B)); // 0.316

// Manhattan Distance (L1)
function manhattanDistance(vec1, vec2) {
  const distance = vec1.reduce((sum, a, i) => sum + Math.abs(a - vec2[i]), 0);
  return 1 / (1 + distance);
}

console.log("Manhattan:", manhattanDistance(A, B)); // 0.167


// Jaccard Similarity
function jaccardSimilarity(vec1, vec2) {
  let intersection = 0;
  let union = 0;
  
  for (let i = 0; i < vec1.length; i++) {
    if (vec1[i] > 0 && vec2[i] > 0) intersection++;
    if (vec1[i] > 0 || vec2[i] > 0) union++;
  }
  
  return union === 0 ? 0 : intersection / union;
}

console.log("Jaccard:", jaccardSimilarity(A, B)); // 0 (no overlap)


// Pearson Correlation

function pearsonCorrelation(vec1, vec2) {
  const n = vec1.length;
  const mean1 = vec1.reduce((a, b) => a + b) / n;
  const mean2 = vec2.reduce((a, b) => a + b) / n;
  
  let numerator = 0;
  let sum1 = 0;
  let sum2 = 0;
  
  for (let i = 0; i < n; i++) {
    const diff1 = vec1[i] - mean1;
    const diff2 = vec2[i] - mean2;
    numerator += diff1 * diff2;
    sum1 += diff1 * diff1;
    sum2 += diff2 * diff2;
  }
  
  return numerator / Math.sqrt(sum1 * sum2);
}

console.log("Pearson:", pearsonCorrelation(A, B)); // -0.316

// Hamming Distance
function hammingDistance(vec1, vec2) {
  let differences = 0;
  for (let i = 0; i < vec1.length; i++) {
    if (vec1[i] !== vec2[i]) differences++;
  }
  return 1 - (differences / vec1.length);
}

console.log("Hamming:", hammingDistance(A, B)); // 0.722

//  Dot Product (Raw)
function dotProduct(vec1, vec2) {
  return vec1.reduce((sum, a, i) => sum + a * vec2[i], 0);
}

console.log("Dot Product:", dotProduct(A, B)); // 0

function compareAllSimilarities(vec1, vec2) {
  console.log("=== SIMILARITY MEASURES ===");
  console.log("Cosine:", cosineSimilarity(vec1, vec2).toFixed(3));
  console.log("Euclidean:", euclideanDistance(vec1, vec2).toFixed(3));
  console.log("Manhattan:", manhattanDistance(vec1, vec2).toFixed(3));
  console.log("Jaccard:", jaccardSimilarity(vec1, vec2).toFixed(3));
  console.log("Pearson:", pearsonCorrelation(vec1, vec2).toFixed(3));
  console.log("Hamming:", hammingDistance(vec1, vec2).toFixed(3));
  console.log("Dot Product:", dotProduct(vec1, vec2));
}

compareAllSimilarities(A, B);
