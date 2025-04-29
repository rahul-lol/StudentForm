import React, { useState } from "react";

interface Props {
  onLogin: (rollNumber: string, name: string) => Promise<void>;
  loading: boolean;
  error?: string;
}

const LoginForm: React.FC<Props> = ({ onLogin, loading, error }) => {
  const [rollNumber, setRollNumber] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber.trim() || !name.trim()) return;
    onLogin(rollNumber.trim(), name.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div>
        <label>
          Roll Number
          <input
            type="text"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            placeholder="Enter your roll number"
          />
        </label>
      </div>
      <div>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </label>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Logging in…" : "Login"}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default LoginForm;
