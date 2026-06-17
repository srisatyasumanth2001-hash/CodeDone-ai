import fitz
from pathlib import Path

def extract_text_from_file(file_path: str, file_extension: str)-> str:
    ext= file_extension.lower()

    if ext == '.pdf':
        return extract_from_pdf(file_path)
    elif ext in {'.txt', '.md', '.json', '.yaml', '.yml', '.html', '.css'}:
        return extract_from_text_file(file_path)
    elif ext in {'.py', '.js', '.ts', '.tsx', '.jsx', '.java', '.cpp',
                  '.c', '.go', '.rs', '.rb', '.php'}:
        return extract_from_code_file(file_path)
    else:
        return extract_from_text_file(file_path)
    
def extract_from_pdf(file_path: str)-> str:
    try:
        doc = fitz.open(file_path)
        text_parts= []
        for pagenum, page in enumerate(doc):
            page_text = page.get_text()
            if page_text.strip():
                text_parts.append(f"---Page {pagenum+1} ---\n{page_text}")
        doc.close()
        full_text ='\n\n'.join(text_parts)

        if not full_text.strip():
            return "No text could be extracted from this PDF. It may be a scanned image PDF."
        return full_text
    except Exception as e:
        return f"Error extracting PDF text : {str(e)}"
    
def extract_from_text_file(file_path: str)-> str:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except UnicodeError:
        try: 
            with open(file_path, 'r', encoding='latin-1') as f:
                return f.read()
        except Exception as e:
            return f"Error reading file: {str(e)}"
        
def extract_from_code_file(file_path: str)-> str: 
    try: 
        filename = Path(file_path).name
        extension= Path(file_path).suffix

        language_map = {
            '.py': 'Python', '.js': 'JavaScript', '.ts': 'TypeScript',
            '.tsx': 'TypeScript React', '.jsx': 'JavaScript React',
            '.java': 'Java', '.cpp': 'C++', '.c': 'C',
            '.go': 'Go', '.rs': 'Rust', '.rb': 'Ruby', '.php': 'PHP'
        }

        language = language_map.get(extension, 'Code')
        
        with open(file_path, 'r', encoding='utf-8') as f:
            code_content = f.read()

        header = f"File: {filename}\nLanguage: {language}\n\n"
        return header + code_content
    except Exception as e:
        return f"Error reading code file: {str(e)}"
    
def count_words(text: str)-> int:
    return len(text.split())
        