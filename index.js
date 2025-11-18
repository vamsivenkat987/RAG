import Rag from "./rag.js";

const rag1 = new Rag("What is the segment revenue  value?", "bbl.pdf");
const a = rag1.create_agent();