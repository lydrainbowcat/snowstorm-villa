import React from "react";
import PropTypes from "prop-types";
import ListView from "./list_view";
import Utils from "../../lib/utils";
import GLOBAL from "../../lib/constants/global";

class RoleSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: props.roles,
      choices: [],
      specificKillerAndFool: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleRandomSelection = this.handleRandomSelection.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.choices, this.state.specificKillerAndFool);
    }
  }

  handleSelect(item) {
    const {options, choices} = this.state;
    const newOptions = options.filter(val => val !== item);
    const newChoices = choices.slice();
    newChoices.push(item);
    this.setState({
      options: newOptions,
      choices: newChoices
    });
  }

  handleRemove(item) {
    const {options, choices} = this.state;
    const newOptions = options.slice();
    const newChoices = choices.filter(val => val !== item);
    newOptions.push(item);
    this.setState({
      options: newOptions,
      choices: newChoices
    });
  }

  handleRandomSelection(cnt) {
    const {options, choices} = this.state;
    const items = [];
    for (let i = 0; i < cnt; i++) {
      const item = Utils.randElementExceptIn(options, items);
      items.push(item);
    }
    const newOptions = options.filter(val => items.indexOf(val) === -1);
    const newChoices = choices.concat(items);
    this.setState({
      options: newOptions,
      choices: newChoices
    });    
  }

  render() {
    const {options, choices} = this.state;
    const canStart = choices.length >= 6 && choices.length <= 20;

    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <h5 className="text-center spacing-20">可选择的角色</h5>
            <ListView
              items={options}
              onItemClick={this.handleSelect}
            />
          </div>
          <div className="col">
            <h5 className="text-center spacing-20">已选择的角色</h5>
            <ListView
              items={choices}
              onItemClick={this.handleRemove}
            />
            <div className="row spacing-20">
              <div className="col text-center">
                <label>
                  <input type="checkbox" className="spacing-inline-5" checked={this.state.specificKillerAndFool}
                         onChange={e => this.setState({specificKillerAndFool: e.target.checked})}
                  />
                  指定前两名角色为凶手和愚者
                </label>
              </div>
            </div>
            <div className="row">
              <div className="col text-center">
                {GLOBAL.DEBUGGING &&
                <button type="button" className="btn btn-outline-primary spacing-inline-10"
                        onClick={() => this.handleRandomSelection(6)} disabled={choices.length > 2}>
                  随机6名角色
                </button>}
                <button type="button" className="btn btn-outline-success"
                        onClick={this.handleSubmit} disabled={!canStart}>
                  开局
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RoleSelector.propTypes = {
  roles: PropTypes.array.isRequired,
  onSubmit: PropTypes.func
};

export default RoleSelector;
