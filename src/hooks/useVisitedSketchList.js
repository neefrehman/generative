import { useState } from "react";

const useVisitedSketchList = () => {
    const [visitedSketchList, setVisitedSketchList] = useState(
        typeof window !== "undefined"
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
