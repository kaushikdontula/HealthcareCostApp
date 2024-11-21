# cost_functions.py

def get_cost_info(cost_data, procedure, provider, user_quote=None):
    # Find matching entries for the procedure
    matching_entries = [
        entry for entry in cost_data['procedures'] 
        if entry['procedure_name'].lower() == procedure.lower()
    ]
    
    if not matching_entries:
        return f"No cost data available for {procedure}."

    # Extract cost details
    costs = [entry['cost'] for entry in matching_entries]
    avg_cost = sum(costs) / len(costs)
    min_cost = min(costs)
    max_cost = max(costs)
    
    # Prepare feedback based on user's quote
    cost_feedback = ""
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
