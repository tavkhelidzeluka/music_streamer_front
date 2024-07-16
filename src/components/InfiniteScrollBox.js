import {Box} from "@mui/material";
import ScrollBar from "./ScrollBar";
import Loading from "./Loading";
import {useCallback, useEffect, useRef} from "react";

export const InfiniteScrollBox = ({children, sx, loading, onLoad}) => {
    const scrollableRef = useRef();
    const loader = useRef();

       const handleObserver = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading) {
            onLoad();
        }
    }, [loading]);

    useEffect(() => {
        const option = {
            root: null,
            rootMargin: '20px',
            threshold: 0
        };
        const observer = new IntersectionObserver(handleObserver, option);
        if (loader.current) observer.observe(loader.current);
        return () => {
            if (loader.current) observer.unobserve(loader.current);
        };
    }, [handleObserver]);

    return (
        <>
            <Box
                ref={scrollableRef}
                sx={{
                    overflowY: "scroll",
                    padding: 2,
                    ...sx
                }}
            >
                {children}
                {loading && <Loading/>}
                <div ref={loader}/>
            </Box>
            <ScrollBar
                scrollableRef={scrollableRef}
                offset={64}
            />
        </>
    );
};

export default InfiniteScrollBox;