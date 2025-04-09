import os
from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.chains import RetrievalQA

load_dotenv()

embeddings = OpenAIEmbeddings()
llm = ChatOpenAI()


vectordb = Chroma(persist_directory="./chroma", embedding_function=embeddings)
retriever = vectordb.as_retriever()

retrievalQA = RetrievalQA.from_llm(llm=llm, retriever=retriever)

def ask_kb(query):
    """Pose une question au modèle RAG et récupère une réponse en français."""
    sources = vectordb.similarity_search(query, k=5)
    response = retrievalQA(query)
    return response["result"], sources
