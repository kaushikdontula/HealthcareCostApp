import os
import re
from openai import OpenAI
# from cost_data import load_cost_data
# from cost_functions import get_cost_info
import matplotlib.pyplot as plt
import json
import plotly.graph_objects as go

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def plot_scatter(json_data, billing_code):
    # Extract costs and provider names directly within the function
    costs = []
    Procedure_num = []

    for service in json_data['services']:
        if service['billingCode'] == billing_code:
            for price in service['prices']:
                if price['negotiatedType'] == 'negotiated' and price['negotiatedRate'] > 0:
                    costs.append(price['negotiatedRate'])
                    Procedure_num.append(price.get('procedureNum', f"Procedure {len(Procedure_num) + 1}"))

    if not costs:
        print(f"No cost data available to plot for Billing Code {billing_code}.")
        return

    # Create the scatter plot using Plotly Graph Objects
    fig = go.Figure()

    # Add scatter points
    fig.add_trace(go.Scatter(
        x=Procedure_num,
        y=costs,
        mode='markers',
        marker=dict(
            size=10,  # Increase marker size
            color=costs,  # Color based on costs for a gradient effect
            colorscale='Viridis',  # Beautiful color palette
            showscale=True,  # Display color scale bar
            colorbar=dict(title="Cost ($)", titleside="right")
        ),
        hovertemplate="<b>Provider:</b> %{x}<br><b>Cost:</b> $%{y}<extra></extra>"
    ))

    # Update layout for a clean and professional look
    fig.update_layout(
        title=dict(
            text=f"Scatter Plot of Costs for Billing Code {billing_code}",
            font=dict(size=20),
            x=0.5,  # Center the title
        ),
        xaxis=dict(
            title="Providers",
            titlefont=dict(size=16),
            tickangle=45,  # Angled x-axis labels for readability
        ),
        yaxis=dict(
            title="Cost ($)",
            titlefont=dict(size=16),
            tickformat=".2f",  # Ensure full numbers on the y-axis
            gridcolor='lightgray',  # Add light gridlines for clarity
            gridwidth=0.5,
        ),
        plot_bgcolor='white',  # Clean white background
        margin=dict(l=50, r=50, t=80, b=100),
    )

    # Add gridlines and additional design elements
    fig.update_xaxes(showline=True, linewidth=1, linecolor='black', mirror=True)
    fig.update_yaxes(showline=True, linewidth=1, linecolor='black', mirror=True)

    # Show the interactive plot
    fig.show()




def calculate_average_cost(json_data, billing_code):
    total_cost = 0
    count = 0
    
    # looping through each service
    for service in json_data['services']:

        # if the billing code in service matches our billing code extracted/passed in 
        if service['billingCode'] == billing_code:
            for price in service['prices']:
                # Exclude rates that are zero or percentages
                if price['negotiatedType'] == 'negotiated' and price['negotiatedRate'] > 0:
                    total_cost += price['negotiatedRate']
                    count += 1

    if count == 0:
        return None  # No valid data to calculate average
    return total_cost / count

def calculate_cost_range(json_data, billing_code):
    min_cost = float('inf')  #max value rn
    max_cost = float('-inf')  # min value rn
    
    # going through each service
    for service in json_data['services']:

        # find associated billindg code
        if service['billingCode'] == billing_code:
            # get prices for that billing code
            for price in service['prices']:
                # only looking at 'negotiated' rates that are greater than zero
                if price['negotiatedType'] == 'negotiated' and price['negotiatedRate'] > 0:
                    min_cost = min(min_cost, price['negotiatedRate'])
                    max_cost = max(max_cost, price['negotiatedRate'])
    
    # no valid rates are found
    if min_cost == float('inf') or max_cost == float('-inf'):
        return None  # No valid data to calculate range

    return min_cost, max_cost



def load_mrf_file(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)
    



    
def extract_billing_code(assistant_message):
    # Check if the key phrase is present in the message
    if "Analyzing cost data for MS-DRG code" in assistant_message:
        # Extract the 3-digit MS-DRG code
        match = re.search(r'\b\d{3}\b', assistant_message)
        if match:
            return match.group(0)
    return None





def respond_to_query(messages):

    # sends a request to the OpenAI API to generate a response from the GPT-3.5-turbo
    response = client.chat.completions.create(

        # contains conversation history, its a list of dictionaries where each dictionary has a role (system, user, assistant) and content
        messages=messages,
        model="gpt-4-turbo" #gpt-3.5-turbo
    )

    # gets content of message to display
    return response.choices[0].message.content





def main():

    # load json data
    json_data = load_mrf_file("samples_NW.json")
    # print(json_data)

    # Initialize conversation history
    messages = [
        {
            "role": "system",
            "content": (
                "You are an AI healthcare assistant. You have access to cost data for various procedures from different providers. "
                # "Help users understand the costs of healthcare procedures and their MS-DRG codes. "
                # "If a user mentions a procedure, provide the corresponding MS-DRG code. "
                # "Ask follow-up questions if needed, and ensure to extract and return the billing code for the procedure mentioned."
                "You have knowledge of all 998 MS-DRG codes, the user will tell you about a procedure. If there are multiple possible MS-DRG codes it could be, you should list out all possible MS-DRG codes and ask the user to clarify if needed. If there is only one possibility, still ask the user to confirm"
                "Once you have finalized which MS-DRG code it is from the user with certainty, say the words 'Analyzing cost data for MS-DRG code ' "
            )
        }
    ]

    print("Welcome to the Healthcare Cost Assistant! Please tell us about an upcoming procedure that you may have questions about or would like to understand the costs of. \n\n At any time type 'exit' to end the chat.\n")
    
    while True:
        # Get user input
        user_input = input("You: ")
        
        # Exit the loop if the user types 'exit'
        if user_input.lower() == "exit":
            print("Goodbye!")
            break
        
        # Add user input to the conversation history
        messages.append({"role": "user", "content": user_input})

        # Generate a response
        assistant_message = respond_to_query(messages)

        # extracting the MS-DRG code from the assistant's response
        billing_code = extract_billing_code(assistant_message)
        # print(billing_code)
        
        # Add the assistant's response to the conversation history
        messages.append({"role": "assistant", "content": assistant_message})
        
        # Display the assistant's response
        print(f"Assistant: {assistant_message}\n")

        if billing_code:
            print(f"Extracted Billing Code: {billing_code}")
            
            # Calculate the average cost for the billing code
            avg_price = calculate_average_cost(json_data, billing_code)
            min_cost, max_cost = calculate_cost_range(json_data, billing_code)

            if avg_price and min_cost and max_cost:
                print(f"Average Cost for Billing Code {billing_code}: ${avg_price:.2f}\n")
                print(f"With the minimum payment being ${min_cost} and the maximum payment being ${max_cost}")
            else:
                print(f"No valid cost data available for Billing Code {billing_code}.")

            # Generate a box-and-whisker plot for the costs
            plot_scatter(json_data, billing_code)

if __name__ == "__main__":
    main()
