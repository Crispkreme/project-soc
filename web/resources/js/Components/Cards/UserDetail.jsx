import React from 'react';

const UserDetail = ({ userDetail }) => {
    const {
        role = "author",
        profile,
        name,
        address,
    } = userDetail;

    const defaultProfileImage = "https://cdn-icons-png.freepik.com/512/700/700674.png";
    const profileImage = profile || defaultProfileImage;
    console.log("userDetail", userDetail);
    return (
        <div style={styles.card}>
            <span style={styles.label}>{role}</span>
            <div style={styles.imageContainer}>
                <img
                    src={profileImage}
                    alt={userDetail.name}
                    style={styles.avatar}
                />
            </div>
            <div style={styles.contentContainer}>
                <h2 style={styles.authorName}>
                    {userDetail.name}
                </h2>
                <p style={styles.description}>{userDetail.address}</p>
            </div>
        </div>
    );
};

const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        padding: '16px',
        margin: '16px 0',
        border: '2px dashed #CCCCCC',
        borderRadius: '16px',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    label: {
        position: 'absolute',
        top: 0,
        left: 0,
        padding: '4px 8px',
        fontSize: '12px',
        fontWeight: '500',
        backgroundColor: '#E0F7FA',
        border: '2px dashed #CCCCCC',
        borderBottomRightRadius: '8px',
        borderTopLeftRadius: '8px',
    },
    imageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '16px',
    },
    avatar: {
        width: '100px',
        height: '80px',
        borderRadius: '50%',
    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    authorName: {
        fontSize: '15px',
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: '8px',
    },
    description: {
        fontSize: '10px',
        color: '#666666',
        marginBottom: '16px',
    },
};

export default UserDetail;
