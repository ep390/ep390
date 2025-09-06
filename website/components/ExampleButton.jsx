import { useState } from 'react'

function ExampleButton() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setCount(count + 1)
  }

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 rounded-lg text-white bg-green-600 active:bg-green-700"
    >
      Clicked {count} Times
    </button>
  )
}

export default ExampleButton
