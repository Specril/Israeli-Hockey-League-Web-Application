"use client";
import "./style.css";

export default function Button({func}) {
  return (
    <button onClick={func}>
      Fetch Teams
    </button>
  );
}

