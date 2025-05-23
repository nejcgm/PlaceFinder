import React from 'react'
import './MainHeader.css'

const MainHeader = ({children}) => {
  return (
    <div className='main-header bg-gray-300'>{children}</div>
  )
}

export default MainHeader