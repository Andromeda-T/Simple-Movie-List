import React from "react";
import ReactDOM from "react-dom/client";
// import StarRating from "./starRating";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
        {/* <StarRating
            maxRating={5}
            size="48px"
            color="#fcc419"
            message={["Terrible", "bad", "nice", "good", "perfect"]}
            defaultRating={1}
        /> */}
    </React.StrictMode>
);
