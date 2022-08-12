import React, { useState } from "react";
import "antd/dist/antd.css";
import "./App.css";
import { Button, Form, Input, Select } from "antd";

const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const App = () => {
  const [form] = Form.useForm();
  const [relationForm] = Form.useForm();
  const [friendsList, setFriendsList] = useState([
    {
      name: "sameer",
      friends: ["aayushi", "kamalnath"],
    },
    {
      name: "aayushi",
      friends: ["bhaskar"],
    },
    {
      name: "kamalnath",
      friends: ["shanti"],
    },
    {
      name: "shanti",
      friends: ["bhaskar"],
    },
  ]);
  const [foundRelation, setFoundRelation] = useState(null);

  // preprocess a JSON list of connections to an adjacency list Graph
  function connectionsListToGraph(friendsList) {
    const Graph = {};
    for (let { name, friends } of friendsList) {
      Graph[name] = friends; // allow fast lookup of a given person's friends
    }
    return Graph;
  }

  // return the list of connections between source and target
  function getConnections(source, target, friendsList) {
    const Graph = connectionsListToGraph(friendsList);
    const connectionPaths = [];

    function findConnectionsDFS(source, target, path = [source], visited = {}) {
      // Don't search/visit the same friend twice (to avoid infinite loops)
      if (visited[source]) return;

      // mark that we've searched the current source friend
      visited[source] = true;
      // console.log("GRAPH >>>>>>>>", Graph, source);
      for (let friend of Graph[source]) {
        if (friend === target) {
          connectionPaths.push(path.concat(target));
        } else {
          findConnectionsDFS(friend, target, path.concat(friend), visited);
        }
      }
    }
    findConnectionsDFS(source, target);
    return connectionPaths;
  }

  const onRelationSearch = (values) => {
    const relations = getConnections(
      values.firstUser,
      values.secondUser,
      friendsList
    );
    let relationString = [];
    for (let i = 0; i < relations.length; i++) {
      console.log("This is count", relations[i]);

      const str = relations[i].toString().replace(/,/g, " > ");
      relationString.push(str);
      console.log("this is ??????", relationString);
      setFoundRelation(relationString);
    }

    // const str = relations[0].toString();
    // const newRelations = str.replace(/,/g, " > ");
    // console.log(newRelations);
    // console.log(
    //   `This is relation ${values.firstUser} to ${values.secondUser}:`,
    //   relations
    // );
    // setFoundRelation(newRelations);
  };

  const onFinish = (values) => {
    const indexOfFirstPerson = friendsList.findIndex(
      (i) => i.name === values.firstPerson
    );
    if (indexOfFirstPerson >= 0) {
      const tempList = friendsList;
      if (!tempList[indexOfFirstPerson].friends.includes(values.secondPerson)) {
        tempList[indexOfFirstPerson].friends.push(values.secondPerson);
        console.log("Already present!", indexOfFirstPerson, tempList);
        setFriendsList(tempList);
      } else {
        console.error("REPEATED FRIEND!!");
      }
    } else {
      setFriendsList([
        ...friendsList,
        {
          name: values.firstPerson,
          friends: [values.secondPerson],
        },
      ]);
      console.log("Updated List!", [
        ...friendsList,
        {
          name: values.firstPerson,
          friends: [values.secondPerson],
        },
      ]);
    }
  };

  return (
    <div className="container">
      <div className="subContainer">
        <h2 style={{ textAlign: "center" }}>Add Friends</h2>
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
          <Form.Item
            name="firstPerson"
            label="First Person"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="secondPerson"
            label="Second Person"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="friend"
            label="Friend"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Select placeholder="Relation between them" allowClear>
              <Option value="friend">Friend</Option>
            </Select>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.gender !== currentValues.gender
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("gender") === "other" ? (
                <Form.Item
                  name="customizeGender"
                  label="Customize Gender"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              ) : null
            }
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Add Friends
            </Button>
          </Form.Item>
        </Form>
      </div>
      <br />
      <br />
      <br />
      <div className="subContainer">
        <h2 style={{ textAlign: "center" }}>Find Related friends</h2>
        <Form
          {...layout}
          form={relationForm}
          name="searchRelation"
          onFinish={onRelationSearch}
        >
          <Form.Item
            name="firstUser"
            label="First Person"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="secondUser"
            label="Second Person"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.gender !== currentValues.gender
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("gender") === "other" ? (
                <Form.Item
                  name="customizeGender"
                  label="Customize Gender"
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              ) : null
            }
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div
        className="section"
        style={{
          border: foundRelation ? "1px solid black" : null,
        }}
      >
        {foundRelation ? (
          <div>
            <h1>Degree of seperation</h1>
            {foundRelation?.map((item, i) => {
              return <h3 key={i}>{item}</h3>;
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default App;
