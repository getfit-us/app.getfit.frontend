import React from 'react'
import useProfile from '../../hooks/useProfile';

const Tasks = () => {
    const {state, dispatch} = useProfile();

// notification type tasks / goals will be here

  return (
    <div>Tasks</div>
  )
}

export default Tasks