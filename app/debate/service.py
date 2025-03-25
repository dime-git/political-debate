from app.debate.agents import right_wing_agent, left_wing_agent, message_storage
from app.database import store_debate

async def analyze_profile(query: str) -> dict:
    result_right = await right_wing_agent.run("Here is the debate topic", deps=query)
    message_storage.append({"agent_type": "right_wing", "message": result_right.data})
    
    result_left = await left_wing_agent.run("Here is the debate topic", deps=query)
    message_storage.append({"agent_type": "left_wing", "message": result_left.data})

    # Format response
    results = {"Donald Trump thoughts 🧠:": result_right.data, 'Joe Biden thoughts 🧠: ' : result_left.data}
    
    # Store in Supabase
    try:
        await store_debate(
            query=query,
            right_response=result_right.data,
            left_response=result_left.data
        )
        print("Debate stored successfully in Supabase")
    except Exception as e:
        print(f"Error storing debate in Supabase: {e}")
        
    return results