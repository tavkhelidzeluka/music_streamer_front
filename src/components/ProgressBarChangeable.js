import {useEffect, useRef, useState} from "react";

export const ProgressBarChangeable = ({onMouseDown, width, onMount}) => {
    const [isDragging, setIsDragging] = useState(false);
    const progressBarRef = useRef();

    useEffect(() => {
        onMount && onMount(progressBarRef);

        const handleMouseMove = (event) => {
            if (isDragging) {
                updateBar(event);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging]);

    const updateBar = (event) => {
        const progressBarWrapper = progressBarRef.current.parentNode;
        let width = event.clientX - progressBarWrapper.offsetLeft;
        let progressPerc = progressBarRef.current.clientWidth / progressBarWrapper.clientWidth;
        if (width < 0) {
            width = 0;
        } else if (width > progressBarWrapper.clientWidth) {
            width = progressBarWrapper.clientWidth;
        }
        console.log(width ,event.clientX - progressBarWrapper.offsetLeft);

        progressBarRef.current.style.width = `${width}px`;
        onMouseDown(progressPerc);
    };

    return (
        <div style={{width}}>
            <div
                onMouseDown={(event) => {
                    setIsDragging(true);
                    updateBar(event);
                }}
                className="progressBarWrapper">
                <div
                    ref={progressBarRef}
                    className="progressBar">
                    <div className="progressBarPoint">

                    </div>
                </div>
            </div>
        </div>
    );
};