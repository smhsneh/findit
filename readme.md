<div align="center">

<br/>

# findit

**intelligent document search engine**

*index, parse, and retrieve information across your personal documents instantly.*

<br/>

![react](https://img.shields.io/badge/React-20232a?style=flat-square&logo=react&logoColor=61dafb)
![nodejs](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![tailwindcss](https://img.shields.io/badge/TailwindCSS-0f172a?style=flat-square&logo=tailwindcss&logoColor=38bdf8)
![mongodb](https://img.shields.io/badge/MongoDB-47a248?style=flat-square&logo=mongodb&logoColor=white)

<br/>

**[live](https://finditbysneh.vercel.app)**

<br/>

</div>

---

## what is findit?

most desktop search tools scan files linearly : slow, dumb, and keyword-dependent. findit takes a different approach.
it builds a **custom inverted index** over your documents the moment you upload them, so every search query returns results in milliseconds regardless of how many documents you have. on top of that, a **tf-idf relevance scoring system** with **porter stemming** ranks results by actual relevance not just presence.
upload a pdf, search for "manager", and findit matches documents containing "management" too. that's the stemmer at work.

> built without elasticsearch or any external search service. the entire indexing and retrieval engine is hand-rolled.

---

## how it works

### indexing pipeline
```
upload document
    → extract raw text (pdf-parse / mammoth)
    → tokenize + normalize
    → remove stop words
    → apply porter stemming  ← reduces words to their root form
    → update inverted index in MongoDB
    → update term postings map with TF-IDF scores
```

### search pipeline
```
user query
    → stem query terms
    → look up terms in inverted index
    → score documents using TF-IDF weights
    → return ranked results with highlighted previews
```

### why inverted index?

a traditional search scans every document for every query — O(n) per search. an inverted index flips this: it maps each word to the documents containing it, making lookups O(1). findit builds this index at upload time so search is always instant.

### why tf-idf?

not all word matches are equal. "the" appearing in a document means nothing; "deadlock" appearing rarely across documents means a lot. tf-idf weights terms by how frequently they appear in a document vs. how rare they are globally — surfacing genuinely relevant results over noise.

### the stemming trade-off

porter stemming handles morphological variants: "running" → "run", "management" → "manag". this means searching "manager" finds "management" docs automatically.

the limitation: it only works for words that share a spelling root. searching "supervise" won't find "management" docs because the spellings are unrelated. this is a known limitation of classical NLP — the next evolution would be vector embeddings for semantic search.

---

## features

- **multi-format parsing** — pdf, docx, and txt support via pdf-parse and mammoth
- **inverted index architecture** — hand-built, no elasticsearch or algolia
- **tf-idf relevance scoring** — results ranked by actual document relevance
- **porter stemming** — morphological matching beyond exact keywords
- **real-time highlighting** — matched terms highlighted in document preview
- **autocomplete + search history** — recent queries surfaced as you type
- **indexed dictionary view** — visualize the full term → document mapping
- **multi-tenant isolation** — strict per-user data separation via mongodb
- **jwt authentication** — protected routes and api endpoints throughout

---

## tech stack

| layer | tech |
|---|---|
| frontend | React, Tailwind CSS |
| backend | Node.js, Express.js |
| database | MongoDB Atlas, Mongoose |
| document parsing | pdf-parse, mammoth |
| auth | bcrypt, JWT |
| deployment | Vercel (client), Render (server) |

---

## local setup

```bash
# 1. clone the repo
git clone https://github.com/smhsneh/findit.git
cd findit

# 2. start the backend
cd server
npm install
# create .env with MONGODB_URI and JWT_SECRET
npm run dev

# 3. start the frontend
cd ../client
npm install
npm run dev
```

---

## future scope

- **semantic search** — vector embeddings + MongoDB Atlas Vector Search for meaning-based retrieval, addressing the stemming limitation above
- **LLM integration** — document summarization and Q&A over indexed content
- **OCR support** — image and scanned document ingestion
- **collaborative workspaces** — shared document pools with access control
- **advanced filters** — date range, file type, tag-based filtering

---

## author

built by **smhsneh** — designed to solve the problem of slow, manual file searching by engineering a fast, intelligent indexing system from first principles.
