import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import DynamicForm from "./components/DynamicForm";
import { FormResponse } from "./types";

const CREATE_USER_URL =
  "https://dynamic-form-generator-9rl7.onrender.com/create-user";
const GET_FORM_URL =
  "https://dynamic-form-generator-9rl7.onrender.com/get-form";

const App: React.FC = () => {
  const [user, setUser] = useState<{ rollNumber: string; name: string } | null>(
    null
  );
  const [formResponse, setFormResponse] = useState<FormResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchForm = async (rollNumber: string) => {
    try {
      const res2 = await fetch(
        `${GET_FORM_URL}?rollNumber=${encodeURIComponent(rollNumber)}`,
        {
          headers: {
            "Accept": "application/json"
          }
        }
      );
      const formData = await res2.json();
      console.log("Form data response:", formData);
      if (!res2.ok) {
        throw new Error(formData.message || "Failed to fetch form data");
      }
      setFormResponse(formData);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred");
      setFormResponse(null);
    }
  };

  const handleLogin = async (rollNumber: string, name: string) => {
    setLoading(true);
    setError("");
    try {
      // 1) register
      console.log("Attempting to register user...");
      const res1 = await fetch(CREATE_USER_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ rollNumber, name }),
      });
      const responseData = await res1.json();
      console.log("Registration response:", responseData);
      if (!res1.ok) {
        // If user already exists, proceed to fetch form
        if (responseData.message && responseData.message.toLowerCase().includes("user already exists")) {
          setUser({ rollNumber, name });
          await fetchForm(rollNumber);
          return;
        } else {
          throw new Error(responseData.message || "Failed to register user");
        }
      }
      setUser({ rollNumber, name });
      await fetchForm(rollNumber);
    } catch (e: any) {
      console.error("Login error:", e);
      setError(e.message || "An unexpected error occurred");
      setUser(null);
      setFormResponse(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>Dynamic Form Generator</h1>
      {!user && (
        <LoginForm onLogin={handleLogin} loading={loading} error={error} />
      )}

      {user && loading && (
        <div className="loading">
          Loading your form...
        </div>
      )}

      {user && formResponse && (
        <DynamicForm formStructure={formResponse.form} />
      )}

      {user && error && !loading && (
        <div className="error">
          {error}
        </div>
      )}
    </div>
  );
};

export default App;
