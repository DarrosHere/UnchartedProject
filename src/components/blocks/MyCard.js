import React, { useState, useEffect } from "react";
import '../../styles/my-card.css'; 

const MyCard = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCvv, setVisibleCvv] = useState(null); 

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/cards/cards", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch cards: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setCards(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const toggleCvvVisibility = (cardId) => {
    setVisibleCvv((prev) => (prev === cardId ? null : cardId)); 
  };

  if (loading) return <div>Loading cards...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="my-cards-container">
      <h2>My Cards</h2>
      {cards.length > 0 ? (
        <div className="cards-list">
          {cards.map((card) => (
            <div key={card._id} className="card">
              <h3>
                Card Number: {card.cardNumber ? `**** **** **** ${card.cardNumber.slice(-4)}` : "N/A"}
              </h3>
              <p>Expiration Date: {card.expirationDate ? new Date(card.expirationDate).toLocaleDateString() : "N/A"}</p>
              <p>
                CVV: {visibleCvv === card._id ? card.cvv : "•••"}{" "}
                <button onClick={() => toggleCvvVisibility(card._id)}>
                  {visibleCvv === card._id ? "Hide CVV" : "Show CVV"}
                </button>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No cards available.</p>
      )}
    </div>
  );
};

export default MyCard;