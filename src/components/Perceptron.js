import React, {useEffect, useState} from 'react';

class Neuron {
  constructor(inputSize) {
    this.weights = Array(inputSize).fill(Math.random())
    this.threshold = 0.0
    this.learningRate = 0.05
  }

  compute = (inputs) => {
    let sum = 0
    for (let i = 0; i < inputs.length; i++) {
      sum += inputs[i] * this.weights[i]
    }
    return (sum > this.threshold) ? 1 : 0
  }

  train(inputs, target){
    const output = this.compute(inputs)
    const error = target - output

    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] += this.learningRate * error * inputs[i]
    }
  }
}

const Perceptron = () => {
  const letters = ["А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "О", "П", "Р", "С", "Т",
    "У", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ь", "Ы", "Ъ", "Э", "Ю", "Я"]
  const height = 29

  const [selectedLetter, setSelectedLetter] = useState(0)
  const [iterationNumber, setIterationNumber] = useState(0)
  const [answer, setAnswer] = useState([])
  const [neurons] = useState(() => {
    return letters.map(() => new Neuron(height * height))
  })
  const [lettersData, setLettersData] = useState(() => {
    return letters.map((letter, index) => {
      const vector = Array(33).fill(0)
      vector[index] = 1
      return {
        letter: letter,
        index: index,
        vector: vector,
        inputSignals: [],
      }
    })
  })

  useEffect(() => {
    const loadInputSignals = async () => {
      const updatedLettersData = await Promise.all(
        lettersData.map(async (data, index) => {
          const image = new Image()
          image.src = `./perceptron/${index}.png`
          await image.decode()

          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          canvas.width = image.width
          canvas.height = image.height
          context.drawImage(image, 0, 0)

          const inputSignals = []

          for (let m = 0; m < canvas.height; m++) {
            for (let n = 0; n < canvas.width; n++) {
              const pixelColor = context.getImageData(n, m, 1, 1).data
              const grayscaleValue = (pixelColor[0] * 0.299 + pixelColor[1] * 0.587 + pixelColor[2] * 0.114) < 128 ? 1 : 0
              inputSignals.push(grayscaleValue)
            }
          }

          return {
            ...data,
            inputSignals: inputSignals,
          }
        })
      )
      setLettersData(updatedLettersData)
    }

    loadInputSignals()
  }, [])


  const trainNeurons = () => {
    for (let j = 0; j < iterationNumber; j++) {
      for (let i = 0; i < neurons.length; i++) {
        neurons[i].train(lettersData[selectedLetter].inputSignals, lettersData[selectedLetter].vector[i])
      }
    }

  }

  const recognizeLetter = () => {
    const newAnswer = []
    for (let i = 0; i < neurons.length; i++) {
      const result = neurons[i].compute(lettersData[selectedLetter].inputSignals)
      if (result === 1) newAnswer.push(lettersData[i].letter)
    }
    setAnswer(newAnswer)
  }


  return (
    <div className="p-5 flex flex-col gap-3">
      <div className="grid grid-cols-11 gap-3 justify-center max-sm:grid-cols-7">
        { letters.map((letter, index) => { return (
          <button className={`p-3 rounded-2xl hover:bg-amber-200 ${index === selectedLetter ? 'bg-amber-200' : 'bg-amber-50'}`}
                  key={index}
                  onClick={() => {
                    setSelectedLetter(index)
                  }}>
            {letter}
          </button>
        )})}
      </div>
      <div className="flex gap-3 mx-auto max-md:flex-col">
        <div className="bg-white p-3 rounded-2xl">
          <img className="mx-auto w-52" src={`./perceptron/${selectedLetter}.png`} alt="letter"/>
        </div>
        <div className="flex flex-col gap-3">
          <label className="flex flex-col">
            Количество эпох обучения
            <input className="p-3 rounded-2xl"
                   type="number"
                   value={iterationNumber}
                   onChange={event => (event.nativeEvent.target.value >= 0) ? setIterationNumber(event.nativeEvent.target.value) : {}}/>
          </label>
          <button className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-200"
                  onClick={trainNeurons}>
            Обучить
          </button>
          <button className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-200"
                  onClick={recognizeLetter}>
            Распознать
          </button>
        </div>
        <div>
          <div>Это одна из {answer.length} букв этого списка:</div>
          <div className="grid grid-cols-11">
            {answer.map((letter, index) => { return (
            <div key={index}>| {letter} |</div>
          )})}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perceptron;