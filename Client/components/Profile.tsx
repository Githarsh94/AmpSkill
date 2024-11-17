'use client';
import styles from '../styles/dashboard.module.css';
import { useUserStore } from '@/store/user';
import { useState } from 'react';
import { editProfile } from '@/Services/admin';
import { toast } from 'react-toastify';

export default function Profile() {
    const user = useUserStore((state) => state.user);
    const userDetails =useUserStore((state) => state.userDetails);
    const [isEditing, setIsEditing] = useState(false);
    const email = useUserStore((state) => state.user.email);
    const [userName,setUserName] = useState(user.name);
    const handleEditProfile = async () => {
        //console.log('Editing the profile');
        if (isEditing) {
            // Call the API to update the user profile
            try{
                //console.log('Updating the user name');
                const response = await editProfile(email,userName);
                if(response.message){
                    setIsEditing(false);
                    toast.success(response.message);
                }
                //console.log("got me");
            }
            catch(error){
                toast.error((error as Error).message);
                //console.error(error);
            }
            //console.log('Updating the user profile');
        }
    }
    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileContentUpper}>
                <div className={styles.profileInfo}>
                    {!isEditing ? (<p className={styles.profileUsername}>{userName}</p>):(
                        <div>
                            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
                            <button className={styles.editButton} onClick={() => handleEditProfile()}>Save</button>
                        </div>
                    )}
                    <p className={styles.profileEmail}>{user.email}</p>
                    <p className={styles.profileJoined}>
                        <strong>Joined At:</strong> {user.createdAt}
                    </p>
                </div>
                <div className={styles.profileImageContainer}>
                    <img
                        src={user.picture || '/default-profile.png'}
                        alt="Profile"
                        className={styles.profileImage}
                    />
                    <button className={styles.editButton}
                        onClick={() => setIsEditing(true)}
                    >Edit Profile</button>
                </div>
            </div>
            <div className={styles.profileStats}>
                <p>{userDetails.no_of_teachers} Teachers</p>
                <p>{userDetails.no_of_students} Students</p>
                <p>{userDetails.no_of_batches}Batches</p>
            </div>
            <div className={styles.profileIllustration}>
                <img
                    src="/images/Buffer-bro.png"
                    alt="Fun Illustration"
                    className={styles.illustrationImage}
                />
            </div>
            {/* <style jsx>{
                `
                *{
                border: black 1px solid;
                }
                `}
            </style> */}
        </div>
    );
}