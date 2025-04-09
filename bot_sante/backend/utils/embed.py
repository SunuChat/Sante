from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv

load_dotenv()

embeddings = OpenAIEmbeddings()

def embed_and_store(all_splits):
    vector_store = Chroma(persist_directory="./chroma", embedding_function=embeddings)
    ids = vector_store.add_documents(documents=all_splits)
    return vector_store, ids
