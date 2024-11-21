import os
from openai import OpenAI
from cost_data import load_cost_data
from cost_functions import get_cost_info

# initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def respond_to_query(procedure, provider, user_quote=None):
    # Load the cost data
    cost_data = load_cost_data()

    # Get cost info for the specific procedure and provider
    cost_info = get_cost_info(cost_data, procedure, provider, user_quote)
    
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
    
    Please provide a detailed response for the user about whether their quote is above, below, or matches the average cost. And tell me some other providers they can look at that give them reasonable prices in the Portland Metro Area.
    """
    
    # Make the API call
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="gpt-3.5-turbo"
    )
    
    # Extract and print just the response content
    assistant_message = response.choices[0].message.content
    return assistant_message

if __name__ == "__main__":
    # Example chatbot interaction
    procedure = "Blood Test (Complete Blood Count)"
    provider = "Kaiser Foundation Health Plan, Inc., on behalf of the Hawaii Region"
    user_quote = 140  # Example user-provided quote

    # Run the chatbot response function
    print(respond_to_query(procedure, provider, user_quote))
