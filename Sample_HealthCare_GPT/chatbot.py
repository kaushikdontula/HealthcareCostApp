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

# def plot_scatter(json_data, billing_code):
#     # Extract costs and provider names directly within the function
#     costs = []
#     Procedure_num = []

#     for service in json_data['services']:
#         if service['billingCode'] == billing_code:
#             for price in service['prices']:
#                 if price['negotiatedType'] == 'negotiated' and price['negotiatedRate'] > 0:
#                     costs.append(price['negotiatedRate'])
#                     Procedure_num.append(price.get('procedureNum', f"Procedure {len(Procedure_num) + 1}"))

#     if not costs:
#         print(f"No cost data available to plot for Billing Code {billing_code}.")
#         return

#     # Create the scatter plot
#     plt.figure(figsize=(8, 6))
#     plt.scatter(Procedure_num, costs, color="blue", alpha=0.7)
#     plt.title(f"Scatter Plot of Costs for Billing Code {billing_code}", fontsize=14)
#     plt.ylabel("Cost ($)", fontsize=12)
#     plt.xlabel("Providers", fontsize=12)
#     plt.xticks(rotation=45)
#     plt.grid(axis='y', linestyle='--', alpha=0.7)
#     plt.show()


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





def load_mrf_file(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)
    



    
def extract_billing_code(assistant_message):
    # Use regex to find a 3-digit code for heart transplant 001, 002
    match = re.search(r'\b\d{3}\b', assistant_message)
    if match:
        return match.group(0)
    return None





def respond_to_query(messages):

    # sends a request to the OpenAI API to generate a response from the GPT-3.5-turbo
    response = client.chat.completions.create(

        # contains conversation history, its a list of dictionaries where each dictionary has a role (system, user, assistant) and content
        messages=messages,
        model="gpt-3.5-turbo"
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
                "Help users understand the costs of healthcare procedures and their MS-DRG codes. "
                "If a user mentions a procedure, provide the corresponding MS-DRG code. "
                "Ask follow-up questions if needed, and ensure to extract and return the billing code for the procedure mentioned."
            )
        }
    ]

    print("Welcome to the Healthcare Cost Assistant! Type 'exit' to end the chat.\n")
    
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

        if billing_code:
            print(f"Extracted Billing Code: {billing_code}")
            
            # Calculate the average cost for the billing code
            avg_price = calculate_average_cost(json_data, billing_code)
            if avg_price:
                print(f"Average Cost for Billing Code {billing_code}: ${avg_price:.2f}")
            else:
                print(f"No valid cost data available for Billing Code {billing_code}.")

            # Generate a box-and-whisker plot for the costs
            plot_scatter(json_data, billing_code)
        else:
            print("Could not extract a valid billing code from the response.")
        
        
        # Add the assistant's response to the conversation history
        messages.append({"role": "assistant", "content": assistant_message})
        
        # Display the assistant's response
        print(f"Assistant: {assistant_message}\n")

if __name__ == "__main__":
    main()
