import React from 'react';

const UserDetail = ({ userDetail }) => {
    
    const defaultProfileImage = "https://cdn-icons-png.freepik.com/512/700/700674.png";
    const profileImage = userDetail.profile ? userDetail.profile : defaultProfileImage;

    return (
        <div className=" py-8 md:p-8">
            <div className="border border-black flex items-center gap-4 rounded-2xl">
                <img 
                    src={profileImage} 
                    alt={`${userDetail.firstname} ${userDetail.lastname}`}
                    className="w-32 h-32 bg-secondary-bg rounded-l-2xl"
                />
                <div className="flex flex-col">
                    <span className="text-xl font-semibold">
                        {userDetail.firstname} {userDetail.middlename} {userDetail.lastname}
                    </span>
                    <span className="text-sm">{userDetail.role}</span>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
