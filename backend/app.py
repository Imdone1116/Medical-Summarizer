from flask import Flask, request, jsonify
from flask_cors import CORS
import anthropic
import os
import re
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Initialize Claude client
client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

def extract_json_from_response(text):
    """Extract JSON from Claude's response, handling markdown code blocks"""
    # Try to find JSON in markdown code blocks
    json_match = re.search(r'```json\s*\n(.*?)\n```', text, re.DOTALL)
    if json_match:
        return json_match.group(1).strip()

    # Try to find JSON in generic code blocks
    json_match = re.search(r'```\s*\n(.*?)\n```', text, re.DOTALL)
    if json_match:
        potential_json = json_match.group(1).strip()
        # Verify it's actually JSON
        try:
            json.loads(potential_json)
            return potential_json
        except:
            pass

    # If no code blocks, try to extract JSON object directly
    # Look for content between outermost { and }
    json_match = re.search(r'(\{.*\})', text, re.DOTALL)
    if json_match:
        return json_match.group(1).strip()

    # Return as-is if no patterns match
    return text.strip()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

@app.route('/api/summarize', methods=['POST'])
def summarize_medical_data():
    """Summarize medical data for doctor or patient view"""
    try:
        data = request.json
        medical_text = data.get('medical_text', '')
        view_type = data.get('view_type', 'doctor')  # 'doctor' or 'patient'

        if not medical_text:
            return jsonify({"error": "No medical text provided"}), 400

        # Create appropriate prompt based on view type
        if view_type == 'doctor':
            prompt = f"""Analyze the following medical records and provide a comprehensive summary for a healthcare provider. Structure the output as JSON with these sections:

1. current_medications: Array of objects with {{name, dose, frequency, renewal_date}}
2. appointments: Object with {{last_visit, upcoming_visits}}
3. recent_labs: Array of lab results with {{test_name, value, unit, normal_range, status}} where status is "normal", "high", or "low"
4. major_surgeries: Object with {{previous, scheduled}}
5. conditions: Object with {{major, minor}}
6. recent_imaging: Array of relevant imaging studies with {{type, date, findings, relevance}}
7. clinical_trial_notes: Any relevant information for clinical trial screening

Medical Records:
{medical_text}

Respond with ONLY valid JSON, no additional text."""
        else:  # patient view
            prompt = f"""Analyze the following medical records and provide a patient-friendly summary in simple, layman's terms. Structure the output as JSON with these sections:

1. conditions_summary: Simple explanation of current health conditions
2. medications: Array of objects with {{name, what_it_does, dose, when_to_take, renewal_date}}
3. upcoming_care: Array of {{type, date, what_to_expect}}
4. recent_tests: Simple explanation of recent test results
5. surgeries: Simple explanation of past or upcoming procedures
6. allergies: List of known allergies
7. reminders: Important dates and actions needed

Medical Records:
{medical_text}

Use simple language that anyone can understand. Avoid medical jargon. Respond with ONLY valid JSON, no additional text."""

        # Call Claude API
        message = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=4096,
            temperature=1,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        response_text = message.content[0].text

        # Extract and validate JSON from response
        cleaned_json = extract_json_from_response(response_text)

        # Validate that it's actually valid JSON
        try:
            json.loads(cleaned_json)
        except json.JSONDecodeError as e:
            return jsonify({
                "error": f"Invalid JSON response from AI: {str(e)}",
                "raw_response": response_text
            }), 500

        return jsonify({
            "summary": cleaned_json,
            "view_type": view_type,
            "timestamp": datetime.now().isoformat()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat_with_records():
    """Conversational interface for asking questions about medical records"""
    try:
        data = request.json
        medical_text = data.get('medical_text', '')
        user_question = data.get('question', '')
        chat_history = data.get('chat_history', [])
        view_type = data.get('view_type', 'patient')

        if not medical_text or not user_question:
            return jsonify({"error": "Missing medical text or question"}), 400

        # Build context-aware prompt
        system_prompt = f"""You are a helpful medical assistant. You have access to the following medical records:

{medical_text}

Answer questions about these medical records. If the user is a patient (view_type='patient'), use simple, layman's terms. If the user is a doctor (view_type='doctor'), you can use medical terminology.

Current view type: {view_type}

Be concise, accurate, and helpful. If information is not in the records, say so clearly."""

        # Build message history
        messages = []
        for msg in chat_history:
            messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })
        messages.append({
            "role": "user",
            "content": user_question
        })

        # Call Claude API
        message = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=2048,
            system=system_prompt,
            messages=messages
        )

        response_text = message.content[0].text

        return jsonify({
            "response": response_text,
            "timestamp": datetime.now().isoformat()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/explain-term', methods=['POST'])
def explain_medical_term():
    """Explain a medical term in simple language"""
    try:
        data = request.json
        term = data.get('term', '')
        context = data.get('context', '')

        if not term:
            return jsonify({"error": "No term provided"}), 400

        prompt = f"""Explain the medical term "{term}" in simple, layman's terms that anyone can understand.

Context from medical records: {context}

Provide:
1. Simple definition
2. Why it matters for this patient
3. Any actions or precautions related to it

Keep the explanation brief and easy to understand."""

        message = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=1024,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        response_text = message.content[0].text

        return jsonify({
            "explanation": response_text,
            "term": term,
            "timestamp": datetime.now().isoformat()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
