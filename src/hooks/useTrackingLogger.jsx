import React from 'react';
import useAxiosSecurity from './useAxiosSecurity';


const useTrackingLogger = () => {
    const axiosSecure = useAxiosSecurity();

    const logTracking = async ({ tracking_id, status, details, location, updated_by }) => {
        try {
            const payload = {
                tracking_id,
                status,
                details,
                location,
                updated_by,
            };
            await axiosSecure.post("/trackings", payload);
        } catch (error) {
            console.error("Failed to log tracking:", error);
        }
    };

    return { logTracking };
};

export default useTrackingLogger;