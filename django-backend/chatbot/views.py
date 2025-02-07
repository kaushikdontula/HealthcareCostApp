from django.shortcuts import render
import os
import re
import json
from openai import OpenAI
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View


# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Load JSON Data
def load_mrf_file():
    # Get the current directory of the script
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Construct the relative path to the JSON file
    json_file_path = os.path.join(current_dir, 'samples_NW.json')
    
    # Open and load the JSON file
    with open(json_file_path, 'r') as f:
        return json.load(f)

def extract_billing_code(assistant_message):
    # Check if the key phrase is present in the message
    if "Analyzing cost data for MS-DRG code" in assistant_message:
        # Extract the 3-digit MS-DRG code
        match = re.search(r'\b\d{3}\b', assistant_message)
        if match:
            return match.group(0)
    return None


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

def respond_to_query(messages):

    # sends a request to the OpenAI API to generate a response from the GPT-3.5-turbo
    response = client.chat.completions.create(

        # contains conversation history, its a list of dictionaries where each dictionary has a role (system, user, assistant) and content
        messages=messages,
        model="gpt-4-turbo" #gpt-3.5-turbo
    )

    # gets content of message to display
    return response.choices[0].message.content


# Initialize conversation history
messages = [
    {
        "role": "system",
        "content": (
            "You are an AI healthcare assistant. You have access to cost data for various procedures from different providers. "
            "You have knowledge of all 998 MS-DRG codes, the user will tell you about a procedure. If there are multiple possible MS-DRG codes it could be, you should list out all possible MS-DRG codes and ask the user to clarify if needed. If there is only one possibility, still ask the user to confirm"
            "If the user does not know which MS-DRG code correlates best with their procedure, give them descriptions along with the codes to help narrow down"
            "Once you have finalized which MS-DRG code it is from the user with certainty, say the words 'Analyzing cost data for MS-DRG code ' "
        )
    }
]

@method_decorator(csrf_exempt, name='dispatch')
class ChatbotView(View):
    json_data = load_mrf_file()
    if json_data: 
        print("successfully got json data")
    else: 
        print("error getting json data")

    def post(self, request):
        user_input = json.loads(request.body).get("user_input", "")
        
        # Add user input to conversation history
        messages.append({"role": "user", "content": user_input})

        # Generate assistants response
        assistant_message = respond_to_query(messages)

        # Extract billing code from the assistant's response
        billing_code = extract_billing_code(assistant_message)
        print(billing_code)

        if billing_code:
            json_data = load_mrf_file()
            avg_price = calculate_average_cost(json_data, billing_code)
            min_cost, max_cost = calculate_cost_range(json_data, billing_code)
            
            if avg_price:
                cost_summary = (
                    f"For MS-DRG code {billing_code}, the average cost is ${avg_price:.2f}. "
                    f"The minimum payment observed is ${min_cost:.2f}, and the maximum payment is ${max_cost:.2f}. "
                    "Let me know if you'd like further details or assistance!"
                )
                messages.append({"role": "assistant", "content": cost_summary})
                assistant_message += f"\n{cost_summary}"

        return JsonResponse({'assistant_message': assistant_message})