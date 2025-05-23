import React from 'react'
import ReactDOM from 'react-dom'

const MobileMenu = ({children}) => {


    const content=<div className='w-[60%] bg-white py-[64px] justify-center flex relative z-20 h-screen'>{children}</div>

  return ReactDOM.createPortal(content, document.getElementById('dialog'))

}

export default MobileMenu