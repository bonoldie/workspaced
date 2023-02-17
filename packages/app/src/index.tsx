// import from the new react client API 
import { createRoot } from 'react-dom/client';

// include styles for compilation
import './app.scss';

const rootDiv = document.createElement('div');
document.body.appendChild(rootDiv);

const root = createRoot(
    rootDiv
);

root.render(
    <div>App</div>
)

