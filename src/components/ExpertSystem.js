import {useState} from "react";

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
        currentPath.add(edge);

        if (edge.end === endNode)
        {
          allPaths.add(currentPath);
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

  //consts
  const taskNumber = 0;
  const nodes = [];
  const relationships = [];
  const edges = [];

  const relationshipArray = [];
  const arrayItems = [];




  const radioButtons = [
    [0, "получить все узлы, связанные с отдельным узлом конкретным соотношением"],
    [1, "получить имена всех отношений для отдельного узла"],
    [2, "получить все пары узлов, связанных конкретным соотношением"],
    [3, "проследить путь между узлами"]
  ]

  const [radio, setRadio] = useState(0);
  
  return(
    <div className="flex mx-auto mt-5 max-md:gap-3 max-md:max-w-md max-md:flex-col">
      <div className="flex flex-col mx-3 gap-3 max-w-sm">
        <div className="p-5 flex flex-col gap-3 bg-amber-50 rounded-2xl">
          <div className="text-lg font-semibold">
            Создание узлов
          </div>
          <label>
            Название:
            <input className="rounded-2xl p-2 mt-1 ml-1 w-full" name="nodesInput" id="nodesInput"/>
          </label>
          <button className="p-3 bg-amber-100 rounded-2xl">Создать узел</button>
        </div>
        <div className="p-5 flex flex-col gap-3 bg-amber-50 rounded-2xl">
          <div className="text-lg font-semibold">
            Создание отношений
          </div>
          <label>
            Название: <input className="rounded-2xl p-2 mt-1 w-full" name="relationshipInput" />
          </label>
          <button className="p-3 bg-amber-100 rounded-2xl">Создать отношение</button>
        </div>
        <div className="p-5 flex flex-col gap-3 bg-amber-50 rounded-2xl max-w-sm">
          <div className="text-lg font-semibold">
            Создание отношений между узлами
          </div>
          <label>
            Узел (от):
            <select name="startNodeInputList" id="startNodeInputList" className="rounded-2xl p-2 mt-1 ml-1 w-full">
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </label>
          <label>
            Отношение:
            <select name="relationshipInputList" id="relationshipInputList" className="rounded-2xl p-2 mt-1 ml-1 w-full">
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </label>
          <label>
            Узел (к):
            <select name="finishNodeInputList" id="finishNodeInputList" className="rounded-2xl p-2 mt-1 ml-1 w-full">
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </label>
          <button className="p-3 bg-amber-100 rounded-2xl">Создать отношение между узлами</button>
        </div>
        <button className="p-3 bg-amber-200 rounded-2xl">
          Заполнить данные автоматически
        </button>
      </div>
      <div className="flex flex-col gap-3 mx-3 max-w-sm">
        <div className="flex gap-3 p-2">
          <button className="w-1/2 p-3 bg-amber-200 rounded-2xl">
            Вывод узлов
          </button>
          <button className="w-1/2 p-3 bg-amber-200 rounded-2xl">
            Вывод отношений
          </button>
        </div>
        <div id="answer" className="bg-amber-50 rounded-2xl p-2">

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
              <select name="startNode" id="startNode" className="rounded-2xl p-2 mt-1 ml-1 w-full">
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </label>
            <label>
              Отношение:
              <select name="relationship" id="relationship" className="rounded-2xl p-2 mt-1 ml-1 w-full">
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </label>
            <label>
              Узел (к):
              <select name="finishNode" id="finishNode" className="rounded-2xl p-2 mt-1 ml-1 w-full">
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </label>
            <a href="#answer" className="p-3 bg-amber-100 rounded-2xl">Получить ответ</a>
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
              name="chat"
              className="rounded-2xl p-2 mt-1 w-full"/>
          </label>
          <a href="#answer" className="p-3 bg-amber-100 rounded-2xl">Получить ответ</a>
        </div>
      </div>
    </div>
  );
}

export default ExpertSystem;