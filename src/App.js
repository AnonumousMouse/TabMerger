import React, { useState, useEffect, useRef } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Tabs from "./Tabs.js";
import Group from "./Group.js";

import {
  MdSettings,
  MdDeleteForever,
  MdVerticalAlignCenter,
  MdAddCircle,
} from "react-icons/md";
import { FaTrashRestore } from "react-icons/fa";
import { BiArrowToRight } from "react-icons/bi";

export default function App() {
  const defaultColor = useRef(
    JSON.parse(window.localStorage.getItem("settings")).color || "#DEDEDE"
  );
  const defaultTitle = useRef(
    JSON.parse(window.localStorage.getItem("settings")).title || "Title"
  );

  const [tabTotal, setTabTotal] = useState(0);
  const [groups, setGroups] = useState(() => {
    var group_blocks = JSON.parse(window.localStorage.getItem("groups"));
    return group_blocks
      ? Object.keys(group_blocks).map((item) => {
          return (
            <Group
              id={item}
              className="group"
              title={group_blocks[item].title}
              color={group_blocks[item].color}
              created={new Date(group_blocks[item].created).toString()}
              key={Math.random()}
            >
              <Tabs setTabTotal={setTabTotal} id={item} />
            </Group>
          );
        })
      : [
          <Group
            id="group-0"
            className="group"
            title={defaultTitle.current}
            color={defaultColor.current}
            created={new Date(Date.now()).toString()}
            key={Math.random()}
          >
            <Tabs setTabTotal={setTabTotal} id="group-0" />
          </Group>,
        ];
  });

  // https://stackoverflow.com/a/5624139/4298115
  function rgb2hex(input) {
    var rgb = input.substr(4).replace(")", "").split(",");
    var hex = rgb.map((elem) => {
      let hex_temp = parseInt(elem).toString(16);
      return hex_temp.length === 1 ? "0" + hex_temp : hex_temp;
    });

    return "#" + hex.join("");
  }

  useEffect(() => {
    // once a group is added: for each group, store the title, background color, and tab information
    var group_blocks = document.querySelectorAll(".group");
    var ls_entry = {};
    for (let i = 0; i < group_blocks.length; i++) {
      ls_entry[group_blocks[i].id] = {
        title: group_blocks[i].parentNode.querySelector("div[editext='view']")
          .innerText,
        color: rgb2hex(group_blocks[i].style.background),
        created: group_blocks[i].parentNode.querySelector(".created").innerText,
        tabs: [],
      };

      var group_tabs = group_blocks[i].querySelectorAll(
        "div[draggable='true']"
      );

      var tabs_entry = [];
      for (let j = 0; j < group_tabs.length; j++) {
        tabs_entry.push({
          favIconUrl: group_tabs[j].querySelector("img").src,
          url: group_tabs[j].querySelector("a").href,
          title: group_tabs[j].querySelector("a").innerText,
        });
      }

      ls_entry[group_blocks[i].id].tabs = tabs_entry;
    }

    window.localStorage.setItem("groups", JSON.stringify(ls_entry));
    if (!window.localStorage.getItem("settings")) {
      window.localStorage.setItem(
        "settings",
        JSON.stringify({
          color: "#dedede",
          title: "Title",
          restore: "keep",
          blacklist: "",
        })
      );
    }
  }, [groups]);

  function sendMessage(msg) {
    chrome.runtime.sendMessage("kdkfmpamdkkhmoomellenejnnajpfhpk", msg);
  }

  const addGroup = () => {
    setGroups([
      ...groups,
      <Group
        id={"group-" + groups.length}
        className="group"
        key={Math.random()}
        color={defaultColor.current}
        title={defaultTitle.current}
        created={new Date(Date.now()).toString()}
      >
        <Tabs setTabTotal={setTabTotal} id={"group-" + groups.length} />
      </Group>,
    ]);
  };

  function openAllTabs() {
    var tabs = document.querySelectorAll(".draggable");
    tabs.forEach((tab) => {
      tab.querySelector("a").click();
    });
  }

  function deleteAllGroups() {
    window.localStorage.setItem(
      "groups",
      JSON.stringify({
        "group-0": {
          title: defaultTitle.current,
          color: defaultColor.current,
          created: new Date(Date.now()).toString(),
          tabs: [],
        },
      })
    );

    window.location.reload();
  }

  return (
    <div className="container">
      <h1>TabMerger</h1>
      <h3 id="tab-total">
        {tabTotal} tabs in total{" "}
        <span className="small">
          {tabTotal > 0 ? `Saved ~${tabTotal * 50}MB of RAM` : null}
        </span>
      </h3>
      <hr />
      <div className="row">
        <button
          id="merge-btn"
          className="ml-3 py-1 px-2 btn btn-outline-primary"
          type="button"
          onClick={() => sendMessage({ msg: "all" })}
        >
          <div className="tip">
            <MdVerticalAlignCenter
              style={{ transform: "rotate(90deg)" }}
              color="black"
              size="1.6rem"
            />
            <span className="tiptext">Merge ALL Tabs In Window</span>
          </div>
        </button>
        <button
          id="merge-right-btn"
          className="ml-1 py-1 px-2 btn btn-outline-warning"
          type="button"
          onClick={() => sendMessage({ msg: "right" })}
        >
          <div className="tip">
            <BiArrowToRight
              style={{ transform: "rotate(180deg)" }}
              color="black"
              size="1.3rem"
            />
            <span className="tiptext">Merge Tabs to the RIGHT</span>
          </div>
        </button>
        <button
          id="merge-left-btn"
          className="ml-1 py-1 px-2 btn btn-outline-warning"
          type="button"
          onClick={() => sendMessage({ msg: "left" })}
        >
          <div className="tip">
            <BiArrowToRight color="black" size="1.3rem" />
            <span className="tiptext">Merge Tabs to the LEFT</span>
          </div>
        </button>
        <button
          id="open-all-btn"
          className="ml-3 py-1 px-2 btn btn-outline-success"
          type="button"
          onClick={() => openAllTabs()}
        >
          <div className="tip">
            <FaTrashRestore color="green" size="1.3rem" />
            <span className="tiptext">Open All</span>
          </div>
        </button>
        <button
          id="delete-all-btn"
          className="ml-1 p-1 btn btn-outline-danger"
          type="button"
          onClick={() => deleteAllGroups()}
        >
          <div className="tip">
            <MdDeleteForever color="red" size="1.7rem" />
            <span className="tiptext">Delete All</span>
          </div>
        </button>
        <button
          id="options-btn"
          className="ml-3 py-1 px-2 btn btn-outline-dark"
          type="button"
          onClick={() =>
            window.location.replace(chrome.runtime.getURL("options.html"))
          }
        >
          <div className="tip">
            <MdSettings color="grey" size="1.6rem" />
            <span className="tiptext">Settings</span>
          </div>
        </button>
      </div>

      {groups}

      <button
        className="d-block mb-2 btn"
        id="add-group-btn"
        type="button"
        onClick={() => addGroup()}
      >
        <div className="tip">
          <MdAddCircle color="grey" size="2rem" />
          <span className="tiptext">Add Group</span>
        </div>
      </button>
    </div>
  );
}
