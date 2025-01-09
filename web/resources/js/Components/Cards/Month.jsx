import React, { useEffect, useRef, useState, lazy } from 'react';

const Event = lazy(() => import("./Event"));

const Month = ({ period, events, top }) => {

    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    const handleOnClick = () => setVisible(!visible);

    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setVisible(false);
            }
        }

        document.addEventListener("mouseup", handleClickOutside);
        return () => {
            document.removeEventListener("mouseup", handleClickOutside);
        };
    }, [ref]);

    return (
        <section
            ref={ref}
            onClick={handleOnClick}
            style={{ top: `-${top}px` }}
            className={`${visible ? 'z-50' : 'z-0'} transition relative bg-white w-full border border-black rounded-xl`}
        >
            <div className="header bg-secondary-bg py-2 px-4 rounded-t-xl">
                {period}
            </div>
            <div className="py-4 px-8 grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
                {events.length > 0 ? (
                    events.map((event, eventIdx) => (
                        <Event key={eventIdx} event={event} />
                    ))
                ) : (
                    <div>No events available</div>
                )}
            </div>
        </section>
    );
};

export default Month;
