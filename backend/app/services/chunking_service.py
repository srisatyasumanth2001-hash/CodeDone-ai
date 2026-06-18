import tiktoken

encoder = tiktoken.encoding_for_model("gpt-4o-mini")

def count_tokens(text: str) -> int:
    return len(encoder.encode(text))

def chunk_text(text: str, chunk_size: int= 500, overlap: int = 50) -> list[str]:
    if not text or not text.strip():
        return []
    tokens = encoder.encode(text)
    chunks =[]
    start = 0
    while start < len(tokens):
        end = start+ chunk_size
        chunk_tokens = tokens[start:end]
        chunk_text_str = encoder.decode(chunk_tokens)
        if chunk_text_str.strip():
            chunks.append(chunk_text_str.strip())
        start += (chunk_size-overlap)
        if chunk_size <= overlap:
            break
    return chunks

def chunk_document(document_content: str)-> list[dict]:
    raw_chunks = chunk_text(document_content)
    return [
        {"index":i, "text":chunk}
        for i, chunk in enumerate(raw_chunks)
    ]

