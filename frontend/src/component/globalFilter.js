import React from 'react'
import "../dashboard.css"

export const GlobalFilter = ({filter, setFilter}) => {
  return (
    <div className='page-link'>
  <div className="input-group mb-3 g-3 col-md-5">
    <div className="input-group-text" id="btnGroupAddon">Search: {' '}</div>
    <input type="text" className="form-control" value={filter || ''} onChange={(e) => setFilter(e.target.value)}/>
  </div>
  </div>
  )
}
