# Semantic Search RAG System

A Retrieval-Augmented Generation (RAG) system that performs semantic search on PDF documents using bag-of-words similarity and LangChain agents.

## Features

- **PDF Document Processing**: Load and split PDF documents into searchable chunks
- **Semantic Search**: Find relevant content using bag-of-words similarity scoring
- **RAG Integration**: Combine retrieval with LLM generation using LangChain agents
- **Configurable Results**: Get top-K most similar results
- **SSL Support**: Works with custom SSL certificates for enterprise environments

## Project Structure

```
semantic_search/
├── bag_of_words.js          # Bag-of-words similarity implementation
├── similarity_search.js     # PDF processing and semantic search engine
├── rag.js                   # RAG system with LangChain integration
├── index.js                 # Basic semantic search example
├── bbl.pdf                  # Sample PDF document
├── oneEGaDCA.crt           # SSL certificate
├── .netrc                   # API credentials (not in repo)
└── package.json             # Dependencies
```

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm

### Install Node.js (Ubuntu/WSL)

```bash
sudo snap install node --classic
export PATH="/snap/bin:$PATH"
echo 'export PATH="/snap/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Install Dependencies

```bash
npm install @langchain/community @langchain/core @langchain/openai
npm install pdf-parse zod netrc-parser
npm install langchain
```

## Configuration

### 1. Create .netrc file

Create a `.netrc` file in the project root:

```
machine llm.model
login your-api-key-here
password https://your-api-endpoint-here
```

### 2. Add SSL Certificate

Place your SSL certificate file (`oneEGaDCA.crt`) in the project root if using custom SSL.

### 3. Create package.json

```json
{
  "type": "module",
  "dependencies": {
    "@langchain/community": "^0.1.0",
    "@langchain/core": "^0.1.0",
    "@langchain/openai": "^0.1.0",
    "langchain": "^0.1.0",
    "pdf-parse": "^1.1.1",
    "zod": "^3.22.0",
    "netrc-parser": "^3.1.6"
  }
}
```

## Usage

### Basic Semantic Search

```javascript
import vector_search from './similarity_search.js';

const searcher = new vector_search("document.pdf", "your search query");
const results = await searcher.get_semanitc_search_values(5); // Get top 5 results
console.log(results);
```

### RAG System with LangChain Agent

```javascript
import Rag from './rag.js';

const rag = new Rag("What is the purpose of the BBL?", "bbl.pdf");
await rag.create_agent();
```

### Running Examples

```bash
# Basic semantic search
node index.js

# RAG system
node rag.js
```

## API Reference

### vector_search Class

#### Constructor
```javascript
new vector_search(file_name, query)
```

#### Methods
- `get_semanitc_search_values(topK)`: Returns top-K most similar document chunks

### Rag Class

#### Constructor
```javascript
new Rag(query, document)
```

#### Methods
- `get_tools()`: Creates LangChain retrieval tool
- `get_model()`: Configures ChatOpenAI model
- `create_agent()`: Creates and runs LangChain agent

## Configuration Options

### Model Configuration
- **Model**: LLaMA3.1-8b (configurable)
- **Temperature**: 0 (deterministic)
- **Max Tokens**: 1000
- **Timeout**: 90 seconds

### Document Processing
- **Chunk Size**: 200 characters
- **Chunk Overlap**: 40 characters
- **Similarity Threshold**: Configurable (default: 0.05)

## Troubleshooting

### SSL Certificate Issues
If you encounter SSL certificate errors, ensure:
<<<<<<< HEAD
1. `oneEGaDCA.crt` is in the project root
=======
1. `oneEGaDCA.crt` is in the project root, add it as  `export NODE_EXTRA_CA_CERTS="oneEGaDCA.crt"`
>>>>>>> c5d4f6d (Add first RAG project commit)
2. `NODE_TLS_REJECT_UNAUTHORIZED=0` is set (handled automatically)

### Module Type Warnings
Add `"type": "module"` to your `package.json` to resolve ES module warnings.

### API Authentication
Verify your `.netrc` file contains correct credentials for the `llm.model` machine.

## Example Output

```
[user]: What is the purpose of the BBL?
-----

[assistant]: I'll call the tool to get more information about the BBL.

Tool call output:
The BBL (Brooklyn Bridge Loop) is a proposed streetcar line in Brooklyn, New York City...

[assistant]: The purpose of the BBL (Brooklyn Bridge Loop) is to provide a new transportation option for residents and visitors, connecting various neighborhoods in Brooklyn and improving connectivity to Manhattan.
-----
```

## License

This project is for educational and research purposes.