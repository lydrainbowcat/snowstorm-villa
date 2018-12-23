import React from "react";
import {observer} from "mobx-react";
import {DropdownList} from "react-widgets";

import CLEWS from "../../lib/constants/clew";
import METHODS from "../../lib/constants/method";
import ENUM from "../../lib/constants/enum";

import gameStore from "../../lib/store/game_store";
import placeStore from "../../lib/store/place_store";
import roleStore from "../../lib/store/role_store";
import nightActionStore from "../../lib/store/night_action_store";
import KillerProcessor from "../../lib/processor/killer";
import SkillProcessor from "../../lib/processor/skill";

@observer
class KillerAction extends React.Component {
  render() {
    const {targetType, targetRole, targetPlace, method, clew, trickMethod, trickClew, implyMethod, implyClew, shootPlace, scudBeforeKilling} = nightActionStore;
    const killer = gameStore.killer;

    const roles = roleStore.roles.filter(role => role.name !== killer.name);
    const places = placeStore.places;

    const methods = KillerProcessor.getAvailableMethods();
    const clews = KillerProcessor.getAvailableClews();

    return (
      <div className="container">
        <h5 className="text-center spacing-20">刀法</h5>
        <div className="alert alert-info fade show alert-thin-gutters spacing-20">
          <small>
            {`凶手若要得知自己的技能反馈，可以先不填刀法，点击"结算"，之后再重新提交`}<br/>
            {`道具师若要通过<人偶>技能不留线索，需在"线索"下拉框中选择专门的"空"选项`}
          </small>
        </div>

        {
          !gameStore.scudUsed &&
          <div className="row align-items-center spacing-10">
            <div className="col-4 text-right">
              <label>
                <input type="checkbox"
                       className="spacing-inline-5"
                       checked={scudBeforeKilling.enabled}
                       onChange={value => nightActionStore.enableScudBeforeKilling(value.currentTarget.checked)}/>
                {"作案前<疾行>至"}
              </label>
            </div>
            <div className="col-8">
              <DropdownList
                data={places}
                value={scudBeforeKilling.place}
                valueField="name"
                textField="title"
                disabled={!scudBeforeKilling.enabled}
                onChange={value => nightActionStore.scudBeforeKilling.place = value}
              />
            </div>
          </div>
        }

        <div className="row align-items-center spacing-10">
          <div className="col-2 text-right">
            <input type="radio"
                   className="spacing-inline-5"
                   value="role"
                   name="target_type_radio"
                   checked={targetType === "role"}
                   onChange={value => {
                     nightActionStore.setTargetType(value.currentTarget.value);
                   }}
            />
            点杀
          </div>
          <div className="col-4">
            <DropdownList
              data={roles}
              value={targetRole}
              valueField="name"
              textField="title"
              disabled={targetType !== "role"}
              onChange={value => {
                nightActionStore.setTargetRole(value);
              }}
            />
          </div>
          <div className="col-2 text-right">
            <input type="radio"
                   className="spacing-inline-5"
                   value="place"
                   name="target_type_radio"
                   checked={targetType === "place"}
                   onChange={value => {
                     nightActionStore.setTargetType(value.currentTarget.value);
                   }}
            />
            群杀
          </div>
          <div className="col-4">
            <DropdownList
              data={places}
              value={targetPlace}
              valueField="name"
              textField="title"
              disabled={targetType !== "place"}
              onChange={value => {
                nightActionStore.setTargetPlace(value);
              }}
            />
          </div>
        </div>
        <div className="row align-items-center spacing-10">
          <div className="col-2 text-right">
            手法
          </div>
          <div className="col-4">
            <DropdownList
              data={methods}
              value={method}
              valueField="name"
              textField="title"
              onChange={value => {
                nightActionStore.setMethod(value);
              }}
            />
          </div>
          <div className="col-2 text-right">
            线索
          </div>
          <div className="col-4">
            <DropdownList
              data={clews}
              value={clew}
              valueField="name"
              textField="title"
              onChange={value => {
                nightActionStore.setClew(value);
              }}
            />
          </div>
        </div>

        {
          SkillProcessor.judgeRoleHasSkill(killer, ENUM.SKILL.PROPSMAN_PROPSBOX) || // 道具师<道具箱>无法设置诡计信息
          <div className="row align-items-center spacing-10">
            <div className="col-2 text-right">
              假手法
            </div>
            <div className="col-4">
              <DropdownList
                data={METHODS}
                value={trickMethod}
                valueField="name"
                textField="title"
                onChange={value => {
                  nightActionStore.setTrickMethod(value);
                }}
              />
            </div>
            <div className="col-2 text-right">
              假线索
            </div>
            <div className="col-4">
              <DropdownList
                data={CLEWS}
                value={trickClew}
                valueField="name"
                textField="title"
                onChange={value => {
                  nightActionStore.setTrickClew(value);
                }}
              />
            </div>
          </div>
        }

        {
          SkillProcessor.judgeRoleHasSkill(killer, ENUM.SKILL.FEMALE_DOCTOR_MIND_IMPLY_2) && // 女医生<心理暗示2>
          targetType === "role" && targetRole !== null && method !== null && method.name === "poison" &&
          <div className="row align-items-center spacing-10">
            <div className="col-2 text-right">
              心理暗示手法
            </div>
            <div className="col-4">
              <DropdownList
                data={KillerProcessor.getAvailableMethodsByRole(targetRole)}
                value={implyMethod}
                valueField="name"
                textField="title"
                onChange={value => {
                  nightActionStore.setImplyMethod(value);
                }}
              />
            </div>
            <div className="col-2 text-right">
              心理暗示线索
            </div>
            <div className="col-4">
              <DropdownList
                data={KillerProcessor.getAvailableClewsByRole(targetRole)}
                value={implyClew}
                valueField="name"
                textField="title"
                onChange={value => {
                  nightActionStore.setImplyClew(value);
                }}
              />
            </div>
          </div>
        }

        {
          targetType === "role" && targetRole !== null && method !== null && method.name === "shoot" &&
          <div className="row align-items-center spacing-10">
            <div className="col-3 text-right">
              枪杀放置尸体
            </div>
            <div className="col-9">
              <DropdownList
                data={places}
                value={shootPlace}
                valueField="name"
                textField="title"
                onChange={value => {
                  nightActionStore.setShootPlace(value);
                }}
              />
            </div>
          </div>
        }
      </div>
    );
  }
}

KillerAction.propTypes = {};

export default KillerAction;
