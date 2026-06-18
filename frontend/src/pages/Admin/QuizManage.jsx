import React, { useState, useEffect } from "react";

const QuizManage = () => {
  const [quizzes, setQuizzes] = useState(() => JSON.parse(localStorage.getItem("quizzes")) || []);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("quizzes", JSON.stringify(quizzes));
  }, [quizzes]);

  const handleAddOrUpdate = () => {
    if (!title) return;
    if (editId) {
      setQuizzes(quizzes.map(q => q.id === editId ? { ...q, title } : q));
      setEditId(null);
    } else {
      setQuizzes([...quizzes, { id: Date.now(), title }]);
    }
    setTitle("");
  };

  const deleteQuiz = (id) => setQuizzes(quizzes.filter(q => q.id !== id));

  return (
    <div style={{ padding: "20px" }}>
      <h2>📝 Quiz Manager</h2>
      <div style={{ marginBottom: "20px" }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quiz Title" />
        <button onClick={handleAddOrUpdate}>{editId ? "Update Quiz" : "Add Quiz"}</button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f1f5f9" }}>
            <th style={{ padding: "10px" }}>Title</th>
            <th style={{ padding: "10px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map(q => (
            <tr key={q.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px" }}>{q.title}</td>
              <td style={{ padding: "10px" }}>
                <button onClick={() => { setEditId(q.id); setTitle(q.title); }}>Edit</button>
                <button onClick={() => deleteQuiz(q.id)} style={{ marginLeft: "10px", color: "red" }}>Delete</button>
                <button style={{ marginLeft: "10px" }}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default QuizManage;