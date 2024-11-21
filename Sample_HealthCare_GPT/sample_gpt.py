# from openai import OpenAI

# client = OpenAI()

# # Make the API call
# response = client.chat.completions.create(
#     messages=[{
#         "role": "user",
#         "content": "Tell me something cool",
#     }],
#     model="gpt-3.5-turbo",
# )

# # Extract and print just the assistant's response content
# assistant_message = response.choices[0].message.content
# print(assistant_message)



import json
import os
from openai import OpenAI

# initializing OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Load the MRF data from JSON
with open('samples.json', 'r') as file:
    cost_data = json.load(file)

# function to find and format cost information for the procedure and provider
def get_cost_info(procedure, provider, user_quote=None):
    
    # Find matching entry in the data
    matching_entries = [entry for entry in cost_data if entry['procedure'].lower() == procedure.lower() and entry['provider'].lower() == provider.lower()]
    
    # if theres no matching entry there sno data to base off of
    if not matching_entries:
        return f"No cost data available for {procedure} at {provider}."
    
    # get the first matching entry
    entry = matching_entries[0]
    avg_cost = entry['average_cost']
    min_cost = entry['min_cost']
    max_cost = entry['max_cost']
    
    # Prepare response text based on user's quote
    if user_quote:
        if user_quote < avg_cost:
            cost_feedback = f"The quote of ${user_quote} is below the average cost of ${avg_cost}."
        elif user_quote > avg_cost:
            cost_feedback = f"The quote of ${user_quote} is above the average cost of ${avg_cost}."
        else:
            cost_feedback = f"The quote of ${user_quote} matches the average cost of ${avg_cost}."
    else:
        cost_feedback = "Please provide a quote to compare with the average cost."
    
    # Return structured information
    return {
        "avg_cost": avg_cost,
        "min_cost": min_cost,
        "max_cost": max_cost,
        "feedback": cost_feedback
    }

# Chatbot function that generates a prompt based on the user's input
def respond_to_query(procedure, provider, user_quote=None):
    # Get cost info for the specific procedure and provider
    cost_info = get_cost_info(procedure, provider, user_quote)
    
    # Check if we got a valid response
    if isinstance(cost_info, str):
        return cost_info
    
    # Construct the prompt for the assistant
    prompt = f"""
    You are an AI healthcare assistant. You have access to cost data for various procedures from different providers. 
    A user has asked about a {procedure} at {provider}.
    
    Here is the data for this procedure:
    - Provider: {provider}
    - Procedure: {procedure}
    - Average Cost: ${cost_info['avg_cost']}
    - Minimum Cost: ${cost_info['min_cost']}
    - Maximum Cost: ${cost_info['max_cost']}
    
    User's quote: {user_quote if user_quote else 'Not provided'}
    
    {cost_info['feedback']}
    
    Please provide a detailed response for the user about whether their quote is above, below, or matches the average cost.
    """

    # Make the API call using the new format
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="gpt-3.5-turbo"
    )
    
    # Extract and print just the assistant's response content
    assistant_message = response.choices[0].message.content
    return assistant_message

# Example chatbot interaction
procedure = "tooth implant"
provider = "Kaiser Permanente"
user_quote = 6200

# Run the chatbot response function
print(respond_to_query(procedure, provider, user_quote))
