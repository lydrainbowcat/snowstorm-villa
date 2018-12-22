import React from "react";
import { observer } from "mobx-react";
import {Combobox} from "react-widgets";
import PlaceTable from "../place/place_table";

import ENUM from "../../lib/constants/enum";
import CLEWS from "../../lib/constants/clew";
import PERIOD from "../../lib/constants/period";

import archive from "../../lib/store/archive";
import gameStore from "../../lib/store/game_store";
import logStore from "../../lib/store/log_store";
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
      fierceExtraClew: null,
      bedroomExtraClew: null,
      crimeGeniusClew: null,
      crimeGeniusPlace: null
    };
  }

  handleSubmit(e) {
    e.preventDefault();

    const {doJoviality, doSacrifice, doScud, scudTarget, perfumeTarget, flowingTarget, struggleTarget, clearExtra, fierceExtraClew, bedroomExtraClew, crimeGeniusClew, crimeGeniusPlace} = this.state;
    const {targetType, targetRole, targetPlace, fierceExtraActive, perfumeActive, flowingActive, struggleActive, whitsundays, nightmare} = nightActionStore;
    const killer = gameStore.killer;

    // [善战]
    if (fierceExtraActive) {
      if (fierceExtraClew === null || fierceExtraClew.name === "") return;
      gameStore.usedClewsName.push(fierceExtraClew.name);
      if (!clearExtra) { // 选择清除额外线索时，仍需消耗一条，但不遗留
        targetRole.location.extraClews.push(fierceExtraClew);
        logStore.addLog(`由于[善战]技能，${targetRole.location.title}产生了额外线索<${fierceExtraClew.title}>`);
      }
      nightActionStore.fierceExtraActive = false;
    }

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
      if (bedroomExtraClew === null || bedroomExtraClew.name === "") return;
      gameStore.usedClewsName.push(bedroomExtraClew.name);
      if (!clearExtra && !SkillProcessor.judgeRoleHasSkill(killer, ENUM.SKILL.MANAGER_HOST_ADVANTAGE_2)) { // 选择清除额外线索时，仍需消耗一条，但不遗留
        placeStore.getPlace(ENUM.PLACE.BEDROOM).extraClews.push(bedroomExtraClew);
        logStore.addLog(`由于<密室3>特性，卧室产生了额外线索<${bedroomExtraClew.title}>`);
      }
      gameStore.bedroomExtraActive = 2;
    }

    // 猎人<求生本能>
    if (struggleActive) {
      if (struggleTarget === null) return;
      SkillProcessor.struggleToPlace(struggleTarget);
    }

    // 神秘人<轻车熟路1>
    if (clearExtra) {
      SkillProcessor.actExpert(killer);
    }

    // 侦探<犯罪天才2>
    SkillProcessor.actCrimeGeinus(killer, crimeGeniusClew, crimeGeniusPlace);

    // 愉悦
    if (doJoviality) {
      const jovialityTargetPlace = targetType === "place" ? targetPlace : targetRole.location;
      CommonProcessor.actNightMove(killer, jovialityTargetPlace);
    }

    // 疾行
    if (doScud && scudTarget !== null) {
      gameStore.setScudUsed(scudTarget);
      CommonProcessor.actNightMove(killer, scudTarget);
    }

    // 献祭
    gameStore.setKillerSacrificing(doSacrifice);

    // 灵媒<降灵>失效
    if (whitsundays.used) {
      SkillProcessor.recoverWhitsundays();
    }

    // 学生<旧日梦魇>在次日白天的持续效果生效
    if (roleStore.getRole(ENUM.ROLE.STUDENT) !== null) {
      if (nightmare.hasKeen) {
        dayActionStore.nightmare.keenUntilNight = roleStore.getRole(ENUM.ROLE.STUDENT);
        dayActionStore.nightmare.keenUntilNight.keen = 1;
      }
      if (nightmare.resultPlace) {
        dayActionStore.nightmare.place = nightmare.resultPlace;
        dayActionStore.nightmare.moved = false;
      }
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
    archive.save();
  }

  render() {
    const motivationNames = gameStore.motivations.map(m => m.name);
    const scudUsed = gameStore.scudUsed;
    const bedroomExtraActive = gameStore.bedroomExtraActive;
    const {doJoviality, doSacrifice, doScud, scudTarget, clearExtra, crimeGeniusClew, crimeGeniusPlace} = this.state;
    const {targetType, targetRole, targetPlace, canJoviality, fierceExtraActive, perfumeActive, flowingActive, struggleActive} = nightActionStore;
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
        <p className="spacing-10">{"技能的发动顺序为：<愉悦>移动、<疾行>移动、天亮获取犯罪信息"}</p>
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

        {targetType === "role" && SkillProcessor.judgeRoleHasSkill(gameStore.killer, ENUM.SKILL.MISTERIOUS_MAN_EXPERT_1) && (
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
              <small>{"当晚点杀产生下列额外线索，可发动<轻车熟路1>全部清除"}</small>
              <div>{`${placeStore.getAllExtraClewTitles().join("，") || "无额外线索"}`}</div>
            </div>
          </div>
        )}

        {perfumeActive && !clearExtra && <div className="row spacing-20">
          <div className="col-3 text-left">
            <div className="spacing-5">{"女医生\n<香水>"}</div>
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

        {bedroomExtraActive === 1 && <div className="row spacing-20">
          <div className="col-3 text-left">
            <div className="spacing-5">{"卧室\n<密室3>"}</div>
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

        {fierceExtraActive && <div className="row spacing-20">
          <div className="col-3 text-left">
            <div className="spacing-5">{"善战"}</div>
          </div>
          <div className="col-7 text-left">
            <Combobox
              data={KillerProcessor.getAvailableClews()}
              valueField="name"
              textField="title"
              onChange={value => this.setState({fierceExtraClew: value})}
            />
            <small>{"凶手成功点杀[善战]角色，需要留下一条额外线索"}</small>
          </div>
        </div>}

        {flowingActive && !clearExtra && <div className="row spacing-20">
          <div className="col-3 text-left">
            <div className="spacing-5">{"卫生间\n<流水2>"}</div>
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

        {SkillProcessor.judgeRoleHasSkill(gameStore.killer, ENUM.SKILL.DETECTIVE_CRIME_GENIUS_2) && <div className="row spacing-20">
          <div className="col-3 text-left">
            <div className="spacing-5">{"侦探\n<犯罪天才2>"}</div>
          </div>
          <div className="col-9 text-left">
            <small>{"可在任意地点留下任意一条<痕迹>类额外线索"}</small>
            <div className="row align-items-center spacing-10">
              <div className="col-3 text-right">
                额外线索
              </div>
              <div className="col-8">
                <Combobox
                  data={CLEWS.filter(clew => clew.type === 0)}
                  value={crimeGeniusClew}
                  valueField="name"
                  textField="title"
                  onChange={value => this.setState({crimeGeniusClew: value})}
                />
              </div>
            </div>
            <div className="row align-items-center spacing-10">
              <div className="col-3 text-right">
                遗留地点
              </div>
              <div className="col-8">
                <Combobox
                  data={places}
                  value={crimeGeniusPlace}
                  valueField="name"
                  textField="title"
                  onChange={value => this.setState({crimeGeniusPlace: value})}
                />
              </div>
            </div>
          </div>
        </div>}

        <h5 className="text-center spacing-20">
          受困者行动
          <p><small><small>以下内容反馈给对应受困者，并由受困者发动技能</small></small></p>
        </h5>

        {struggleActive && <div className="row spacing-20">
          <div className="col-3 text-left">
            <div className="spacing-5">{"猎人\n<求生本能>"}</div>
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

        {roleStore.getRole(ENUM.ROLE.DETECTIVE) !== null && <div className="row spacing-20">
          <div className="col-3 text-left">
            {"侦探"}
          </div>
          <div className="col-9 text-left">
            <input type="checkbox"
                  className="spacing-inline-5"
                  checked={dayActionStore.detective}
                  onChange={() => { dayActionStore.detective = !dayActionStore.detective; }}
            />
            {"天亮时发动<平凡侦探>，保留获得的信息"}
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
