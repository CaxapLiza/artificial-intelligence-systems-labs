import { useState } from "react";
import { clsx } from 'clsx';

class Node {
  constructor(name, id) {
    this.name = name;
    this.id = id
  }

  toString() {
    return this.name;
  }
}
class Relationship {
  constructor(name, id) {
    this.name = name;
    this.id = id;
  }

  toString() {
    return this.name;
  }
}
class Edge {
  constructor(start, end, relationship) {
    this.start = start;
    this.end = end;
    this.relationship = relationship;
  }

  toString() {
    return this.start + " " + this.relationship + " " + this.end;
  }
}
class Graph {
  constructor(edges) {
    this.edges = edges
  }

  findAllPathsDFS(currentNode, endNode, visited, currentPath, allPaths) {
    visited[currentNode.id] = true;

    this.edges.forEach((edge) => {
      if (edge.start === currentNode && !visited[edge.end.id])
      {
        currentPath.push(edge);

        if (edge.end === endNode)
        {
          allPaths.push(currentPath);
        }
        else
        {
          this.findAllPathsDFS(edge.end, endNode, visited, currentPath, allPaths);
        }
        currentPath.remove(edge);
      }
    })

    visited[currentNode.id] = false;
  }

  findAllPaths(startNode, endNode) {
    const allPaths = [];
    const currentPath = [];
    const visited = [];

    this.findAllPathsDFS(startNode, endNode, visited, currentPath, allPaths);

    return allPaths;
  }
}

