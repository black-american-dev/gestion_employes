import React from "react";
import styles from "./DeleteButton.module.css";

const DeleteButton = () => {
  return (
    <button
      type="button"
      className={styles.button}
    >
      <span className={styles.text}>Delete</span>

      <span className={styles.icon}>
        <svg
          className={styles.svg}
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320"
            fill="none"
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
          />
          <line
            x1="80"
            y1="112"
            x2="432"
            y2="112"
            stroke="#fff"
            strokeLinecap="round"
            strokeWidth="32"
          />
          <path
            d="M192,112V72a24,24,0,0,1,24-24h80a24,24,0,0,1,24,24v40"
            fill="none"
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
          />
          <line
            x1="256"
            y1="176"
            x2="256"
            y2="400"
            stroke="#fff"
            strokeLinecap="round"
            strokeWidth="32"
          />
          <line
            x1="192"
            y1="176"
            x2="192"
            y2="400"
            stroke="#fff"
            strokeLinecap="round"
            strokeWidth="32"
          />
          <line
            x1="320"
            y1="176"
            x2="320"
            y2="400"
            stroke="#fff"
            strokeLinecap="round"
            strokeWidth="32"
          />
        </svg>
      </span>
    </button>
  );
};

export default DeleteButton;
