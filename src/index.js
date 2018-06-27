import React from "react";
import ReactDOM from "react-dom";
import RoleSelector from "./components/start/role_selector";
import PlaceTable from "./components/place/place_table";
import Log from "./components/log/log";
import roles from "./lib/role.js";
import places from "./lib/place.js";
import "./style/index.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleGameStart = this.handleGameStart.bind(this);
    this.state = {
      period: 0,
      logs: [],
      places: {}
    };
  }

  handleGameStart(selectedRoles) {
    const newLogs = this.state.logs.slice(); // make a copy
    newLogs.push({
      text: `${selectedRoles.length} 人开局：${selectedRoles.map(role => role.title).join("，")}`
    });

    const activePlaces = places.filter(place => selectedRoles.length >= place.enabled);
    const placeMap = {};
    activePlaces.forEach(place => {
      placeMap[place.name] = Object.assign({}, place); // make a copy
      placeMap[place.name].roles = place.name === "living_room" ? selectedRoles : [];
    });

    this.setState({
      period: 1,
      logs: newLogs,
      places: placeMap
    });
  }

  renderActionArea(period, places) {
    switch (period) {
    case 0:
      return <RoleSelector
        roles={roles}
        onSubmit={this.handleGameStart}
      />;
    case 1:
      return <PlaceTable
        places={places}
      />;
    }    
  }

  render() {
    const { period, places, logs } = this.state;

    return (
      <div className="container-fluid index-area">
        <div className="row">
          <div className="col-7">
            {this.renderActionArea(period, places)}
          </div>
          <div className="col-5">
            <Log
              logs={logs}
            />
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
