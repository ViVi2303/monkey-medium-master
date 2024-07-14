import React from "react";
import TopicList from "./TopicList";

const TopicRcmm =()=>{
    const data = [
        {
            name:"Writing",
            slug:"Writing"
        },
        {
            name:"Relationships",
            slug:"Relationships"
        },
        {
            name:"Machine Learning",
            slug:"Machine"
        },
        {
            name:"Productivity",
            slug:"Productivity"
        },
        {
            name:"Politics",
            slug:"assdasds"
        },
        {
            name:"Crytocurrency",
            slug:"assdasds"
        },
        {
            name:"dasdasd",
            slug:"assdasds"
        },
        {
            name:"dasdasd",
            slug:"assdasds"
        }
    ]
    return (<>
        <div className="pt-3 border-t border-gray-300 bg-gray80">
            <h2 className="text-black font-bold my-4">Recommended topics</h2>
            <TopicList className="max-h-[190px] overflow-hidden" data={data} />
            <button className="text-lime-600 text-sm hover:text-black duration-300 my-3">See more topics</button>
        </div>
    </>)
}

export default TopicRcmm;