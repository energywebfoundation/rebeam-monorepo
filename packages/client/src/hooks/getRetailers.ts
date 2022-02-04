import { useEffect, useState } from 'react';
import axios from 'axios';
import { mockRetailers } from "../constants/mock-retailers";

/*
    Hook to retrieve retailers. 
    Will be called only on initial render as it does not depend on any state variables.
*/
const useRetailers = () => {
    const [retailers, setRetailers] = useState({});
    const [loadingRetailers, setLoadingRetailers] = useState(false);
    useEffect(() => {
        (async () => {
            console.log("in use effect")
            try {
                //uncomment this when we have loading treatement: 
                setLoadingRetailers(true);
                // mock for return from call to backend to fetch charge points
                //const retailers = await call to backend to fetch charge points
                setRetailers(mockRetailers);
            } catch (error) {
                console.error('Error while fetching charge points', error);
            } finally {
                setLoadingRetailers(false);
            }
        })();
    }, []);
    return { retailers, loadingRetailers };
};

export default useRetailers;