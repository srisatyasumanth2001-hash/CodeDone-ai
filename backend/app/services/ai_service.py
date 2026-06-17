from openai import OpenAI
from app.core.config import OPENAI_API_KEY
from app.core.prompt import CODING_ASSISTANT_PROMPT, build_file_context_prompt
from typing import Generator

client = OpenAI(api_key = OPENAI_API_KEY)

def build_messages_for_openai(conversation_history:list, new_message:str)-> list:
    messages = []
    messages.append({
        "role" : "system",
        "content": CODING_ASSISTANT_PROMPT
    })

    for msg in conversation_history:
        messages.append({
            "role": msg.role,
            "content" : msg.content
        })

    messages.append({
        "role" :"user",
        "content": new_message
    })
    return messages

def get_ai_response(conversation_history: list, new_message: str)->str:
    messages = build_messages_for_openai(conversation_history, new_message)
    response = client.chat.completions.create(
        model = "gpt-4o",
        messages= messages,
        max_tokens= 2000,
        temperature =  0.7
    )
    return response.choices[0].message.content

def stream_ai_response(conversation_history:list, new_message:str)-> Generator:
    messages = build_messages_for_openai(conversation_history, new_message)
    stream = client.chat.completions.create(
        model = "gpt-4o-mini",
        messages = messages,
        max_tokens = 2000,
        temperature = 0.7,
        stream = True
    )
    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta is not None:
            yield f"data: {delta}\n\n"
    yield "data: [DONE]\n\n"

def generate_conversation_title(first_message:str)-> str:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content" : "Generate a short conversation title (maximum 6 words) based on the user's message. Return only the title, nothing else. No quotes, no punctuation at the end."
            },
            {
                "role": "user",
                "content": first_message
            }
           
        ],
        max_tokens =20,
        temperature = 0.5
    )
    
    return response.choices[0].message.content.strip()

def stream_file_chat_response(
        file_content: str,
        filename :str,
        conversation_history: list,
        new_messages: str
):
    system_prompt = build_file_context_prompt(filename, file_content)
    messages= [{"role": "system", "content": system_prompt}]

    for msg in conversation_history:
        messages.append({"role": msg.role, "content": msg.content})

    messages.append({"role": "user", "content" :new_messages})

    stream = client.chat.completions.create(
        model = "gpt-4o-mini",
        messages = messages,
        max_tokens = 2000,
        temperature = 0.7,
        stream = True
    )

    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta is not None:
            yield f"data: {delta}\n\n"

    yield "data: [DONE]\n\n"
