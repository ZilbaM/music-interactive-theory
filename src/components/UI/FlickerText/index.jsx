import React from 'react'

export default function FlickerText({children, className}) {
  return (
    <div className={className + " animate-pulse"}>
        {children}
    </div>
  )
}

