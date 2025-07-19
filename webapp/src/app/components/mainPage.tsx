"use client"
import { useAuth } from "../Providers/AuthProvider"
import styles from '../main.module.css';
export default function MainPage() {
    const { logout, user } = useAuth();
    return (
        <div className={styles.mainContainer}>
            <div className={styles.infoContainer}>
                

                <div style={{paddingTop: "2rem", paddingLeft: "0.5rem"}}>
                    <p>First Name: {user?.firstName}</p>
                    <p>Last Name: {user?.lastName}</p>
                    <p>Email: {user?.email}</p>
                    <p>Role: {user?.role}</p>
                </div>
            </div>
            <div className={styles.secondaryContainer}>
                <button
                    onClick={logout}
                >
                    Logout
                </button>
            </div>
        </div>
    )
}