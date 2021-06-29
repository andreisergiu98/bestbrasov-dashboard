import { StrictMode } from 'react';
import { createRoot } from 'react-dom';
import reportWebVitals from './utils/reportWebVitals';
import App from './App';

const container = document.getElementById('root');
if (!container) {
	throw new Error('Root element is missing from HTML!');
}
const root = createRoot(container);

root.render(
	<StrictMode>
		<App />
	</StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
