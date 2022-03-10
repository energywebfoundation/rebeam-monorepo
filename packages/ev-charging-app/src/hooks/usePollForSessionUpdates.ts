import { useEffect } from 'react';
import axios from 'axios';
import { ISessionData } from '../pages/ChargingSession';

/*
    Hook to poll for session updates. 
*/
const usePollForSessionUpdates = (isAuthorized: boolean, setSessionData: (data: ISessionData) => void, sessionEnded: boolean) => {
    useEffect(() => {
            if (isAuthorized) {  
                const poll = setInterval(async () => {
                    const id = localStorage.getItem('ocpiToken');
                    if (!sessionEnded) {
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
                    }
                }, 3000, sessionEnded);
                if(sessionEnded) {
                    clearInterval(poll)
                }
                return () => clearInterval(poll);
            } 

    }, [isAuthorized, sessionEnded]);
};

export default usePollForSessionUpdates;