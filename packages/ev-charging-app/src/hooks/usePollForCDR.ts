import { useEffect, useState } from 'react';
import axios from 'axios';
import { ICdrData } from '../pages/ChargingSession';

/*
    Hook to retrieve CDR data. 
*/
const usePollForCDR = (sessionEnded: boolean) => {
    const [cdrData, setcdrData] = useState<ICdrData | undefined>(undefined);
    useEffect(() => {
        (async () => {
            if (sessionEnded && !cdrData) {
                const poll = setInterval(async () => {
                  const id = localStorage.getItem('ocpiToken');
                  const results = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}charge/session-cdr/${id}`
                  );
                  if (results?.data) {
                    const data = results.data;
                    setcdrData(data);
                    clearInterval(poll);
                  }
                }, 500);
                return () => clearInterval(poll);
              }
        })();
    }, [sessionEnded, cdrData]);
    return { cdrData };
};

export default usePollForCDR;