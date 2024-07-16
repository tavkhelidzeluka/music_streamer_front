import {useEffect, useState} from "react";
import {Box} from "@mui/material";


export const ScrollBar = ({scrollableRef, offset = 64}) => {
    const [scrollBarHeight, setScrollBarHeight] = useState(0);
    const [scrollBarTop, setScrollBarTop] = useState(offset);
    const [visible, setVisible] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [initialMouseY, setInitialMouseY] = useState(0);
    const [initialScrollBarTop, setInitialScrollBarTop] = useState(offset);
    const [isScrollable, ssetIsScrollable] = useState(false);


    useEffect(() => {
        const scrollable = scrollableRef.current;
        const handleScroll = () => {
            if (isDragging)
                return;

            setVisible(true);
            const {scrollTop, scrollHeight, clientHeight} = scrollable;
            const newScrollBarHeight = (clientHeight / scrollHeight) * clientHeight;
            const top = (scrollTop / (scrollHeight - clientHeight)) * (clientHeight - newScrollBarHeight);
            setScrollBarHeight(newScrollBarHeight);
            setScrollBarTop(top + offset);
            ssetIsScrollable(scrollHeight > clientHeight);
        };

        const show = () => {
            if (scrollBarHeight === 0)
                handleScroll();
            setVisible(true);
        }
        const hide = () => setVisible(false);

        scrollable.addEventListener("scroll", handleScroll);
        scrollable.addEventListener("mouseover", show);
        scrollable.addEventListener("mouseout", hide);
        window.addEventListener('resize', handleScroll);

        return () => {
            scrollable.removeEventListener("scroll", handleScroll);
            scrollable.removeEventListener("mouseover", show);
            scrollable.removeEventListener("mouseout", hide);
            window.removeEventListener('resize', handleScroll);
        };
    }, [scrollableRef]);

    useEffect(() => {
        const handleMouseMove = (event) => {
            if (!isDragging)
                return;

            const scrollContainer = scrollableRef.current;
            if (scrollContainer) {
                const {clientHeight, scrollHeight} = scrollContainer;
                const maxScrollBarTop = clientHeight - scrollBarHeight;
                let newScrollBarTop = (initialScrollBarTop + (event.clientY - initialMouseY - offset));
                if (newScrollBarTop < 0) {
                    newScrollBarTop = 0;
                } else if (newScrollBarTop > maxScrollBarTop) {
                    newScrollBarTop = maxScrollBarTop;
                }
                setScrollBarTop(newScrollBarTop + offset);
                scrollContainer.scrollTop = ((newScrollBarTop) / maxScrollBarTop) * (scrollHeight - clientHeight);
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
        }

    }, [isDragging]);

    return (
        isScrollable ? (
            <Box
                hidden={!visible}
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
                onMouseDown={(event) => {
                    setIsDragging(true);
                    setInitialMouseY(event.clientY);
                    setInitialScrollBarTop(scrollBarTop);
                }}
                sx={{
                    position: "absolute",
                    width: 12,
                    right: 0,
                    top: scrollBarTop,
                    height: scrollBarHeight,
                    background: "rgba(137,137,137,0.5)"
                }}
            />
        ) : null
    );
};


export default ScrollBar;
