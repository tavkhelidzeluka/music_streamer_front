import {useEffect, useRef, useState} from "react";

export const ProgressBarChangeable = ({onMouseDown, width, intervalCallback, onMountCallback}) => {
    const [isDragging, setIsDragging] = useState(false);
    const progressBarRef = useRef();

    useEffect(() => {
        onMountCallback && onMountCallback(progressBarRef);
    }, []);


    useEffect(() => {
        const interval = intervalCallback && intervalCallback(progressBarRef);

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
            interval && clearInterval(interval);
        };
    }, [isDragging]);

    const updateBar = (event) => {
        const progressBarWrapper = progressBarRef.current.parentNode;
        let width = event.clientX - progressBarWrapper.offsetLeft;

        if (width < 0) {
            width = 0;
        } else if (width > progressBarWrapper.clientWidth) {
            width = progressBarWrapper.clientWidth;
        }
        let progressPerc = width / progressBarWrapper.clientWidth;

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
                onClick={updateBar}
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