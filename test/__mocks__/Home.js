import React from 'react'

export const description = 'This is the home page'

export const jsonHome = {
  type: 'div',
  props: {},
  children: [
    { type: 'h1', props: {}, children: ['Welcome!'] },
    { type: 'p', props: {}, children: [description] }
  ]
}

const Home = () =>
  <div>
    <h1>Welcome!</h1>
    <p>{description}</p>
  </div>

export default Home
