import { useState, useEffect } from "react";
import '../styles/MoneyRain.css';

export default function MoneyRain() {
  const [money, setMoney] = useState([]);

  const handleClick = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const id = Date.now();
    const angle = Math.random() * 360; 
    const distanceX = Math.random() * 200 - 100; 
    const distanceY = Math.random() * 200 + 100; 

    setMoney((prev) => [...prev, { id, x, y, angle, distanceX, distanceY }]);

    setTimeout(() => {
      setMoney((prev) => prev.filter((m) => m.id !== id));
    }, 2000);
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      {money.map(({ id, x, y, angle, distanceX, distanceY }) => (
        <div
          key={id}
          className="money"
          style={{
            left: x + "px",
            top: y + "px",
            "--distanceX": distanceX + "px",
            "--distanceY": distanceY + "px",
            "--angle": angle + "deg",
          }}
        >
          💵
        </div>
      ))}
    </>
  );
}