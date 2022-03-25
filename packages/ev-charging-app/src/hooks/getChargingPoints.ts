import { useEffect, useState } from 'react';
import axios from 'axios';

/*
    Hook to retrieve charging points. 
    Will be called only on initial render as it does not depend on any state variables.
*/
export interface LocationProperties {
    id: string;
    partyId: string;
    countryCode: string;
    stationName: string;
    formattedAddress: string;
    country: string;
    evses: string;
    operator: string;

}
interface Location {
    properties: LocationProperties
    geometry: {
        coordinates: number[]
    }
}
interface ChargePoints {
    features: Location[]
}
const useChargePoints = () => {
    const [chargePoints, setChargePoints] = useState<ChargePoints | null>(null);
    const [loadingChargePoints, setLoadingChargePoints] = useState(false);
    useEffect(() => {
        (async () => {
            try {
                setLoadingChargePoints(true);
				const locationResult = await axios.get(`${process.env.REACT_APP_BACKEND_URL}location/get-client-locations`);
				if (locationResult?.data?.locations) {
				const data = {
					features: locationResult?.data?.locations
				}
                setChargePoints(data);
			}
            } catch (error) {
                console.error('Error while fetching charge points', error);
            } finally {
                setLoadingChargePoints(false);
            }
        })();
    }, []);
    return { chargePoints, loadingChargePoints, setLoadingChargePoints };
};

export default useChargePoints;
