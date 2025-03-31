from app.debate.agents import right_wing_agent, left_wing_agent, message_storage
from app.database import store_debate
import traceback

async def analyze_profile(query: str) -> dict:
    try:
        print(f"Starting debate analysis for query: {query}")
        
        # Try to get right wing response
        try:
            print("Getting right wing response...")
            result_right = await right_wing_agent.run("Here is the debate topic", deps=query)
            message_storage.append({"agent_type": "right_wing", "message": result_right.data})
            right_response = result_right.data
        except Exception as right_error:
            print(f"Error getting right wing response: {str(right_error)}")
            right_response = "I apologize, but I'm unable to provide a response at this time due to technical difficulties."
        
        # Try to get left wing response
        try:
            print("Getting left wing response...")
            result_left = await left_wing_agent.run("Here is the debate topic", deps=query)
            message_storage.append({"agent_type": "left_wing", "message": result_left.data})
            left_response = result_left.data
        except Exception as left_error:
            print(f"Error getting left wing response: {str(left_error)}")
            left_response = "I apologize, but I'm unable to provide a response at this time due to technical difficulties."

        # Format response
        results = {"Donald Trump thoughts 🧠:": right_response, 'Joe Biden thoughts 🧠: ' : left_response}
        
        # Store in Supabase
        try:
            await store_debate(
                query=query,
                right_response=right_response,
                left_response=left_response
            )
            print("Debate stored successfully in Supabase")
        except Exception as e:
            print(f"Error storing debate in Supabase: {str(e)}")
            print(traceback.format_exc())
            # Continue even if storage fails
        
        return results
    except Exception as e:
        print(f"Critical error in analyze_profile: {str(e)}")
        print(traceback.format_exc())
        # Return a graceful error response instead of re-raising
        return {
            "Donald Trump thoughts 🧠:": "I apologize, but I'm unable to provide a response at this time due to technical difficulties.",
            "Joe Biden thoughts 🧠: ": "I apologize, but I'm unable to provide a response at this time due to technical difficulties."
        }