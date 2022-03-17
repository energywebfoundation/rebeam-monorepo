import { useEffect } from 'react';
import axios from 'axios';

/*
    Hook to poll for session authorization confirmation. 
*/
const usePollForSessionAuth = (isAuthorized: boolean, setIsAuthorized: (x: boolean) => void) => {
    useEffect(() => {
        (async () => {
           
            if (!isAuthorized) {
                const poll = setInterval(async () => {
                    const id = localStorage.getItem('ocpiToken');
                    const results = await axios.get(
                      `${process.env.REACT_APP_BACKEND_URL}charge/session-conf/${id}`
                    );
                    if (results?.data) {
                      const data = results.data;
                      const { command, uid, result } = data;
                      if (
                        uid === id &&
                        result?.result === 'ACCEPTED' &&
                        command === 'START_SESSION'
                      ) {
                        setIsAuthorized(true);
                        clearInterval(poll);
                      }
                    }
                  }, 2000);
                return () => clearInterval(poll);
            }
        })();
    }, [isAuthorized]);
};

export default usePollForSessionAuth;