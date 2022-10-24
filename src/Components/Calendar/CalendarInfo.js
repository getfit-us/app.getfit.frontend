import { Button } from '@mui/material'
import React from 'react'
import GoalModal from './GoalModal'

const CalendarInfo = ({currentEvent, handleGoalModal}) => {

  return currentEvent?.title ? (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    }}>

      <h3><strong>Goal: </strong>{currentEvent?.title}</h3>
      <p>State Date: {currentEvent?.start}</p>
      <p>Goal Completion Dat: {currentEvent?.end}</p>
    </div>
  ) : <></>
}

export default CalendarInfo