// VirtualKeyboard.js
import React, { useState } from 'react';
import "../styles/VirtualKeyboard.css";

const keys = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ['Space', 'Backspace']
];

const VirtualKeyboard = ({ onKeyPress, onClose }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      });
    }
  };

  const handleMouseUp = () => setDragging(false);

  return (
    <div
      className="virtual-keyboard"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="keyboard-header" onMouseDown={handleMouseDown}>
        <span>Teclado Virtual</span>
        <button onClick={onClose} className="close-keyboard-btn">X</button>
      </div>
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button
              key={key}
              className="keyboard-key"
              onClick={() => onKeyPress(key)}
            >
              {key === "Space" ? " " : key === "Backspace" ? "⌫" : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default VirtualKeyboard;
