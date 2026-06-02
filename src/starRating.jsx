import { useState } from "react";

const containerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px"
};

const StarContainerStyle = {
    display: "flex"
};

export default function StarRating({
    maxRating = 5,
    color = "#fcc419",
    size = "48px",
    message = [],
    defaultRating = 0
}) {
    const startStyle = {
        height: size,
        width: size,
        backGroundColor: color,
        display: "block",
        cursor: "pointer"
    };

    const textStyle = {
        fontSize: "2rem",
        color,
        lineHeight: "1",
        margin: "0"
    };

    const [curStar, setCurStar] = useState(defaultRating);
    const [curHover, setCurHover] = useState(defaultRating);
    return (
        <div style={containerStyle}>
            <div style={StarContainerStyle}>
                {Array.from({ length: maxRating }, (_, i) => (
                    <Star
                        setCurHover={setCurHover}
                        curHover={curHover}
                        curStar={curStar}
                        setCurStar={setCurStar}
                        value={i + 1}
                        key={i}
                        startStyle={startStyle}
                    />
                ))}
            </div>
            <p style={textStyle}>
                {maxRating === message.length
                    ? message[curStar > curHover ? curStar - 1 : curHover - 1]
                    : curStar > curHover
                      ? curStar
                      : curHover}
            </p>
        </div>
    );
}

function Star({
    value,
    setCurStar,
    curStar,
    curHover,
    setCurHover,
    startStyle
}) {
    return (
        <>
            {curStar >= value || curHover >= value ? (
                <svg
                    onClick={() => {
                        setCurStar(value);
                    }}
                    onMouseEnter={() => setCurHover(value)}
                    onMouseLeave={() => setCurHover(0)}
                    role="button"
                    style={startStyle}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill={startStyle.backGroundColor}
                    stroke={startStyle.backGroundColor}
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ) : (
                <svg
                    onClick={() => {
                        setCurStar(value);
                    }}
                    onMouseEnter={() => setCurHover(value)}
                    onMouseLeave={() => setCurHover(0)}
                    role="button"
                    style={startStyle}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke={startStyle.backGroundColor}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="{2}"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                </svg>
            )}
        </>
    );
}
