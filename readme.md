<div align="center">

<br/>

# findit

**intelligent document search engine**

*index, parse, and retrieve information across your personal documents instantly.*

<br/>

![react](https://img.shields.io/badge/react-20232a?style=flat-square&logo=react&logoColor=61dafb)
![nodejs](https://img.shields.io/badge/node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![tailwindcss](https://img.shields.io/badge/tailwind_css-0f172a?style=flat-square&logo=tailwindcss&logoColor=38bdf8)
![mongodb](https://img.shields.io/badge/mongodb-47a248?style=flat-square&logo=mongodb&logoColor=white)

<br/>

[live demo](https://finditbysneh.vercel.app) · [source code](https://github.com/smhsneh/findit)

<br/>

</div>

---

## overview

findit is a full-stack document search engine. users upload pdf, docx, and txt files, and the application indexes them immediately so that any later query is answered from a precomputed index instead of a scan of the raw files.

desktop search tools commonly scan files linearly and match exact keywords, which is slow and misses obvious variants of a term. findit instead builds a custom inverted index at upload time and ranks results with tf-idf relevance scoring and porter stemming. a search for "manager" therefore also returns documents containing "management", and the most relevant documents appear first.

> the indexing and retrieval engine is implemented from scratch. findit does not depend on elasticsearch, algolia, or any other external search service.

---

## features

- **multi-format parsing.** pdf, docx, and txt files are supported through pdf-parse and mammoth.
- **custom inverted index.** the term-to-document mapping is built and maintained by the application itself.
- **tf-idf relevance ranking.** results are ordered by how relevant each document is to the query, not merely by whether it matches.
- **porter stemming.** queries match morphological variants of a word, going beyond exact keywords.
- **match highlighting.** matched terms are highlighted in the document preview.
- **autocomplete and search history.** recent queries are suggested as the user types.
- **indexed dictionary view.** the full term-to-document mapping can be inspected in the interface.
- **multi-tenant isolation.** each user's documents and index data are strictly separated in mongodb.
- **jwt authentication.** all protected routes and api endpoints require a valid token.

---

## how it works

### indexing pipeline

every uploaded document passes through the following stages:

```
upload document
    -> extract raw text (pdf-parse / mammoth)
    -> tokenize and normalize
    -> remove stop words
    -> apply porter stemming (reduce each word to its root form)
    -> update the inverted index in mongodb
    -> update the term postings map with tf-idf scores
```

### search pipeline

every query is processed as follows:

```
user query
    -> stem the query terms
    -> look up each term in the inverted index
    -> score candidate documents using tf-idf weights
    -> return ranked results with highlighted previews
```

---

## design decisions

### why an inverted index

a naive search reads every document for every query, so its cost grows with the total size of the collection. an inverted index reverses the relationship: it maps each term to the list of documents that contain it. a query then performs a dictionary lookup per term, and its cost depends on the length of the matching postings lists rather than on the number of documents stored. findit builds the index at upload time, which moves the expensive work out of the search path.

### why tf-idf

not every word match carries the same weight. a common word such as "the" tells us nothing about a document, while a rare term such as "deadlock" is a strong signal. tf-idf weights each term by how often it appears in a document relative to how rare it is across the whole collection, which brings genuinely relevant documents to the top and suppresses noise.

### the stemming trade-off

porter stemming reduces words to a common root, for example "running" to "run" and "management" to "manag". this is why a search for "manager" finds documents about "management" without any extra configuration.

the limitation is that stemming only connects words that share a spelling root. a search for "supervise" will not find documents about "management", because the two words are unrelated at the character level. this is an inherent limit of classical text processing. the natural next step is semantic search with vector embeddings, described under future scope.

---

## tech stack

| layer | technology |
| :--- | :--- |
| frontend | react, tailwind css |
| backend | node.js, express.js |
| database | mongodb atlas, mongoose |
| document parsing | pdf-parse, mammoth |
| authentication | bcrypt, jwt |
| deployment | vercel (client), render (server) |

---

## getting started

### prerequisites

- node.js and npm
- a mongodb instance, such as a free mongodb atlas cluster

### installation

```bash
# 1. clone the repository
git clone https://github.com/smhsneh/findit.git
cd findit

# 2. start the backend
cd server
npm install
npm run dev

# 3. start the frontend (in a second terminal)
cd client
npm install
npm run dev
```

### configuration

before starting the backend, create a `.env` file in the `server` directory with the following variables:

| variable | description |
| :--- | :--- |
| `MONGODB_URI` | connection string for the mongodb database |
| `JWT_SECRET` | secret used to sign and verify authentication tokens |

---

## limitations

- matching is based on word roots, so synonyms and related concepts with different spellings are not connected.
- scanned documents and images cannot be indexed, because text is extracted directly from the file and no ocr step exists.
- only pdf, docx, and txt files are supported.

---

## future scope

- **semantic search.** vector embeddings with mongodb atlas vector search for meaning-based retrieval, addressing the stemming limitation above.
- **llm integration.** document summarization and question answering over indexed content.
- **ocr support.** ingestion of images and scanned documents.
- **collaborative workspaces.** shared document pools with access control.
- **advanced filters.** filtering by date range, file type, and tags.

---

## author

built by [smhsneh](https://github.com/smhsneh), motivated by the problem of slow, manual file searching and implemented by engineering a fast indexing and ranking system from first principles.
