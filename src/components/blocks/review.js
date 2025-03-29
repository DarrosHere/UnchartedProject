import React from "react";

const reviews = [
  {
    id: 1,
    text: '"I downloaded it for budgeting tips. Now I just need a new job."',
    author: "John Doe",
  },
  {
    id: 2,
    text: '"Finally, an app that makes my financial decisions worse than I do!"',
    author: "Jane Smith",
  },
  {
    id: 3,
    text: '"Installed it as a joke. Now I cry in three currencies."',
    author: "Alice Johnson",
  },
  {
    id: 4,
    text: '"I thought my money was disappearing. Turns out, its just this app!"',
    author: "Bob Brown",
  },
  {
    id: 5,
    text: '"I’ve lost all faith in my financial future... but the colors are pretty!"',
    author: "Charlie Davis",
  },
  {
    id: 6,
    text: '"Lost all my savings, but at least the UI is nice!"',
    author: "Eve Wilson",
  },
];

const Review = () => {
  return (
    <div id="reviews" className="reviews-container">
      <h2 className="reviews-title">Reviews</h2>

      <div className="reviews">
        {reviews.map((review) => (
          <div key={review.id} className="review">
            <p className="review-text">{review.text}</p>
            <p className="review-author">- {review.author}</p>
          </div>
        ))}
      </div>

      <p className="disclaimer">
        *These reviews were absolutely NOT written by our marketing team.
        Nope. Not at all. Just 100% authentic, unsolicited praise from totally
        real users who definitely exist. Trust us. 😎👍
      </p>
    </div>
  );
};

export default Review;
