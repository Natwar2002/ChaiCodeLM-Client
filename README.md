# 📘 ChaiCode LM – Frontend

The **Frontend** of ChaiCode LM–like app provides an intuitive and interactive user interface to upload knowledge sources, query the system, and receive AI-powered responses.  
It connects with the backend via **REST APIs** and **Socket.IO** for real-time communication, enabling a seamless chat-like experience.

---

## 🚀 Features

- 📂 **Multi-source Data Upload**  
  Upload documents (PDF, DOC/DOCX, PPTX, JSON, TXT) and URLs (websites, YouTube transcripts) to be indexed.

- 💬 **AI Chat Interface**  
  Ask questions in natural language and get context-aware responses from your uploaded knowledge base.

- 🔎 **Real-time Retrieval**  
  Queries are matched with vector embeddings in **Qdrant** and top relevant chunks are streamed back to the UI.

- ⚡ **Socket.IO Integration**  
  Two-way communication with the backend for **real-time chat updates**.

- 🎨 **Modern UI/UX**  
  Built with **React + TailwindCSS + shadcn/ui**, optimized for clean and minimal dark theme.

- 📊 **Source Highlighting**  
  Responses include citations and references to the original uploaded content.

---

## 🛠️ Tech Stack

- **Framework:** React + Vite  
- **Styling:** TailwindCSS, shadcn/ui, Framer Motion  
- **State Management:** Zustand / Redux (based on your implementation)  
- **Communication:** REST API + Socket.IO  
- **Icons & Components:** Lucide Icons, HeroUI (if applicable)

---

## ⚙️ Setup Guide

### 1. Clone the Repository
```bash
git clone https://github.com/Natwar2002/ChaiCodeLM-Client.git

cd ChaiCodeLM-Client

npm install

npm run dev