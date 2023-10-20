import React from "react";
import styles from "../css/ElapsedTimeTracker.module.css"

export default function ElapsedTimeTracker({ ...props }) {
  const elapsedMin = Math.floor(props.elapsedSec / 60);
  const elapsedSec = Math.floor(props.elapsedSec % 60);

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <p>
          {elapsedMin}:
        </p>
        <p>
          {elapsedSec.toString().padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}
