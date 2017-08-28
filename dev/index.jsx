import React from 'react';
import ReactDOM from 'react-dom';
import FormPage from './form-page';

const App = () => (
  <FormPage />
);

let rootDom = window.document.getElementById('react_root');
if (!rootDom) {
  rootDom = window.document.createElement('div');
  rootDom.setAttribute('id', 'react_root');
  const body = window.document.getElementsByTagName('body')[0];
  const scripts = body.getElementsByTagName('script')[0];
  if (scripts) {
    body.insertBefore(rootDom, scripts);
  } else {
    body.appendChild(rootDom);
  }
}

ReactDOM.render(<App />, rootDom);
