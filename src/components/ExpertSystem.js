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

function ExpertSystem() {
  //const
  const radioButtons = [
    [0, "получить все узлы, связанные с отдельным узлом конкретным соотношением"],
    [1, "получить имена всех отношений для отдельного узла"],
    [2, "получить все пары узлов, связанных конкретным соотношением"],
    [3, "проследить путь между узлами"]
  ]

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
    const answerArray = []
    answerArray.push("Связи к выбранному узлу:")
    edges.forEach(edge => {
      if (nodeNumber === edge.end.id && relationshipNumber === edge.relationship.id)
        answerArray.push(edge.toString())
    })
    answerArray.push("Связи от выбранного узла:")
    edges.forEach(edge => {
      if (nodeNumber === edge.start.id && relationshipNumber === edge.relationship.id)
        answerArray.push(edge.toString())
    })

    return answerArray
  }

  const getAllRelationshipForSpecificNode = (nodeNumber) => {
    const answerArray = []

    answerArray.push("Связи от выбранного узла:")
    edges.forEach(edge => {
      if (nodeNumber === edge.start.id)
        answerArray.push(edge.toString())
    })
    answerArray.push("Связи к выбранному узлу:")
    edges.forEach(edge => {
      if (nodeNumber === edge.end.id)
        answerArray.push(edge.toString())
    })

    return answerArray
  }

  const getAllNodesPairsWithSpecificRelationship = (relationshipNumber) => {
    const answerArray = []
    edges.forEach(edge => {
      if (relationshipNumber === edge.relationship.id)
        answerArray.push(edge.toString())
    })

    return answerArray
  }

  const getAllPathsBetweenNodes = (startNodeNumber, endNodeNumber) => {
    const findPathsHelper = (currentNodeId, currentPath) => {
      if (currentNodeId === endNodeNumber) {
        paths.push(currentPath);
        return;
      }

      const outgoingEdges = edges.filter(edge => edge.start.id === currentNodeId);

      for (const edge of outgoingEdges) {
        const nextNodeId = edge.end.id;
        if (!currentPath.includes(nextNodeId)) {
          findPathsHelper(nextNodeId, [...currentPath, nextNodeId]);
        }
      }
    }
    const findEdge = (start, end) => {
      for (const edge of edges) {
        if (edge.start.id === start && edge.end.id === end) {
          return edge.toString();
        }
      }
      return "";
    }

    const paths = []
    findPathsHelper(startNodeNumber, [startNodeNumber])

    const answer = []
    paths.forEach(path => {
      let s = ""
      for (let i = 0; i < path.length - 1; i++) {
        s += findEdge(path[i], path[i + 1]) + " -> "
      }
      s = s.replace(/ -> $/, "")
      answer.push(s)
    })

    return answer
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
    const nodesArray = []
    const relsArray = []
    const numEdgesArray = []
    const edgesArray = []

    const nodeNames = [
      "Слон", "Мышь", "Уши", "Хвост", "Цвет", "Зерно", "Вода",
      "Животное", "Грызун", "Размер", "Цирк", "Шерсть", "Млекопитающее",
      "Домашний питомец", "Вес"
    ]
    nodeNames.forEach((nodeName, index) => {
      const node = new Node(nodeName, index)
      nodesArray.push(node)
    })

    const relationshipNames = [
      "Потребляется", "Не потребляется", "Имеет",
      "Серый", "Ест", "Пьет", "Является", "Маленький", "Не выступает", "Тяжелый",
      "Пугает", "Легкий", "Принадлежат", "Принадлежит", "Включает в себя",
      "Не включает в себя", "Использует", "Не использует", "Не принадлежит"
    ]
    relationshipNames.forEach((relationshipName, index) => {
      const rel = new Relationship(relationshipName, index)
      relsArray.push(rel)
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
        const relNumber = relationshipNames.indexOf(relName);
        if (relNumber !== -1) {
          numEdgesArray.push({startNum: startNodeNumber, endNum: endNodeNumber, relNum: relNumber})
        }
      })
    })

    numEdgesArray.forEach(item => {
      const edge = new Edge(nodesArray[item.startNum], nodesArray[item.endNum], relsArray[item.relNum])
      edgesArray.push(edge)
    })

    setNodes(nodesArray)
    setRelationships(relsArray)
    setEdges(edgesArray)
  }

  //buttons functions - get

  const getNodesBttnClick = () => {
    setAnswer(nodes)
  }

  const getRelationshipBttnClick = () => {
    setAnswer(relationships)
  }

  const getEdgesBttnClick = () => {
    setAnswer(edges)
  }

  const getAnswerBttnClick = () =>  {
    if (relationshipArray === []) {
      const array = []
      for (let i = 0; i < nodes.length; i++) {
        const line = []
        for (let j = 0; j < nodes.length; j++) {
          line.push('')
        }
        array.push(line)
      }

      edges.forEach((edge) => {
        array[edge.start.id][edge.end.id] = edge.relationship.toString();
      })
      setRelationshipArray(array)
    }

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

  const getChatAnswerBttnClick = () => {
    const words = chatMessage.replace(/[.,;:!?]/g, '').split(' ');

    const foundNodes = [];
    const foundRelationships = [];

    words.forEach(word => {
      const matchingNodes = nodes.filter(node => node.name === word);
      const matchingRelationships = relationships.filter(relationship => relationship.name === word);

      if (matchingNodes.length > 0) {
        foundNodes.push(matchingNodes[0]);
      } else if (matchingRelationships.length > 0) {
        foundRelationships.push(matchingRelationships[0]);
      }
    });

    if (foundNodes.length === 1 && foundRelationships.length === 0) {
      return getAllRelationshipForSpecificNode(foundNodes[0].id);
    } else if (foundNodes.length === 2 && foundRelationships.length === 0) {
      return getAllPathsBetweenNodes(foundNodes[0].id, foundNodes[1].id);
    } else if (foundNodes.length === 1 && foundRelationships.length === 1) {
      return getAllNodesWithSpecificRelationship(foundNodes[0].id, foundRelationships[0].id);
    } else if (foundNodes.length === 0 && foundRelationships.length === 1) {
      return getAllNodesPairsWithSpecificRelationship(foundRelationships[0].id);
    } else if (foundNodes.length === 0 && foundRelationships.length === 0) {
      return ["Недостаточно данных"];
    } else {
      return ["Переизбыток данных"];
    }
  }


  return(
    <div className="grid grid-cols-3 justify-items-center mx-auto mt-5 gap-3 max-lg:grid-cols-1">
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
            className="w-1/3 p-3 bg-amber-200 rounded-2xl"
            onClick={getNodesBttnClick}
          >
            Вывод узлов
          </button>
          <button
            className="w-1/3 p-3 bg-amber-200 rounded-2xl"
            onClick={getRelationshipBttnClick}
          >
            Вывод отношений
          </button>
          <button
            className="w-1/3 p-3 bg-amber-200 rounded-2xl"
            onClick={getEdgesBttnClick}
          >
            Вывод ребер
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
                onChange={(e) => {setStartNodeAnswer(parseInt(e.target.value))}}>
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
                onChange={(e) => {setRelationshipAnswer(parseInt(e.target.value))}}>
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
                onChange={(e) => {setEndNodeAnswer(parseInt(e.target.value))}}>
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
          <a href="#answer" className="p-3 bg-amber-100 rounded-2xl" onClick={() => setAnswer(getChatAnswerBttnClick())}>Получить ответ</a>
        </div>
      </div>
    </div>
  );
}

export default ExpertSystem;