import React from 'react';
import image from '../images/not found.png';
const NoPage = () => {
  return (
    <div className='mt-[80px] ml-[400px] font-extrabold text-5xl truncate '>
      <img src={image} className={"h-72"} alt={"Not found"}/>
      404 Error No Page Found
    </div>
  )
}

export default NoPage