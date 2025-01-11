import React from 'react'
import Comment from '../assets/commentIcon.svg'

const Confession = (props) => {

    return (

        <div className="block transition-all p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 mx-auto m-2 w-full sm:w-[400px]">
            <h5 className="mb-2 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center border-b pb-2">
                Confession
            </h5>
            <p className="font-normal text-xl text-gray-500 dark:text-gray-300 min-w-[250px]">
                {props.text}
            </p>
            <div className="mt-5 flex justify-between">
            <span>{props.createdAt.slice(0,10)}</span>
            <img src={Comment} onClick={()=>props.onComment()}/>
            </div>
        </div>
    )
}

export default Confession
