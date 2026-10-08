import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

const CAPTCHA_LENGTH = 6;

const generateCaptcha = () => {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  return Array.from({ length: CAPTCHA_LENGTH }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
};

const generateCharacterStyles = (captcha) =>
  captcha.split("").map((character, index) => ({
    character,
    rotate: Math.floor(Math.random() * 31) - 15,
    translateY: Math.floor(Math.random() * 11) - 5,
    fontSize: 22 + Math.floor(Math.random() * 7),
    opacity: 0.78 + Math.random() * 0.22,
    letterSpacing: index === captcha.length - 1 ? "0" : "1px",
  }));

const LoginCaptcha = ({ value, onChange, onCaptchaChange }) => {
  const [captcha, setCaptcha] = useState("");
  const [characterStyles, setCharacterStyles] = useState([]);

  const refreshCaptcha = () => {
    const newCaptcha = generateCaptcha();

    setCaptcha(newCaptcha);
    setCharacterStyles(generateCharacterStyles(newCaptcha));
    onCaptchaChange(newCaptcha);
    onChange("");
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  return (
    <div className="login-captcha">
      <div className="login-captcha-header">
        <label htmlFor="captcha">Security Verification</label>

        <button
          type="button"
          className="login-captcha-refresh"
          onClick={refreshCaptcha}
          aria-label="Generate a new CAPTCHA"
          title="Generate a new CAPTCHA"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="login-captcha-challenge" aria-label="CAPTCHA challenge">
        <div className="login-captcha-noise login-captcha-noise-one" />
        <div className="login-captcha-noise login-captcha-noise-two" />
        <div className="login-captcha-line login-captcha-line-one" />
        <div className="login-captcha-line login-captcha-line-two" />

        <div className="login-captcha-characters">
          {characterStyles.map((item, index) => (
            <span
              key={`${item.character}-${index}`}
              style={{
                transform: `rotate(${item.rotate}deg) translateY(${item.translateY}px)`,
                fontSize: `${item.fontSize}px`,
                opacity: item.opacity,
                letterSpacing: item.letterSpacing,
              }}
            >
              {item.character}
            </span>
          ))}
        </div>
      </div>

      <div className="login-captcha-input-wrapper">
        <input
          id="captcha"
          name="captcha"
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          placeholder="Enter the characters shown above"
          maxLength={CAPTCHA_LENGTH}
          autoComplete="off"
          spellCheck="false"
          aria-label="Enter CAPTCHA"
        />
      </div>
    </div>
  );
};

export default LoginCaptcha;
