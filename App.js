import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [vocabularyData, setVocabularyData] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState('Spanish');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  // Load JSON dynamically
  useEffect(() => {
    fetch('/vocabulary.json')
      .then((response) => response.json())
      .then((data) => {
        setVocabularyData(data);
      })
      .catch((error) => {
        console.error('Error loading vocabulary:', error);
      });
  }, []);

  // Wait until data is loaded
  if (!vocabularyData[selectedLanguage]) {
    return <div className="app-container">Loading vocabulary...</div>;
  }

  const vocabulary = vocabularyData[selectedLanguage];
  const currentWord = vocabulary[currentIndex];

  const handleSubmit = () => {
    if (userAnswer.toLowerCase() === currentWord.translation.toLowerCase()) {
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ Incorrect! Correct answer: ${currentWord.translation}`);
    }
  };

  const handleNext = () => {
    setFeedback('');
    setUserAnswer('');
    setCurrentIndex((prevIndex) => (prevIndex + 1) % vocabulary.length);
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    setCurrentIndex(0);
    setUserAnswer('');
    setFeedback('');
  };

  return (
    <div className="app-container">
      <h1>🌍 Language Learning App</h1>

      <label htmlFor="language">Choose a language:</label>
      <select id="language" onChange={handleLanguageChange} value={selectedLanguage}>
        {Object.keys(vocabularyData).map((lang) => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>

      <p>Translate this word to {selectedLanguage}:</p>
      <h2>{currentWord.word}</h2>

      <input
        type="text"
        placeholder="Type your answer"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
      />

      <div>
        <button onClick={handleSubmit}>Check</button>
        <button onClick={handleNext}>Next</button>
      </div>

      <p>{feedback}</p>
    </div>
  );
}

export default App;
