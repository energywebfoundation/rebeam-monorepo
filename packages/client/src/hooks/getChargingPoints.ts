import { useEffect, useState } from 'react';
import axios from 'axios';
import { mockData } from "../constants/mock-data";

/*
    Hook to retrieve charging points. 
    Will be called only on initial render as it does not depend on any state variables.
*/
const useChargePoints = () => {
    const [chargePoints, setChargePoints] = useState({});
    const [loadingChargePoints, setLoadingChargePoints] = useState(false);
    useEffect(() => {
        (async () => {
            console.log("In map hook")
            try {
                //uncomment this when we have loading treatement: 
                setLoadingChargePoints(true);
                // mock for return from call to backend to fetch charge points
                //const chargePoints = await call to backend to fetch charge points
                setChargePoints(mockData);
            } catch (error) {
                console.error('Error while fetching charge points', error);
            } finally {
                setLoadingChargePoints(false);
            }
        })();
    }, []);
    return { chargePoints, loadingChargePoints };
};

export default useChargePoints;
