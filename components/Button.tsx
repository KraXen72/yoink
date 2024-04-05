import React from "dom-chef";

export const Button = () => (
  <button id="process-btn" title="Download current page" className="btn">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
    >
      <g
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      >
        <path d="M12 2v14m7-7l-7 7l-7-7" />
        <circle cx="12" cy="21" r="1" />
      </g>
    </svg>
  </button>
);
