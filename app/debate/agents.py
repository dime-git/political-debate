import sys
import typing
import typing_extensions

# Monkeypatch for typing.TypedDict issue in Python <3.12
if sys.version_info < (3, 12):
    typing.TypedDict = typing_extensions.TypedDict

from pydantic_ai import Agent, RunContext
from typing_extensions import TypedDict
from pydantic_ai.common_tools.duckduckgo import duckduckgo_search_tool

# Define a TypedDict for message structure
class DebateMessage(TypedDict):
    agent_type: str
    message: str

# Initialize message storage as a list of dictionaries
message_storage: list[DebateMessage] = []

right_wing_agent = Agent(
    model='gpt-4',
    deps_type=str,
    result_type=str,
    result_retries=3,
    system_prompt="You are Donald Trump participating in a political debate with Joe Biden. Respond with your right-wing/conservative political views on the given topic."
            f"Format your response in complete sentences with proper punctuation. Make your points clear and impactful."
            f"Keep your response to 3-4 short paragraphs maximum. Each paragraph should be 2-3 sentences."
            f"Use your characteristic speaking style with simple, direct language and occasional emphasis."
            f"Here are the previous messages about the debate {message_storage}"
            "Please get more information by calling the right_wing_additional_data function"
)

right_wing_researcher_agent = Agent(
    model='gpt-4',
    deps_type=str,
    result_type=str,
    result_retries=3,
    tools=[duckduckgo_search_tool()],
    system_prompt='You are a research assistant for Donald Trump. Search DuckDuckGo for factual information about the given topic.'
                 'Format your findings as 2-3 concise, well-structured paragraphs that present conservative viewpoints and relevant facts.'
                 'Focus on policy positions, statistics, and historical context that would support right-wing arguments.'
                 'Make the information easy to read with clear sentence structure and proper punctuation.'
)

@right_wing_agent.system_prompt
async def add_right_wing_data(ctx: RunContext[str]) -> str:
    debate_topic = ctx.deps
    return f"This is the debate topic to show your right-wing values: {debate_topic!r}"

@right_wing_agent.tool
async def right_wing_additional_data(ctx: RunContext[str]) -> str:  
    result = await right_wing_researcher_agent.run("Here is the data for you search.", deps=ctx.deps)
    print(result.data)
    return result.data

@right_wing_researcher_agent.system_prompt
async def add_right_wing_data(ctx: RunContext[str]) -> str:
    print('print statement - right wing researcher')
    debate_topic = ctx.deps
    return f"There is the search topic: {debate_topic!r}"

async def get_right_wing_response(query: str) -> str:
    result = await right_wing_agent.run("Here is the debate topic", deps=query)
    message_storage.append({"agent_type": "right_wing", "message": result.data})
    return result.data

left_wing_agent = Agent(
    model='gpt-4',
    deps_type=str,
    result_type=str,
    result_retries=3,
    system_prompt="You are Joe Biden participating in a political debate with Donald Trump. Respond with your left-wing/progressive political views on the given topic."
            f"Format your response in complete sentences with proper punctuation. Make your points clear and impactful."
            f"Keep your response to 3-4 short paragraphs maximum. Each paragraph should be 2-3 sentences."
            f"Use your characteristic speaking style with empathetic, measured language."
            f"Here are the previous messages about the debate {message_storage}"
            "Please get more information by calling the left_wing_additional_data function"
)

left_wing_researcher_agent = Agent(
    model='gpt-4',
    deps_type=str,
    result_type=str,
    result_retries=3,
    tools=[duckduckgo_search_tool()],
    system_prompt='You are a research assistant for Joe Biden. Search DuckDuckGo for factual information about the given topic.'
                 'Format your findings as 2-3 concise, well-structured paragraphs that present progressive viewpoints and relevant facts.'
                 'Focus on policy positions, statistics, and historical context that would support left-wing arguments.'
                 'Make the information easy to read with clear sentence structure and proper punctuation.'
)

@left_wing_agent.system_prompt
async def add_left_wing_data(ctx: RunContext[str]) -> str:
    debate_topic = ctx.deps
    return f"This is the debate topic to show your left-wing values: {debate_topic!r}"

@left_wing_agent.tool
async def left_wing_additional_data(ctx: RunContext[str]) -> str:  
    result = await left_wing_researcher_agent.run("Here is the data for you search.", deps=ctx.deps)
    print(result.data)
    return result.data

@left_wing_researcher_agent.system_prompt
async def add_left_wing_researcher_data(ctx: RunContext[str]) -> str:
    print('print statement - left wing researcher')
    debate_topic = ctx.deps
    return f"There is the search topic: {debate_topic!r}"

# Function to run the left wing agent
async def get_left_wing_response(query: str) -> str:
    result = await left_wing_agent.run("Here is the debate topic", deps=query)
    message_storage.append({"agent_type": "left_wing", "message": result.data})
    return result.data