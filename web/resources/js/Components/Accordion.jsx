import React, { useState } from "react";

const Accordion = ({ title, children }) => {
    const [accordionOpen, setAccordionOpen] = useState(false);

    return (
        <div className="py-2">
            <button
                onClick={() => setAccordionOpen(!accordionOpen)}
                className="flex justify-between items-center w-full"
            >
                <span className="flex items-center space-x-2">
                    {/* {accordionOpen ? (
                        <TbTableImport className="text-black-500 w-4 h-4" />
                    ) : (
                        <TbTableDown className="text-black-500 w-4 h-4" />
                    )} */}
                    <span className="text-slate-700 font-medium">{title}</span>
                </span>
            </button>
            <div
                className={`grid overflow-hidden transition-all duration-300 ease-in-out text-slate-600 text-sm ${
                    accordionOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                }`}
            >
                <div className="overflow-hidden font-medium">{children}</div>
            </div>
        </div>
    );
}

export default Accordion;
