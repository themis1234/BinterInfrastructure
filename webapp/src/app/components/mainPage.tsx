"use client"
import { useState, useEffect } from "react";
import { useAuth } from "../Providers/AuthProvider"
import styles from '../main.module.css';
import QRCodesTableScreen from "./QRCodeScreen";
import UsersTableScreen from "./UserScreen";
import { Menu, X } from "lucide-react";

export default function MainPage() {
    const [selectedDBEntry, setSelectedDBEntry] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1080);
    const { logout, user } = useAuth();

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            const desktop = window.innerWidth >= 1080;
            console.log("desktop", desktop,"isDesktop", isDesktop);
            if (desktop === true && isDesktop === false) {
                
                console.log("min 1080");
                setIsMenuOpen(true);
            }
            if (desktop === false && isDesktop === true) 
            {
                console.log("max 1080");
                setIsMenuOpen(false);
            }

            setIsDesktop(desktop);
        };

        // Set initial state
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isDesktop]);
    useEffect(() => {
        if(isDesktop){
            setIsMenuOpen(true);
        }
    }, [])
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.topBar}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                        width: "auto",
                        cursor: "pointer"
                    }}
                    onClick={toggleMenu}
                >
                    {isMenuOpen ? <X /> : <Menu />}
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <span className="font-bold" style={{ userSelect: "none" }}>BINTER MANAGEMENT APP</span>
                </div>
                <button className={styles.logoutStyle} onClick={logout}>
                    Logout
                </button>
            </div>

            <div className={styles.secondaryContainer} style={{ position: "relative" }}>
                {/* Overlay for mobile when menu is open */}
                {!isDesktop && isMenuOpen && (
                    <div
                        style={{
                            position: "fixed",
                            top: "70px", 
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            zIndex: 998
                        }}
                        onClick={() => setIsMenuOpen(false)}
                    />
                )}

                {/* Info Container - Sidebar */}
                <div
                    className={styles.infoContainer}
                    style={{
                        display: (isDesktop && !isMenuOpen) ? "none" : (isDesktop || isMenuOpen) ? "block" : "none",
                        position: isDesktop ? "static" : "fixed",
                        top: isDesktop ? "auto" : "70px",
                        left: (!isDesktop && !isMenuOpen) ? "-400px" : "0",
                        height: isDesktop ? "auto" : "calc(100vh - 70px)",
                        zIndex: isDesktop ? "auto" : 999,
                        transition: isDesktop ? "none" : "left 0.3s ease-in-out",
                        boxShadow: (!isDesktop && isMenuOpen) ? "2px 0 10px rgba(0,0,0,0.1)" : "none"
                    }}
                >
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
                            onClick={() => {
                                setSelectedDBEntry("users");
                                // Close menu on mobile when item is selected
                                if (!isDesktop) setIsMenuOpen(false);
                            }}
                        >
                            Users
                        </button>
                        <button
                            className={styles.info}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                setSelectedDBEntry("qrcodes");
                                // Close menu on mobile when item is selected
                                if (!isDesktop) setIsMenuOpen(false);
                            }}
                        >
                            QR Codes
                        </button>
                    </div>
                </div>


                {/* Main Content Area */}
                <div style={{
                    height: "calc(100vh - 70px)",
                    overflowY: "auto",
                    width: "100%",
                    marginLeft: isDesktop ? "0" : "0" 
                }}>
                    {selectedDBEntry === "users" && <UsersTableScreen />}
                    {selectedDBEntry === "qrcodes" && <QRCodesTableScreen />}
                </div>
            </div>
        </div>
    )
}