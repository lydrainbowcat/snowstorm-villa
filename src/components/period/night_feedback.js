import React from "react";
import { observer } from "mobx-react";
import {Combobox} from "react-widgets";
import PlaceTable from "../place/place_table";

import ENUM from "../../lib/constants/enum";
import PERIOD from "../../lib/constants/period";
import gameStore from "../../lib/store/game_store";
import placeStore from "../../lib/store/place_store";
import roleStore from "../../lib/store/role_store";
import nightActionStore from "../../lib/store/night_action_store";
import dayActionStore from "../../lib/store/day_action_store";

import CommonProcessor from "../../lib/processor/common";
import SkillProcessor from "../../lib/processor/skill";
import KillerProcessor from "../../lib/processor/killer";

@observer
class NightFeedback extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      doJoviality: false,
      doSacrifice: false,
      doScud: false,
      scudTarget: null,
      perfumeTarget: null,
      flowingTarget: null,
      struggleTarget: null,
      clearExtra: false,
      bedroomExtraClew: null
    };
  }

  handleSubmit(e) {
    e.preventDefault();

    const {doJoviality, doSacrifice, doScud, scudTarget, perfumeTarget, flowingTarget, struggleTarget, clearExtra, bedroomExtraClew} = this.state;
    const {targetType, targetRole, targetPlace, perfumeActive, flowingActive, struggleFrom, whitsundays, nightmare} = nightActionStore;
    const killer = gameStore.killer;

    // 女医生<香水>
    if (perfumeActive && !clearExtra) {
      if (perfumeTarget === null) return;
      SkillProcessor.addPerfumeExtraClew(perfumeTarget);
    }

    // 卫生间<流水2>
    if (flowingActive && !clearExtra) {
      if (flowingTarget === null) return;
      SkillProcessor.addFlowingExtraClews(flowingTarget);
    }

    // 卧室<密室3>
    if (gameStore.bedroomExtraActive === 1) {
      if (!clearExtra) {
        if (bedroomExtraClew === null || bedroomExtraClew.name === "") return;
        placeStore.getPlace(ENUM.PLACE.BEDROOM).extraClews.push(bedroomExtraClew.title);
      }
      gameStore.bedroomExtraActive = 2;
    }

    // 猎人<求生本能>
    if (struggleFrom) {
      if (struggleTarget === null) return;
      SkillProcessor.struggleToPlace(struggleTarget);
    }

    // 神秘人<轻车熟路1>
    if (clearExtra) {
      SkillProcessor.actExpert(killer);
    }

    // 愉悦
    if (doJoviality) {
      const jovialityTargetPlace = targetType === "place" ? targetPlace : targetRole.location;
      CommonProcessor.actNightMove(killer, jovialityTargetPlace);
    }

    // 疾行
    if (doScud && scudTarget !== null) {
      CommonProcessor.actNightMove(killer, scudTarget);
      gameStore.setScudUsed(true);
    }

    // 献祭
    gameStore.setKillerSacrificing(doSacrifice);

    // 灵媒<降灵>失效
    if (whitsundays.used) {
      SkillProcessor.recoverWhitsundays();
    }

    // 学生<旧日梦魇>在次日白天的持续效果生效
    if (nightmare.hasKeen) {
      dayActionStore.nightmare.keenUntilNight = roleStore.getRole(ENUM.ROLE.STUDENT);
      dayActionStore.nightmare.keenUntilNight.keen = 1;
    }
    if (nightmare.resultPlace) {
      dayActionStore.nightmare.place = nightmare.resultPlace;
      dayActionStore.nightmare.moved = false;
    }

    // 卧室<密室1>
    const bedroom = placeStore.getPlace(ENUM.PLACE.BEDROOM);
    if (bedroom.roles.length === 0 && bedroom.bodies.length === 1) {
      bedroom.sealed = true;
    }

    CommonProcessor.discoverPlacesAtDawn();
    nightActionStore.renew();

    gameStore.nextDay();
    gameStore.setPeriod(PERIOD.CONFIRM_DEATH);
  }

  render() {
    const motivationNames = gameStore.motivations.map(m => m.name);
    const scudUsed = gameStore.scudUsed;
    const bedroomExtraActive = gameStore.bedroomExtraActive;
    const {doJoviality, doSacrifice, doScud, scudTarget, clearExtra} = this.state;
    const {targetType, targetRole, targetPlace, canJoviality, perfumeActive, flowingActive, struggleFrom} = nightActionStore;
    const places = placeStore.places;

    let jovialityDisplay = "";
    if (canJoviality) {
      jovialityDisplay = <div className="col text-left">
        <input type="checkbox"
               className="spacing-inline-5"
               checked={doJoviality}
               onChange={value => this.setState({doJoviality: value.currentTarget.checked})}
        />
        {`<愉悦>至${targetType === "role" ? `${targetRole.title}所在地` : targetPlace.title}`}
      </div>;
    } else {
      jovialityDisplay = <div className="col text-left">
        <span className="spacing-inline-5">
          {`行凶失败，无法发动<愉悦>`}
        </span>
      </div>;
    }

    return (
      <div className="container">
        <PlaceTable/>

        <h5 className="text-center spacing-20">
          作案反馈
          <p><small><small>以下内容反馈给凶手，并由凶手选择相应行动</small></small></p>
        </h5>

        {motivationNames.indexOf("joviality") >= 0 && (
          <div className="row spacing-20">
            {jovialityDisplay}
          </div>
        )}

        {!scudUsed && (
          <div className="row align-items-center spacing-20">
            <div className="col-3 text-left">
              <input type="checkbox"
                     className="spacing-inline-5"
                     checked={doScud}
                     onChange={value => this.setState({doScud: value.currentTarget.checked})}/>
              {"<疾行>至"}
            </div>
            <div className="col-7 text-left">
              <Combobox
                data={places}
                value={scudTarget}
                valueField="name"
                textField="title"
                disabled={!doScud}
                onChange={value => this.setState({scudTarget: value})}
              />
            </div>
          </div>
        )}

        {motivationNames.indexOf("sacrifice") >= 0 && (
          <div className="row spacing-20">
            <div className="col text-left">
              <input type="checkbox"
                     className="spacing-inline-5"
                     checked={doSacrifice}
                     onChange={value => this.setState({doSacrifice: value.currentTarget.checked})}
              />
              {"发动技能<献祭>"}
            </div>
          </div>
        )}

        {SkillProcessor.judgeRoleHasSkill(gameStore.killer, ENUM.SKILL.MISTERIOUS_MAN_EXPERT_1) && (
          <div className="row align-items-center spacing-20">
            <div className="col-3 text-left">
                <input type="checkbox"
                    className="spacing-inline-5"
                    checked={clearExtra}
                    onChange={value => this.setState({clearExtra: value.currentTarget.checked})}
                />
                {"清除额外"}
            </div>
            <div className="col-9 text-left">
              <small>{"当晚谋杀产生下列额外线索，可发动<轻车熟路1>全部清除"}</small>
              <div>{`${placeStore.getAllExtraClews().join("，") || "无额外线索"}`}</div>
            </div>
          </div>
        )}

        {perfumeActive && !clearExtra && <div className="row spacing-20">
          <div className="col-3 text-left">
            <div className="spacing-5">{"女医生<香水>"}</div>
          </div>
          <div className="col-7 text-left">
            <Combobox
              data={places.filter(p => p.name !== gameStore.killer.location.name)}
              valueField="name"
              textField="title"
              onChange={value => this.setState({perfumeTarget: value})}
            />
            <small>{"凶手选择一个地点，与凶手过夜地出现额外<气味>"}</small>
          </div>
        </div>}

        {bedroomExtraActive === 1 && !clearExtra && <div className="row spacing-20">
          <div className="col-3 text-left">
            <div className="spacing-5">{"卧室<密室3>"}</div>
          </div>
          <div className="col-7 text-left">
            <Combobox
              data={KillerProcessor.getAvailableClews()}
              valueField="name"
              textField="title"
              onChange={value => this.setState({bedroomExtraClew: value})}
            />
            <small>{"凶手第一次点杀卧室角色，需要留下一条额外线索"}</small>
          </div>
        </div>}

        {flowingActive && !clearExtra && <div className="row spacing-20">
          <div className="col-3 text-left">
            <div className="spacing-5">{"卫生间<流水2>"}</div>
          </div>
          <div className="col-7 text-left">
            <Combobox
              data={places.filter(p => p.name !== gameStore.killer.location.name)}
              valueField="name"
              textField="title"
              onChange={value => this.setState({flowingTarget: value})}
            />
            <small>{"凶手选择一个地点，与凶手过夜地出现额外<水迹>"}</small>
          </div>          
        </div>}

        <h5 className="text-center spacing-20">
          受困者行动
          <p><small><small>以下内容反馈给对应受困者，并由受困者发动技能</small></small></p>
        </h5>

        {struggleFrom && <div className="row spacing-20">
          <div className="col-3 text-left">
            <div className="spacing-5">{"猎人<求生本能>"}</div>
          </div>
          <div className="col-7 text-left">
            <Combobox
              data={places}
              valueField="name"
              textField="title"
              onChange={value => this.setState({struggleTarget: value})}
            />
            <small>{"猎人选择一个地点，转移自己的尸体"}</small>
          </div>
        </div>}

        <div className="row">
          <div className="col text-right">
            <button type="button" className="btn btn-outline-success spacing-20"
                    onClick={this.handleSubmit}>
              天亮
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default NightFeedback;
