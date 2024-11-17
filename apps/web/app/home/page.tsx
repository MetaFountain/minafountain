'use client';

import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Welcome to the new page!</h1>
      <p>You clicked {count} times</p>
    <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

// export default function Home(){
//   return (
//     <div> Home</div>
//   )
// }