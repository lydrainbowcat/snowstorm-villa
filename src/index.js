import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Game extends React.Component {
  render() {
    return (
      <div className="flex-row">
        <div className="flex-item">暴风雪山庄 Snowstorm Villa</div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
