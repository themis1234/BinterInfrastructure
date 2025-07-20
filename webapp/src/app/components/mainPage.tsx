"use client"
import { useState } from "react";
import { useAuth } from "../Providers/AuthProvider"
import styles from '../main.module.css';
import QRCodesTableScreen from "./QRCodeScreen";
import UsersTableScreen from "./UserScreen";

export default function MainPage() {
    const [selectedDBEntry, setSelectedDBEntry] = useState<string | null>(null);
    const { logout, user } = useAuth();

    return (
        <div className={styles.mainContainer}>
            <div className={styles.infoContainer}>
                <div style={{ paddingTop: "2rem" }}>
                    <p className={styles.info}>First Name: {user?.firstName}</p>
                    <p className={styles.info}>Last Name: {user?.lastName}</p>
                    <p className={styles.info}>Email: {user?.email}</p>
                    <p className={styles.info}>Role: {user?.role}</p>
                </div>
                <div className={styles.dbInfo}>
                    <h1 className={styles.info} style={{ border: "none", color: "black", backgroundColor: "white" }}>Database Information</h1>
                    <button
                        className={styles.info}
                        style={{ cursor: "pointer" }}
                        onClick={() => { setSelectedDBEntry("users") }}
                    >
                        Users
                    </button>
                    <button
                        className={styles.info}
                        style={{ cursor: "pointer" }}
                        onClick={() => { setSelectedDBEntry("qrcodes") }}
                    >
                        QR Codes
                    </button>
                </div>
            </div>

            <div className={styles.secondaryContainer}>
                <div className={styles.topBar}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <span className="font-bold">BINTER MANAGEMENT APP</span>
                    </div>
                    <button className={styles.logoutStyle} onClick={logout}>
                        Logout
                    </button>
                </div>

                <div style={{
                    height: "calc(100vh - 70px)", 
                    overflowY: "auto"
                }}>
                    {selectedDBEntry === "users" && <UsersTableScreen />}
                    {selectedDBEntry === "qrcodes" && <QRCodesTableScreen />}
                </div>
            </div>
        </div>
    )
}