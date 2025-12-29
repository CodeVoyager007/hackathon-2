from sqlmodel import Session, select
from src.models.chat import Conversation, Message, Role
import uuid
from openai import OpenAI
from src.core.config import settings
from src.services.tools import TaskTools
import json
from datetime import datetime

class ChatService:
    """
    Stateless Chat Service implementing the Phase III Conversation Flow.
    """
    def __init__(self, session: Session):
        self.session = session
        self.client = OpenAI(
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
            api_key=settings.GEMINI_API_KEY
        )
        self.model = "gemini-2.5-flash"

    async def process_message(self, user_id: str, message: str, conversation_id: uuid.UUID = None):
        # 1. Handle Conversation ID & History
        if conversation_id:
            conversation = self.session.get(Conversation, conversation_id)
            if not conversation or conversation.user_id != user_id:
                conversation = Conversation(user_id=user_id)
        else:
            conversation = Conversation(user_id=user_id)
        self.session.add(conversation)
        self.session.commit()
        self.session.refresh(conversation)
        conv_id = conversation.id

        # 2. Fetch History
        statement = select(Message).where(Message.conversation_id == conv_id).order_by(Message.created_at)
        db_messages = self.session.exec(statement).all()
        history = [{"role": m.role, "content": m.content} for m in db_messages]
        
        # 3. Build message array for agent
        system_prompt = {
            "role": "system", 
            "content": (
                "You are a helpful Todo AI Assistant. Your primary goal is to help users manage their tasks. "
                "Infer task details like priority, due date (in ISO 8601 format), and tags from the user's message. "
                "Today's date is " + datetime.now().strftime('%Y-%m-%d') + ". "
                "**Crucially, if the user wants to update, delete, or complete a task by name, you MUST first use the 'list_tasks' tool with the 'title' parameter to find the task's ID.** "
                "If you find one task, use its ID for the action. If you find multiple or no tasks, ask the user for clarification. "
                "Always confirm your actions."
            )
        }
        agent_messages = [system_prompt] + history + [{"role": "user", "content": message}]
        
        # 4. Store user message
        user_msg = Message(conversation_id=conv_id, user_id=user_id, role=Role.user.value, content=message)
        self.session.add(user_msg)
        self.session.commit()

        # 5. Run agent with MCP tools
        tools_impl = TaskTools(self.session, user_id)
        
        tools = [
            {
                "type": "function",
                "function": {
                    "name": "add_task",
                    "description": "Create a new task with details.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "title": {"type": "string", "description": "The task title"},
                            "description": {"type": "string", "description": "Optional details"},
                            "priority": {"type": "string", "enum": ["low", "medium", "high"], "description": "Task priority"},
                            "due_date": {"type": "string", "format": "date-time", "description": "Due date in ISO 8601 format"},
                            "tags": {"type": "array", "items": {"type": "string"}, "description": "List of tags"}
                        },
                        "required": ["title"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "list_tasks",
                    "description": "Retrieve tasks, optionally filtering by title or status.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "status": {"type": "string", "enum": ["all", "pending", "completed"], "default": "all"},
                            "title": {"type": "string", "description": "A search term to filter tasks by title."}
                        }
                    }
                }
            },
            { "type": "function", "function": { "name": "complete_task", "description": "Mark a task as complete by ID.", "parameters": {"type": "object", "properties": { "task_id": {"type": "string"}},"required":["task_id"]}}},
            { "type": "function", "function": { "name": "delete_task", "description": "Delete a task by ID.", "parameters": {"type": "object", "properties": { "task_id": {"type": "string"}},"required":["task_id"]}}},
            { "type": "function", "function": { "name": "update_task", "description": "Modify a task's title or description by ID.", "parameters": {"type": "object", "properties": { "task_id": {"type": "string"}, "title": {"type": "string"}, "description": {"type": "string"}},"required":["task_id"]}}}
        ]

        final_response = ""
        invoked_tools = []
        while True:
            completion = self.client.chat.completions.create(model=self.model, messages=agent_messages, tools=tools)
            resp_msg = completion.choices[0].message
            agent_messages.append(resp_msg)

            if resp_msg.tool_calls:
                for tool_call in resp_msg.tool_calls:
                    func_name = tool_call.function.name
                    args = json.loads(tool_call.function.arguments)
                    invoked_tools.append({"tool": func_name, "args": args})
                    
                    result = {"error": "Tool not found"}
                    if hasattr(tools_impl, func_name):
                        result = getattr(tools_impl, func_name)(**args)
                    
                    agent_messages.append({"role": "tool", "tool_call_id": tool_call.id, "content": json.dumps(result)})
            else:
                final_response = resp_msg.content
                break
        
        asst_msg = Message(conversation_id=conv_id, user_id=user_id, role=Role.assistant.value, content=final_response)
        self.session.add(asst_msg)
        self.session.commit()
        
        return final_response, conv_id, invoked_tools