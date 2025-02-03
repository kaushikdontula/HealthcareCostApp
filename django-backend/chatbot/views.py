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
    with open("Sample_HealthCare_GPT/samples_NW.json", 'r') as f:
        return json.load(f)

def extract_billing_code(assistant_message):
    match = re.search(r'\b\d{3}\b', assistant_message)
    return match.group(0) if match else None

def calculate_average_cost(json_data, billing_code):
    total_cost, count = 0, 0
    for service in json_data['services']:
        if service['billingCode'] == billing_code:
            for price in service['prices']:
                if price['negotiatedType'] == 'negotiated' and price['negotiatedRate'] > 0:
                    total_cost += price['negotiatedRate']
                    count += 1
    return total_cost / count if count else None

@method_decorator(csrf_exempt, name='dispatch')
class ChatbotView(View):
    def post(self, request):
        user_input = json.loads(request.body).get("user_input", "")

        # Send request to OpenAI
        messages = [{"role": "user", "content": user_input}]
        response = client.chat.completions.create(
            messages=messages,
            model="gpt-4-turbo"
        )

        assistant_message = response.choices[0].message.content
        billing_code = extract_billing_code(assistant_message)

        if billing_code:
            json_data = load_mrf_file()
            avg_price = calculate_average_cost(json_data, billing_code)
            assistant_message += f"\nAverage cost for MS-DRG {billing_code}: ${avg_price:.2f}" if avg_price else ""

        return JsonResponse({'assistant_message': assistant_message})


