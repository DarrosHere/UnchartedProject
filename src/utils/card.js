import React from "react";

const cardData = [
  { id: 1, title: "Quantum Transfer", img: "/img/image1.png", description: "Transfers so fast… they sometimes disappear entirely!" },
  { id: 2, title: "Crypto Forge", img: "/img/image2.png", description: "Your financial future starts here… and might end here too." },
  { id: 3, title: "Luminous Flow", img: "/img/image3.png", description: "Ever wanted a surprise? Our fees will definitely shock you!" },
  { id: 4, title: "Mystery Vault", img: "/img/image4.png", description: "Your money is safe! Unless we lose it. Oops." },
  { id: 5, title: "Phantom Card", img: "/img/image5.png", description: "Where does your money go? Even we don’t know!" },
];

const Card = ({ title, img, description }) => {
  return (
    <div className="grid-container">
  {cardData.slice(0, 2).map((card) => (
    <div className="grid-item large" key={card.id}>
      <img src={card.img} alt={card.title} />
      <h2 className="card-title">{card.title}</h2>
      <p className="card-description">{card.description}</p>
    </div>
  ))}
  {cardData.slice(2).map((card) => (
    <div className="grid-item small" key={card.id}>
      <img src={card.img} alt={card.title} />
      <h2 className="card-title">{card.title}</h2>
      <p className="card-description">{card.description}</p>
   
    </div>
  ))}
</div>
  );
}
export default Card;