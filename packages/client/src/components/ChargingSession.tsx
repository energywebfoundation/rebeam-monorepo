import { IonContent, IonCard, IonCardContent, IonCardHeader, IonItem, IonHeader, IonPage, IonTitle } from '@ionic/react';
import { Provider } from "../pages/ChargePointDetail";

interface ChargingSessionProps {
    chargeStartTime: number,
    provider: Provider,
    stopTime?: number
}

const ChargingSession: React.FC<ChargingSessionProps> = (props: ChargingSessionProps) => {
    const { provider, chargeStartTime, stopTime } = props;
    return (
                    <IonCard>
                        <IonCardHeader>
                            Charging Session Details
                        </IonCardHeader>
                        <IonCardContent>
                           <div>{chargeStartTime ? `Your Charging Session has started with ${provider.name}`: `You're charging session has ended with ${provider.name}`}</div> 
                            <div>{chargeStartTime ? `Start time: ${chargeStartTime}`: `Charge End Time: ${stopTime}`}</div>
                        </IonCardContent>
                    </IonCard>
    );
};

export default ChargingSession;