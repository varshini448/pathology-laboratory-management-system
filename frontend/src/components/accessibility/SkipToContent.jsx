import React from "react";

const SkipToContent = ({
  targetId = "main-content",
  label = "Skip to main content",
}) => {
  const handleClick = (event) => {
    event.preventDefault();

    const target = document.getElementById(targetId);

    if (!target) return;

    target.setAttribute("tabindex", "-1");
    target.focus();

    target.addEventListener(
      "blur",
      () => {
        target.removeAttribute("tabindex");
      },
      { once: true }
    );
  };

  return (
    <a
      href={`#${targetId}`}
      className="skip-to-content"
      onClick={handleClick}
    >
      {label}
    </a>
  );
};

export default SkipToContent;