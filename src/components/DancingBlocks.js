import {useEffect, useRef} from "react";

export const DancingBlocks = () => {
    const wrapperRef = useRef();
    useEffect(() => {
        wrapperRef.current.childNodes.forEach((div, i) => div.style.animationDelay = `-${Math.random() * i}s`);
    }, []);
    return (
        <div ref={wrapperRef} className="dancingBlocks">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};