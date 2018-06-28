import React from "react";
import ReactDOM from "react-dom";
import RoleSelector from "./components/start/role_selector";
import InitialPlaceSelector from './components/start/initial_place_selector'
import PlaceTable from "./components/place/place_table";
import Log from "./components/log/log";
import roles from "./lib/role";
import places from "./lib/place";
import "./style/index.css";
import 'react-widgets/dist/css/react-widgets.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleGameStart = this.handleGameStart.bind(this);
    this.state = {
      period: 0,
      logs: [],
      roles: [],
      places: {}
    };
  }

  handleGameStart(selectedRoles) {
    const newLogs = this.state.logs.slice(); // make a copy
    newLogs.push({
      text: `${selectedRoles.length} 人开局：${selectedRoles.map(role => role.title).join("，")}`
    });

    const activePlaces = places.filter(place => selectedRoles.length >= place.enabled);
    activePlaces.forEach(place => {
      place.roles = place.name === "living_room" ? selectedRoles : [];
    });
    selectedRoles.forEach(role => {
      role.location = "living_room";
    });

    this.setState({
      period: 1,
      logs: newLogs,
      roles: selectedRoles,
      places: activePlaces
    });
  }

  renderActionArea(period) {
    switch (period) {
      case 0:
        return <RoleSelector
          roles={roles}
          onSubmit={this.handleGameStart}
        />;
      case 1:
        return <InitialPlaceSelector
          roles={this.state.roles}
          places={this.state.places}
        />;
    }
  }

  render() {
    const {period, places, logs} = this.state;

    return (
      <div className="container-fluid index-area">
        <div className="row">
          <div className="col-7">
            {this.renderActionArea(period)}
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
  <App/>,
  document.getElementById('root')
);
