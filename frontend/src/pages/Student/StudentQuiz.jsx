import React, { useState } from "react";

const StudentQuiz = () => {
  const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];

  return (
    <div style={{ padding: "20px" }}>
      <h2>📝 Available Quizzes</h2>
      {quizzes.length === 0 ? <p>No quizzes currently available.</p> : 
        quizzes.map(q => (
          <div key={q.id} style={{ padding: "10px", border: "1px solid #ddd", marginBottom: "10px" }}>
            {q.title} <button style={{ float: "right" }}>Start Quiz</button>
          </div>
        ))
      }
    </div>
  );
};
export default StudentQuiz;