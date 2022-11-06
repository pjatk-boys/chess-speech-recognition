/* @refresh reload */
import { render } from 'solid-js/web';
import "modern-normalize/modern-normalize.css"
import "./index.scss"

import App from './App';

render(() => <App />, document.getElementById('root') as HTMLElement);
