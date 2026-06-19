import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import { syncUserAPI } from "../../Service/allApi";
import { useNavigate, useLocation } from "react-router-dom";
import { useRole } from "../../context/RoleContext";
import { useState } from "react";

const AuthSync = () => {
    const { isLoaded, isSignedIn, getToken, userId } = useAuth();
    const { setRole, setLoading } = useRole();
    const navigate = useNavigate();
    const location = useLocation();
    const hasSyncedForUser = useRef(null);
    const hasRedirectedAdmin = useRef(false);
    useEffect(() => {
        let isSubscribed = true;

        const syncUser = async (retryCount = 0) => {
            if (!isLoaded || !isSignedIn || !isSubscribed) {
                if (!isSignedIn) {
                    hasSyncedForUser.current = null;
                    hasRedirectedAdmin.current = false;
                }
                return;
            }

            if (hasSyncedForUser.current === userId) return;

            try {
                // ✅ get stable token
                let token = null;
                for (let i = 0; i < 3; i++) {
                    token = await getToken();
                    console.log(token);

                    if (token) break;
                    await new Promise(res => setTimeout(res, 500));
                }

                if (!token) throw new Error("Token not available");
                const reqHeader = {
                    Authorization: `Bearer ${token}`
                }
                console.log(reqHeader);

                const response = await syncUserAPI(reqHeader);
                console.log(response);

                if (response.status === 200 && isSubscribed) {
                    const userRole = response.data?.data?.role || "user";

                    setRole(userRole);
                    setLoading(false);
                    hasSyncedForUser.current = userId;

                    const publicPages = ["/"];

                    if (
                        userRole === "admin" &&
                        !hasRedirectedAdmin.current &&
                        publicPages.includes(location.pathname)
                    ) {
                        hasRedirectedAdmin.current = true;
                        navigate("/admin", { replace: true });
                    }
                }

            } catch (error) {
                const status = error.response?.status;

                if ((status === 401 || !status) && retryCount < 3 && isSubscribed) {
                    setTimeout(() => syncUser(retryCount + 1), 1500);
                } else {
                    console.error("Final sync failed:", error.message);
                    setLoading(false);
                }
            }
        };

        syncUser();

        return () => { isSubscribed = false; };

    }, [isLoaded, isSignedIn, userId, location.pathname]);
    return null;
};

export default AuthSync;