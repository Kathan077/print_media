import React, { useEffect, useState, useRef } from 'react';

const CustomCursor = () => {
    const mainCursor = useRef(null);
    const secondaryCursor = useRef(null);
    const positionRef = useRef({ x: 0, y: 0 });
    const followerRef = useRef({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const mouseMove = (e) => {
            positionRef.current = { x: e.clientX, y: e.clientY };
            if (mainCursor.current) {
                mainCursor.current.style.left = `${e.clientX}px`;
                mainCursor.current.style.top = `${e.clientY}px`;
            }
        };

        const mouseOver = (e) => {
            const target = e.target;
            const isSelectable = 
                target.tagName === 'A' || 
                target.tagName === 'BUTTON' || 
                target.closest('.huge-link') ||
                target.closest('.process-item') ||
                target.closest('.mastery-card') ||
                window.getComputedStyle(target).cursor === 'pointer';
            
            setIsHovering(isSelectable);
        };

        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('mouseover', mouseOver);

        const followMouse = () => {
            followerRef.current = {
                x: followerRef.current.x + (positionRef.current.x - followerRef.current.x) * 0.15,
                y: followerRef.current.y + (positionRef.current.y - followerRef.current.y) * 0.15,
            };

            if (secondaryCursor.current) {
                secondaryCursor.current.style.left = `${followerRef.current.x}px`;
                secondaryCursor.current.style.top = `${followerRef.current.y}px`;
            }
            requestAnimationFrame(followMouse);
        };
        const animation = requestAnimationFrame(followMouse);

        return () => {
            window.removeEventListener('mousemove', mouseMove);
            window.removeEventListener('mouseover', mouseOver);
            cancelAnimationFrame(animation);
        };
    }, []);

    return (
        <>
            <div
                ref={mainCursor}
                className="custom-cursor"
                style={{
                    transform: `translate(-50%, -50%) scale(${isHovering ? 2.5 : 1})`,
                }}
            />
            <div
                ref={secondaryCursor}
                className="custom-cursor-follower"
                style={{
                    transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`,
                    background: isHovering ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                }}
            />
        </>
    );
};

export default CustomCursor;
