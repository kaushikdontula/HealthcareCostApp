from django.shortcuts import render
import os
import re
import json
from openai import OpenAI
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from backend import models 
from django.db.models import Q, Avg, Min, Max
import logging

logger = logging.getLogger(__name__)  # Add logging

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Initialize conversation history at the start
messages = [
    {
        "role": "system",
        "content": (
            "You are an AI healthcare assistant with access to cost data for various procedures. "
            "You provide pricing information based on CPT codes, which are used to classify medical procedures and services. "
            "If a user asks about a procedure, you should attempt to match it to a CPT code in the database. "
            "If multiple CPT codes exist for the procedure, list them and ask the user to clarify. "
            "Once a CPT code is identified, retrieve and summarize its pricing data."
        )
    }
]

# Load JSON Data
def load_mrf_file():
    # Get the current directory of the script
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Construct the relative path to the JSON file
    json_file_path = os.path.join(current_dir, 'samples_NW.json')
    
    # Open and load the JSON file
    with open(json_file_path, 'r') as f:
        return json.load(f)

def extract_cpt_code(user_message):
    # Search for a 5-digit CPT code in user input
    match = re.search(r'\b\d{5}\b', user_message)
    if match:
        return match.group(0)  # Found a CPT code, return it

    # If no CPT code found, search for procedures by name
    services = models.Services.objects.filter(Q(name__icontains=user_message) | Q(description__icontains=user_message))

    if services.exists():
        # If multiple CPT codes exist, return all and ask user to clarify
        cpt_codes = list(set(services.values_list('cpt_code', flat=True)))  # Remove duplicates
        if len(cpt_codes) > 1:
            return f"I found multiple CPT codes for {user_message}: {', '.join(cpt_codes)}. Please specify which one you're interested in."

        return cpt_codes[0]  # Return single CPT code

    return None  # No match found


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

def respond_to_query(user_input):
    try:
        global messages  # Use global variable to persist conversation

        # Extract CPT code or find by name
        cpt_code = extract_cpt_code(user_input)

        if cpt_code:
            # If extract_cpt_code returns a clarification message, return that
            if isinstance(cpt_code, str) and "I found multiple CPT codes" in cpt_code:
                return cpt_code  # Ask the user for clarification

            # Query database for service information
            services = models.Services.objects.filter(cpt_code=cpt_code)

            if services.exists():
                service_names = ", ".join([s.name for s in services])

                # Collect all matching service IDs
                service_ids = [s.service_id for s in services]

                # Fetch all pricing related to these services
                pricing_entries = models.Pricing.objects.filter(
                    pricing_id__in=models.ProviderService.objects.filter(service_id__in=service_ids)
                    .values_list('pricing_id', flat=True)
                )

                if pricing_entries.exists():
                    # Aggregate min, max, and average price across all matching services
                    pricing_stats = pricing_entries.aggregate(
                        min_price=Min('negotiated_rate'),
                        max_price=Max('negotiated_rate'),
                        avg_price=Avg('negotiated_rate')
                    )

                    return (
                        f"I found the procedure **{service_names}** with CPT code {cpt_code}. "
                        f"The average negotiated rate is **${pricing_stats['avg_price']:.2f}**, "
                        f"with costs ranging from **${pricing_stats['min_price']:.2f}** to **${pricing_stats['max_price']:.2f}**."
                    )
                else:
                    return f"I found the procedure '{service_names}' (CPT code {cpt_code}), but no pricing data is available."

            else:
                return f"I couldn't find any procedure matching '{user_input}'. Could you rephrase or provide more details?"

        else:
            # If no CPT code is found, let OpenAI handle the response
            messages.append({"role": "user", "content": user_input})
            response = client.chat.completions.create(
                messages=messages,
                model="gpt-4-turbo"
            )
            return response.choices[0].message.content

    except Exception as e:
        logger.error(f"Error processing user query: {e}", exc_info=True)
        return "I'm sorry, but I ran into an error while processing your request. Please try again."

@method_decorator(csrf_exempt, name='dispatch')
class ChatbotView(View):
    def post(self, request):
        user_input = json.loads(request.body).get("user_input", "")
        
        # Generate chatbot response with database context
        assistant_message = respond_to_query(user_input)

        # Return the chatbot's response
        return JsonResponse({'assistant_message': assistant_message})