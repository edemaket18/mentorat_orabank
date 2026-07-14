import React, { useState } from 'react';

interface EvaluationData {
  internName: string;
  mentorName: string;
  period: string;
  score: number;
  comments: string;
}

const defaultData: EvaluationData = {
  internName: '',
  mentorName: '',
  period: '',
  score: 0,
  comments: '',
};

const EvaluationForm: React.FC = () => {
  const [form, setForm] = useState<EvaluationData>(defaultData);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous pouvez envoyer les données au backend
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Évaluation du stagiaire</h2>
      {submitted && <div style={{ color: 'green' }}>Évaluation envoyée !</div>}
      <div>
        <label>
          Nom du stagiaire :
          <input
            type="text"
            name="internName"
            value={form.internName}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Nom du mentor :
          <input
            type="text"
            name="mentorName"
            value={form.mentorName}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Période :
          <input
            type="text"
            name="period"
            value={form.period}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Score :
          <input
            type="number"
            name="score"
            value={form.score}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Commentaires :
          <textarea
            name="comments"
            value={form.comments}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <button type="submit">Soumettre l'évaluation</button>
    </form>
  );
};

export default EvaluationForm;
