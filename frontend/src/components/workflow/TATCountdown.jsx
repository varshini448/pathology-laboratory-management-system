import React, { useEffect, useState } from "react";

const getRemainingTime = (targetTime) => {
  if (!targetTime) {
    return null;
  }

  const difference = new Date(targetTime).getTime() - Date.now();

  if (difference <= 0) {
    return {
      expired: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const totalSeconds = Math.floor(difference / 1000);

  return {
    expired: false,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
};

const TATCountdown = ({
  targetTime,
  label = "TAT Remaining",
}) => {
  const [remaining, setRemaining] = useState(() =>
    getRemainingTime(targetTime)
  );

  useEffect(() => {
    setRemaining(getRemainingTime(targetTime));

    if (!targetTime) {
      return undefined;
    }

    const interval = setInterval(() => {
      setRemaining(getRemainingTime(targetTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  if (!targetTime || !remaining) {
    return null;
  }

  return (
    <div
      className={`workflow-tat-countdown ${
        remaining.expired ? "expired" : ""
      }`}
    >
      <span className="workflow-tat-label">{label}</span>

      {remaining.expired ? (
        <strong>TAT Expired</strong>
      ) : (
        <div className="workflow-tat-time">
          {remaining.days > 0 && (
            <span>
              <strong>{remaining.days}</strong>
              d
            </span>
          )}

          <span>
            <strong>{String(remaining.hours).padStart(2, "0")}</strong>
            h
          </span>

          <span>
            <strong>{String(remaining.minutes).padStart(2, "0")}</strong>
            m
          </span>

          <span>
            <strong>{String(remaining.seconds).padStart(2, "0")}</strong>
            s
          </span>
        </div>
      )}
    </div>
  );
};

export default TATCountdown;