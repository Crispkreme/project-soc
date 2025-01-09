import React, { useState } from 'react';

const Tabs = ({ tabTitles = [], children }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div style={styles.container}>
            <div style={styles.tabContainer}>
                <div
                    style={{
                        ...styles.indicator,
                        transform: `translateX(${activeTab * 100}%)`,
                    }}
                />
                {tabTitles.map((tab, index) => (
                    <button
                        key={index}
                        style={{
                            ...styles.tabButton,
                            ...(activeTab === index && styles.activeTabButton),
                        }}
                        onClick={() => setActiveTab(index)}
                        aria-selected={activeTab === index}
                        role="tab"
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div style={styles.panelContainer}>
                {React.Children.toArray(children)[activeTab]}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '10px',
    },
    tabContainer: {
        display: 'flex',
        position: 'relative',
        height: '50px',
        marginBottom: '20px',
        backgroundColor: '#e0e0e0',
        borderRadius: '25px',
        overflow: 'hidden',
    },
    indicator: {
        position: 'absolute',
        width: '33.33%',
        height: '48px',
        top: '1px',
        backgroundColor: '#ccc',
        borderRadius: '24px',
        transition: 'transform 0.3s ease',
        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
    },
    tabButton: {
        flex: 1,
        padding: '10px 0',
        textAlign: 'center',
        background: 'none',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        color: '#888',
        fontWeight: 'normal',
    },
    activeTabButton: {
        color: '#000',
        fontWeight: 'bold',
        zIndex: 1,
    },
    panelContainer: {
        padding: '16px',
        backgroundColor: '#fff',
        borderRadius: '20px',
    },
    panel: {
        paddingVertical: '16px',
    },
    panelTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#333',
    },
    panelText: {
        fontSize: '16px',
        color: '#555',
        lineHeight: '1.5',
    },
};

export default Tabs;