function ExpertSystem() {
  //const
  const radioButtons = [
    [0, "получить все узлы, связанные с отдельным узлом конкретным соотношением"],
    [1, "получить имена всех отношений для отдельного узла"],
    [2, "получить все пары узлов, связанных конкретным соотношением"],
    [3, "проследить путь между узлами"]
  ]

  //arrays
  const arrayItems = [];

  //objects arrays
  const [nodes, setNodes] = useState([]) //массив всех узлов
  const [relationships, setRelationships] = useState([]) //массив всех отношений
  const [edges, setEdges] = useState([]) //массив всех ребер
  const [relationshipArray, setRelationshipArray] = useState([])

  //components states
  const [radio, setRadio] = useState(0) //выбранная задача (1-4)
  const [answer, setAnswer] = useState([]) //массив строк ответа
  const [startNode, setStartNode] = useState(0); //выбранный стартовый узел для создания ребра
  const [endNode, setEndNode] = useState(0); //выбранный конечный узел для создания ребра
  const [relationship, setRelationship] = useState(0); //выбранное отношение для создания ребра
  const [startNodeAnswer, setStartNodeAnswer] = useState(0); //выбранный стартовый узел для решения задачи
  const [endNodeAnswer, setEndNodeAnswer] = useState(0); //выбранный конечный узел для решения задачи
  const [relationshipAnswer, setRelationshipAnswer] = useState(0); //выбранное отношение для решения задачи
  const [nodeName, setNodeName] = useState(""); //название узла для создания
  const [relationshipName, setRelationshipName] = useState(""); //название отношения для создания
  const [chatMessage, setChatMessage] = useState(""); //запрос в прототипе чата

  //styles classes
  const nodeStartClasses = clsx(
    "rounded-2xl",
    "p-2",
    "mt-1",
    "ml-1",
    "w-full",
    {
      "bg-pink-200" : radio === 1 || radio === 3,
    }
  );

  const relationshipClasses = clsx(
    "rounded-2xl",
    "p-2",
    "mt-1",
    "ml-1",
    "w-full",
    {
      "bg-pink-200" : radio === 0 || radio === 2,
    }
  );

  const nodeEndClasses = clsx(
    "rounded-2xl",
    "p-2",
    "mt-1",
    "ml-1",
    "w-full",
    {
      "bg-pink-200" : radio === 0 || radio === 3,
    }
  );

  const getAllNodesWithSpecificRelationship = (nodeNumber, relationshipNumber) => {
    let s = "";

    let s1 = "";
    for (let i = 0; i < relationshipArray.length; i++) {
      if (relationshipArray[i][nodeNumber] === relationships[relationshipNumber].ToString()) {
        s1 += nodes[i] + " " + relationships[relationshipNumber] + " " + nodes[nodeNumber] + "\n";
      }
    }

    if (s1 !== "") {
      s += "Со словом " + nodes[nodeNumber] + " и отношением " + relationships[relationshipNumber] + " существуют следующие связи:\n";
      s += s1;
    }
    else s += "Связей к " + nodes[nodeNumber] + " с отношением " + relationships[relationshipNumber] + " не существует!\n";

    let s2 = "";
    for (let i = 0; i < relationshipArray.length; i++) {
      if (relationshipArray[nodeNumber][i] === relationships[relationshipNumber].ToString()) {
        s2 += nodes[nodeNumber] + " " + relationships[relationshipNumber] + " " + nodes[i] + "\n";
      }
    }

    if (s2 !== "") {
      s += "Возможно, Вас также заинтересуют связи от слова " + nodes[nodeNumber] + " с отношением " + relationships[relationshipNumber] + ":\n";
      s += s2;
    }
    else s += "Связей от " + nodes[nodeNumber] + " с отношением " + relationships[relationshipNumber] + " не существует!\n";

    return s.split("\n");
  }

  const getAllRelationshipForSpecificNode = (nodeNumber) => {
    let s = "";

    for (let i = 0; i < relationshipArray.length; i++) {
      if (relationshipArray[i][nodeNumber] !== undefined) {
        s += nodes[i] + " " + relationshipArray[i][nodeNumber] + " " + nodes[nodeNumber] + "\n";
      }
    }
    s += "n"
    for (let i = 0; i < relationshipArray.length; i++) {
      if (relationshipArray[nodeNumber][i] !== undefined) {
        s += nodes[nodeNumber] + " " + relationshipArray[nodeNumber][i] + " " + nodes[i] + "\n";
      }
    }

    return s.split("\n");
  }

  const getAllNodesPairsWithSpecificRelationship = (relationshipNumber) => {
    let s = "";
    for (let i = 0; i < relationshipArray.length; i++) {
      for (let j = 0; j < relationshipArray.length; j++) {
        if (relationshipArray[i][j] === relationships[relationshipNumber].ToString())
          s += nodes[i] + " " + relationshipArray[i][j] + " " + nodes[j] + "\n";
      }
    }

    return s.split("\n");
  }

  const getAllPathsBetweenNodes = (startNodeNumber, endNodeNumber) => {
    let s = ""
    const graph = new Graph(edges)

    const allPaths = graph.findAllPaths(nodes[startNodeNumber], nodes[endNodeNumber])

    allPaths.forEach((path) => {
      s += path.map(edge => edge.toString()).join(" -> ") + "\n";
    })

    return s.split("\n")
  }

  //buttons functions - create

  const createNodeBttnClick = () => {
    if (nodeName !== "") {
      const node = new Node(nodeName, nodes.length)
      setNodes(prevNodes => [...prevNodes, node])
      setNodeName("")
    }
    else alert("Ошибка!");
  }

  const createRelationshipBttnClick = () => {
    if (relationshipName !== "") {
      const rel = new Relationship(relationshipName, relationships.length)
      setRelationships(prevState => [...prevState, rel])
      setRelationshipName("")
    }
    else alert("Ошибка!");
  }

  const createEdgeBttnClick = () => {
    const edge = new Edge(nodes[startNode], nodes[endNode], relationship[relationship])
    setEdges(prevState => [...prevState, edge])
    alert("Добавлено!")
  }

  const createDataAutoBttnClick = () => {
    const nodeNames = [
      "Слон", "Мышь", "Уши", "Хвост", "Цвет", "Зерно", "Вода",
      "Животное", "Грызун", "Размер", "Цирк", "Шерсть", "Млекопитающее",
      "Домашний питомец", "Вес"
    ]

    nodeNames.forEach((nodeName, index) => {
      const node = new Node(nodeName, index)
      setNodes(prevNodes => [...prevNodes, node])
    })

    const relationshipNames = [
      "Потребляется", "Не потребляется", "Имеет",
      "Серый", "Ест", "Пьет", "Является", "Маленький", "Не выступает", "Тяжелый",
      "Пугает", "Легкий", "Принадлежат", "Принадлежит", "Включает в себя",
      "Не включает в себя", "Использует", "Не использует", "Не принадлежит"
    ]

    relationshipNames.forEach((relationshipName, index) => {
      const rel = new Relationship(relationshipName, index)
      setRelationships(prevState => [...prevState, rel])
    })

    const text = "Х	Боится	Имеет	Имеет	Серый	Не ест	Пьет	Является	Не является	Большой	Выступает	Не имеет	Является	Не является	Тяжелый\n" +
      "Пугает	Х	Имеет	Имеет	Серый	Ест	Пьет	Является	Является	Маленький	Не выступает	Имеет	Является	Является	Легкий\n" +
      "Принадлежат	Принадлежат	Х	Х	Х	Х	Х	Принадлежат	Принадлежат	Маленький	Х	Х	Х	Х	Х\n" +
      "Принадлежит	Принадлежит	Х	Х	Х	Х	Х	Х	Принадлежат	Х	Х	Х	Х	Х	Х\n" +
      "Х	Х	Х	Х	Х	Х	Х	Х	Х	Х	Х	Х	Х	Х	Х\n" +
      "Не потребляется	Потребляется	Х	Х	Х	Х	Х	Х	Х	Х	Х	Х	Х	Х	Легкий\n" +
      "Потребляется	Потребляется	Х	Х	Х	Х	Х	Потребляется	Потребляется	Х	Х	Х	Потребляется	Потребляется	Х\n" +
      "Включает в себя	Включает в себя	Х	Х	Х	Х	Х	Х	Х	Х	Выступает	Х	Х	Х	Х\n" +
      "Не включает в себя	Включает в себя	Имеет	Имеет	Х	Ест	Х	Является	Х	Маленький	Х	Имеет	Является	Является	Маленький\n" +
      "Х	Х	Х	Х	Х	Х	Х	Х	Х	Х	Х	Х	Х	Х	Х\n" +
      "Использует	Не использует	Х	Х	Х	Х	Х	Использует	Не использует	Большой	Х	Х	Использует	Использует	Х\n" +
      "Не принадлежит	Принадлежит	Х	Х	Х	Х	Х	Х	Принадлежат	Х	Х	Х	Х	Х	Х\n" +
      "Включает в себя	Включает в себя	Х	Имеет	Х	Х	Х	Х	Включает в себя	Х	Х	Х	Х	Х	Х\n" +
      "Не включает в себя	Включает в себя	Х	Имеет	Х	Х	Х	Х	Х	Х	Х	Х	Х	Х	Х\n" +
      "Х	Х	Х	Х	Х	Х	Х	Х	Х	Х	Х	Х	Х	Х	Х";

    const lines = text.split('\n');
    const array = []
    lines.forEach((line) => {
      array.push(line.split('\t'))
    })

    array.forEach((line, startNodeNumber) => {
      line.forEach((relName, endNodeNumber) => {
        const relNumber = relationships.indexOf(relName);
        if (relNumber !== -1) {
          setEdges(prevState => [...prevState, new Edge(nodes[startNodeNumber],
            nodes[endNodeNumber], relationships[relNumber])])
          arrayItems.push([startNodeNumber, endNodeNumber, relNumber])
        }
      })
    })
  }

  //buttons functions - get

  const getNodesBttnClick = () => {
    setAnswer(nodes)
  }

  const getRelationshipBttnClick = () => {
    setAnswer(relationships)
  }

  const getAnswerBttnClick = () =>  {
    let array = []
    arrayItems.forEach((item) => {
      array[item[0]][item[1]] = relationships[item[2]].toString();
    })
    setRelationshipArray(array)

    switch (radio) {
      case 0: {
        //получить все узлы, связанные с отдельным узлом конкретным соотношением
        setAnswer(getAllNodesWithSpecificRelationship(endNodeAnswer, relationshipAnswer))

        break;
      }

      case 1: {
        //получить имена всех отношений для отдельного узла
        setAnswer(getAllRelationshipForSpecificNode(startNodeAnswer))

        break;
      }

      case 2: {
        //получить все пары узлов, связанных конкретным соотношением
        setAnswer(getAllNodesPairsWithSpecificRelationship(relationshipAnswer))

        break;
      }

      case 3: {
        //проследить путь между узлами
        setAnswer(getAllPathsBetweenNodes(startNodeAnswer, endNodeAnswer))

        break;
      }

      default: {
        setAnswer(["Не выбран тип задания!"])

        break;
      }
    }
  }


  return(
    <div className="flex mx-auto mt-5 max-md:gap-3 max-md:max-w-md max-md:flex-col">
      <div className="flex flex-col mx-3 gap-3 max-w-sm">
        <div className="p-5 flex flex-col gap-3 bg-amber-50 rounded-2xl">
          <div className="text-lg font-semibold">
            Создание узлов
          </div>
          <label>
            Название:
            <input
              className="rounded-2xl p-2 mt-1 ml-1 w-full"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}/>
          </label>
          <button
            className="p-3 bg-amber-100 rounded-2xl"
            onClick={createNodeBttnClick}>Создать узел</button>
        </div>
        <div className="p-5 flex flex-col gap-3 bg-amber-50 rounded-2xl">
          <div className="text-lg font-semibold">
            Создание отношений
          </div>
          <label>
            Название:
            <input
              className="rounded-2xl p-2 mt-1 ml-1 w-full"
              value={relationshipName}
              onChange={(e) => setRelationshipName(e.target.value)}/>
          </label>
          <button
            className="p-3 bg-amber-100 rounded-2xl"
            onClick={createRelationshipBttnClick}>Создать отношение</button>
        </div>
        <div className="p-5 flex flex-col gap-3 bg-amber-50 rounded-2xl max-w-sm">
          <div className="text-lg font-semibold">
            Создание отношений между узлами
          </div>
          <label>
            Узел (от):
            <select
              name="startNodeInputList"
              id="startNodeInputList"
              className="rounded-2xl p-2 mt-1 ml-1 w-full"
              value={startNode}
              onChange={(e) => {setStartNode(e.target.value)}}>
                {nodes.map((node) => {
                  return (
                    <option key={node.id} value={node.id}>{node.toString()}</option>
                  )
                })}
            </select>
          </label>
          <label>
            Отношение:
            <select
              name="relationshipInputList"
              id="relationshipInputList"
              className="rounded-2xl p-2 mt-1 ml-1 w-full"
              value={relationship}
              onChange={(e) => {setRelationship(e.target.value)}}>
                {relationships.map((relationship) => {
                  return (
                    <option key={relationship.id} value={relationship.id}>{relationship.toString()}</option>
                  )
                })}
            </select>
          </label>
          <label>
            Узел (к):
            <select
              name="finishNodeInputList"
              id="finishNodeInputList"
              className="rounded-2xl p-2 mt-1 ml-1 w-full"
              value={endNode}
              onChange={(e) => {setEndNode(e.target.value)}}>
                {nodes.map((node) => {
                  return (
                    <option key={node.id} value={node.id}>{node.toString()}</option>
                  )
                })}
            </select>
          </label>
          <button
            className="p-3 bg-amber-100 rounded-2xl"
            onClick={createEdgeBttnClick}>Создать отношение между узлами</button>
        </div>
        <button
          className="p-3 bg-amber-200 rounded-2xl"
          onClick={createDataAutoBttnClick}
        >
          Заполнить данные автоматически
        </button>
      </div>
      <div className="flex flex-col gap-3 mx-3 max-w-sm">
        <div className="flex gap-3 p-2">
          <button
            className="w-1/2 p-3 bg-amber-200 rounded-2xl"
            onClick={getNodesBttnClick}
          >
            Вывод узлов
          </button>
          <button
            className="w-1/2 p-3 bg-amber-200 rounded-2xl"
            onClick={getRelationshipBttnClick}
          >
            Вывод отношений
          </button>
        </div>
        <div id="answer" className="bg-amber-50 rounded-2xl p-2">
          {answer.map((line, index) => {
            return (
              <div key={index}>
                {line.toString()}
                <br/>
              </div>
            )
          })}
        </div>
      </div>
      <div className="flex flex-col gap-3 mx-3 max-w-sm">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            {radioButtons.map((button) => {
              return (
                <div className="bg-amber-50 rounded-2xl p-2"
                     key={"radioBttn_" + button[0]}>
                  <label>
                    <input type="radio" name={"radioBttn_" + button[0]} value={button[0]}
                           checked={radio === button[0]}
                           className="mr-1"
                           onChange={() => {
                             setRadio(button[0])
                           }}
                    />
                    {button[1]}
                    <br/>
                  </label>
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="p-5 flex flex-col gap-3 bg-amber-50 rounded-2xl max-w-sm">
            <div className="text-lg font-semibold">
              Вводные данные
            </div>
            <label>
              Узел (от):
              <select
                name="startNode"
                id="startNode"
                className={nodeStartClasses}
                value={startNodeAnswer}
                onChange={(e) => {setStartNodeAnswer(e.target.value)}}>
                  {nodes.map((node) => {
                    return (
                      <option key={node.id} value={node.id}>{node.toString()}</option>
                    )
                  })}
              </select>
            </label>
            <label>
              Отношение:
              <select
                name="relationship"
                id="relationship"
                className={relationshipClasses}
                value={relationshipAnswer}
                onChange={(e) => {setRelationshipAnswer(e.target.value)}}>
                  {relationships.map((relationship) => {
                    return (
                      <option key={relationship.id} value={relationship.id}>{relationship.toString()}</option>
                    )
                  })}
              </select>
            </label>
            <label>
              Узел (к):
              <select
                name="finishNode"
                id="finishNode"
                className={nodeEndClasses}
                value={endNodeAnswer}
                onChange={(e) => {setEndNodeAnswer(e.target.value)}}>
                  {nodes.map((node) => {
                    return (
                      <option key={node.id} value={node.id}>{node.toString()}</option>
                    )
                  })}
              </select>
            </label>
            <a href="#answer"
               className="p-3 bg-amber-100 rounded-2xl"
               onClick={getAnswerBttnClick}>Получить ответ</a>
          </div>
        </div>
        <div className="flex flex-col gap-3 bg-amber-50 p-5 rounded-2xl">
          <div className="text-lg font-semibold">
            Прототип чата
          </div>
          <div className="italic">
            Пожалуйста, используйте название узлов и отношений в том виде, в котором вводили их при создании. Вводите запросы в формате: "Найди связь между узлом Слон и узлом Мышь" (вместо "Найди связь между слоном и мышью") или "Что Имеет Слон?" (вместо "Что есть у слона?").
          </div>
          <label>
            Место запроса:
            <input
              type="text"
              className="rounded-2xl p-2 mt-1 w-full"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}/>
          </label>
          <a href="#answer" className="p-3 bg-amber-100 rounded-2xl">Получить ответ</a>
        </div>
      </div>
    </div>
  );
}

export default ExpertSystem;