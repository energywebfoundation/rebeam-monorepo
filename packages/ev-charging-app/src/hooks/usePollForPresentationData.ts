import { useEffect, useState } from 'react';
import axios from 'axios';

/*
    Hook to retrieve charging points. 
    Will be called only on initial render as it does not depend on any state variables.
*/
const usePollForPresentationData = (setSupplierModalOpen: (x: boolean) => void) => {
    const [chargeProcessLoading, setChargeProcessLoading] = useState(false);
    const [presentation, setPresentation] = useState<string>();
    useEffect(() => {
        (async () => {
            if (presentation === undefined && chargeProcessLoading) {
                const poll = setInterval(async () => {
                    const id = localStorage.getItem('ocpiToken');
                    const results = await axios.get(
                        `${process.env.REACT_APP_BACKEND_URL}presentation/${id}`
                    );
                    if (results?.data?.presentationLinkEncoded) {
                        setChargeProcessLoading(false);
                        setPresentation(results.data.presentationLinkEncoded);
                        setSupplierModalOpen(true);
                        localStorage.setItem(results.data.ocpiTokenUID, results.data);
                        clearInterval(poll);
                    }
                }, 2000);
                return () => clearInterval(poll);
            }
        })();
    }, [presentation, chargeProcessLoading]);
    return { chargeProcessLoading, presentation, setPresentation, setChargeProcessLoading };
};

export default usePollForPresentationData;