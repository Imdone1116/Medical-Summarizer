// Local storage utilities for persisting patient data

const STORAGE_KEYS = {
  MEDICAL_RECORDS: 'medicalRecords',
  PATIENT_DATA: 'patientData',
  SUMMARIES: 'summaries',
  CHAT_HISTORY: 'chatHistory',
};

export const storage = {
  // Save medical records
  saveMedicalRecords: (records) => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEDICAL_RECORDS, JSON.stringify(records));
      return true;
    } catch (error) {
      console.error('Error saving medical records:', error);
      return false;
    }
  },

  // Get medical records
  getMedicalRecords: () => {
    try {
      const records = localStorage.getItem(STORAGE_KEYS.MEDICAL_RECORDS);
      return records ? JSON.parse(records) : null;
    } catch (error) {
      console.error('Error getting medical records:', error);
      return null;
    }
  },

  // Save patient data
  savePatientData: (data) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PATIENT_DATA, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving patient data:', error);
      return false;
    }
  },

  // Get patient data
  getPatientData: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PATIENT_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting patient data:', error);
      return null;
    }
  },

  // Save summaries
  saveSummaries: (summaries) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(summaries));
      return true;
    } catch (error) {
      console.error('Error saving summaries:', error);
      return false;
    }
  },

  // Get summaries
  getSummaries: () => {
    try {
      const summaries = localStorage.getItem(STORAGE_KEYS.SUMMARIES);
      return summaries ? JSON.parse(summaries) : { doctor: null, patient: null };
    } catch (error) {
      console.error('Error getting summaries:', error);
      return { doctor: null, patient: null };
    }
  },

  // Save chat history
  saveChatHistory: (history) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(history));
      return true;
    } catch (error) {
      console.error('Error saving chat history:', error);
      return false;
    }
  },

  // Get chat history
  getChatHistory: () => {
    try {
      const history = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting chat history:', error);
      return [];
    }
  },

  // Clear all data
  clearAll: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  },
};
