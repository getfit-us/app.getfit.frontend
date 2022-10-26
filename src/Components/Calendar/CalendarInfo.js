import { Button } from '@mui/material'
import React from 'react'
import GoalModal from './GoalModal'

const CalendarInfo = ({currentEvent, handleGoalModal}) => {

  return currentEvent?.type ==='goal' ? (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    }}>

      <h3><strong>Goal: </strong>{currentEvent?.title}</h3>
      <p>State Date: {new Date(currentEvent.start).toDateString()}</p>
      <p>Goal Completion Date: {new Date(currentEvent.end).toDateString()}</p>
    </div>
  ) : currentEvent?.type === 'task' ? (
<></>

  ) : null
}

export default CalendarInfo