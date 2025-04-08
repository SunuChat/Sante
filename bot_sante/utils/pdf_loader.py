from langchain_community.document_loaders import PyPDFDirectoryLoader
import os
from dotenv import load_dotenv

load_dotenv()

def load_kb(KB_PATH="./KB"):

    loader = PyPDFDirectoryLoader(
        path=KB_PATH,
        glob="**/[!.]*.pdf",
        silent_errors=False,
        load_hidden=False,
        recursive=False,
        extract_images=False,
        mode="page",
        headers=None,
        extraction_mode="plain",
        # extraction_kwargs=None,
    )
    docs = loader.load()
    #for file_name, doc_list in docs.items():
    #    print(f"{file_name}: {len(doc_list)} documents loaded")

    return docs
