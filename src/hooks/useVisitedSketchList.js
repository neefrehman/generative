import { useState } from "react";

const isClient = typeof window !== "undefined";

const useVisitedSketchList = () => {
    const [visitedSketchList, setVisitedSketchList] = useState(
        isClient
            ? JSON.parse(localStorage.getItem("visitedSketchList")) || []
            : []
    );

    const addToVisitedSketchList = sketch => {
        setVisitedSketchList(visitedSketchList.push(sketch));
        localStorage.setItem(
            "visitedSketchList",
            JSON.stringify(visitedSketchList)
        );
    };

    return { visitedSketchList, addToVisitedSketchList };
};

export default useVisitedSketchList;
