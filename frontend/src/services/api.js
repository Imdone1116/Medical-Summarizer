const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Summarize medical data
  summarize: async (medicalText, viewType) => {
    const response = await fetch(`${API_BASE_URL}/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        medical_text: medicalText,
        view_type: viewType,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to summarize data');
    }

    return response.json();
  },

  // Chat with medical records
  chat: async (medicalText, question, chatHistory, viewType) => {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        medical_text: medicalText,
        question: question,
        chat_history: chatHistory,
        view_type: viewType,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get chat response');
    }

    return response.json();
  },

  // Explain medical term
  explainTerm: async (term, context) => {
    const response = await fetch(`${API_BASE_URL}/explain-term`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        term: term,
        context: context,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to explain term');
    }

    return response.json();
  },

  // Health check
  healthCheck: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },
};
