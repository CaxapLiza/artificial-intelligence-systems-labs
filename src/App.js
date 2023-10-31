import ArtificialLifeMethod from "./components/ArtificialLifeMethod";
import Clustering from "./components/Clustering";
import ExpertSystem from "./components/ExpertSystem";
import Perceptron from "./components/Perceptron";
import GeneticAlgorithm from "./components/GeneticAlgorithm";

import {useState} from "react";
import {clsx} from "clsx";

function App() {
  const [task, setTask] = useState(0)
  const tasks = [
    [0, 'Экспертные системы'],
    [1, 'Однослойный перцептрон'],
    [2, 'Кластеризация алгоритмом k-средних'],
    [3, 'Оптимизация функции генетическим алгоритмом'],
    [4, 'Обучение агентов методом искусственной жизни']
  ]

  const renderComponent = () => {
    switch (task) {
      case 0:
        return <ExpertSystem />;
      case 1:
        return <Perceptron />;
      case 2:
        return <Clustering />;
      case 3:
        return <GeneticAlgorithm />;
      case 4:
        return <ArtificialLifeMethod />;
      default:
        return null;
    }
  }

  const [isOpen, setIsOpen] = useState(true)

  const navClasses = clsx(
    "bg-amber-200",
    "p-2.5",
    {
      "hidden": !isOpen
    }
  )

  const arrowClasses = clsx(
    "h-3",
    "mx-auto",
    {
      "rotate-180": isOpen
    }
  )

  return (
    <div className="bg-amber-100 mx-auto">
      <div className={navClasses}>
        <ul className="m-0 p-1 flex gap-3 text-center mx-auto max-w-7xl max-sm:flex-col">
          {tasks.map((taskItem) => {
            return(
              <li key={taskItem[0]}>
                <div
                  className={`p-2 rounded-2xl ${task === taskItem[0] ? 'bg-amber-100' : ''}`}
                  onClick={() => {
                    setTask(taskItem[0])
                  }}>
                  {taskItem[1]}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      <button className="bg-amber-200 p-2 w-full" onClick={() => setIsOpen(!isOpen)}>
        <img className={arrowClasses} src="./down-arrow.png" alt=""/>
      </button>
      <div className="max-w-7xl mx-auto">
        {renderComponent()}
      </div>
    </div>
  );
}

export default App;
