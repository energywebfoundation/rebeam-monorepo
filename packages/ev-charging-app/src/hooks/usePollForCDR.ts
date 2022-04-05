import { useEffect, useState } from 'react';
import axios from 'axios';
import { ICdrData} from '../pages/ChargingSession';

/*
    Hook to retrieve CDR data. 
*/
const usePollForCDR = (stopChargeRequested: boolean, endSession: (x: boolean) => void, sessionEnded: boolean) => {
    const [cdrData, setcdrData] = useState<ICdrData | undefined>(undefined);
    useEffect(() => {
            if (stopChargeRequested && !sessionEnded) {
                const poll = setInterval(async () => {
                  const id = localStorage.getItem('ocpiToken');
                  const results = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}charge/session-cdr/${id}`
                  );
                  if (results?.data) {
                    const data = results.data;
                    setcdrData(data);
                    endSession(true);
                    clearInterval(poll);
                  }
                }, 3000);
                return () => clearInterval(poll);
              }
    }, [stopChargeRequested, cdrData, sessionEnded]);
    return { cdrData };
};

export default usePollForCDR;