import { useEffect } from 'react';
import axios from 'axios';
import { ISessionData } from '../pages/ChargingSession';

/*
    Hook to poll for session updates. 
*/
const usePollForSessionUpdates = (isAuthorized: boolean, setSessionData: (data: ISessionData) => void) => {
    /*
    TO DO: When Stop Session is merged in, pass in flag to check for session stopped to clear the poll. 
    */
    useEffect(() => {
        (async () => {
            if (isAuthorized) {
                const poll = setInterval(async () => {
                    const id = localStorage.getItem('ocpiToken');
                    const results = await axios.post(
                        `${process.env.REACT_APP_BACKEND_URL}charge/fetch-session/`,
                        {
                            sessionId: id,
                        }
                    );
                    if (results?.data) {
                        const data = results.data;
                        setSessionData(data);
                    }
                }, 500);
                return () => clearInterval(poll);
            }
        })();
    }, [isAuthorized]);
};

export default usePollForSessionUpdates;