import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/themes/light.css";
import "../src/assets/scss/app.scss";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "./store";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";

function getQueryParams() {
	const params = new URLSearchParams(window.location.search);
	return Object.fromEntries(params.entries());
}

// Function to extract and store token
function initializeAuth() {
	const queryParams = getQueryParams();
	const token = queryParams['a']; // Assuming the token is in the query parameter 'a'
	const user 	= queryParams['user']

	console.log("Log Find Query : ", token)
  
	if (token) {
		sessionStorage.clear()
		sessionStorage.removeItem('_aT')

	  	sessionStorage.setItem('_aT', token);
		sessionStorage.setItem("user", user);
	}
}
  
// Extract token and store it in sessionStorage
initializeAuth();

ReactDOM.createRoot(document.getElementById("root")).render(
	<>
		<BrowserRouter>
			<Provider store={store}>
				<App />
			</Provider>
		</BrowserRouter>
	</>
);
