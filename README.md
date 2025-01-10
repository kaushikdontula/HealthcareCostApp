# HealthcareCostApp
Aggregate and leverage MRF and AI together for the purpose of improving visibility to rates for covered items and services to the public.  

Instructions for Running Application

To install Python libraries:
- Navigate to /HealthcareCostApp
- “pip install -r requirements.txt” on the command line

To run the Django backend:
- Navigate to the /django-backend directory
- “python manage.py runserver” on the command line

To run Next.js frontend:
- Navigate to the /next-app directory
- “npm run dev” on the command line

To run chatbot terminal interface: 
- Navigate to /Sample_HealthCare_GPT directory
- Set API key in the terminal by running the command “export OPENAI_API_KEY=your_api_key_here"
- Lastly, run the command “python3 chatbot.py” which will run the chatbot interface on the command line

To set up DB and seed data:
- From project dir:
- Run “python3 database/generate_db.py”
- Run “python3 data_processing/mrf_processer.py” 
