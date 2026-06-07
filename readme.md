<div align="center">

<br/>

# findit

**intelligent document search · inverted indexing**

*a full-stack search engine application for indexing, parsing, and retrieving information across personal documents.*

<br/>

![react](https://img.shields.io/badge/React-20232a?style=flat-square&logo=react&logoColor=61dafb)
![nodejs](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![tailwindcss](https://img.shields.io/badge/TailwindCSS-0f172a?style=flat-square&logo=tailwindcss&logoColor=38bdf8)
![mongodb](https://img.shields.io/badge/MongoDB-47a248?style=flat-square&logo=mongodb&logoColor=white)

<br/>

**[live app](https://finditbysneh.vercel.app)**

<br/>

</div>

---

## overview

**findit** is a full-stack search engine application designed for intelligent document indexing and retrieval. unlike manual desktop searches that scan files linearly and take significant time, findit uses a custom inverted indexing architecture to make finding information across hundreds of documents instantaneous.

the platform features drag-and-drop document uploads, automatic text extraction for pdfs, word documents, and text files, real-time highlighting of search results, and secure multi-tenant user isolation.
---

## features

### document processing
- seamless upload and parsing of pdf, docx, and txt files
- automatic text extraction and tokenization
- smart stop-word removal and data normalization

### intelligent search
- lightning-fast inverted index search architecture
- tf-idf based relevance scoring for accurate results
- contextual highlighting in the document preview pane
- real-time autocomplete and recent search history

### workspace ui
- beautiful frosted glass aesthetic with dark prussian blue theming
- interactive data visualizations and statistics tracking
- full document management dashboard to view and delete files
- centralized indexed dictionary mapping

### security
- strict multi-tenant architecture using mongodb
- secure json web token (jwt) authentication
- protected routes and api endpoints

---

## tech stack

```
react + tailwind css ────────── frontend
node.js + express ───────────── backend api
mongodb atlas + mongoose ────── database and odm
pdf-parse + mammoth ─────────── document parsing algorithms
bcrypt + jwt ────────────────── authentication
```

---

## architecture

### application flow
```text
user → react frontend → express api → text parser → tokenizer → mongodb inverted index
```

### document indexing flow
```text
upload document → extract raw text → tokenize and filter words → update document model → update term postings map
```

### search retrieval flow
```text
search query → api request → lookup terms in index → calculate document relevance → return highlighted preview
```

### authentication flow
```text
login → jwt generated → stored in context → private requests authenticated via bearer token
```

---

## project highlights

- built a custom inverted indexing search engine from scratch without relying on external search services
- implemented complex text parsing algorithms to handle multiple document formats seamlessly
- developed a highly secure multi-tenant database structure ensuring complete data privacy per user
- optimized search retrieval times to practically instantaneous speeds using term posting maps

---

## local setup

### 1. clone the repository
```bash
git clone https://github.com/smhsneh/findit.git
cd findit
```

### 2. start the backend server
```bash
cd server
npm install
# create a .env file with MONGODB_URI and JWT_SECRET
npm run dev
```

### 3. start the frontend client
```bash
cd client
npm install
npm run dev
```

---

## future scope

- llm integration for document summarization and question answering
- support for image and ocr-based document scanning
- collaborative shared document workspaces
- advanced filtering by date, document type, and tags
- keyboard shortcuts and command palette

---

## made by

> **smhsneh** — designed and developed findit to solve the problem of slow, manual file searching by building a blazingly fast, intelligent indexing workspace.
