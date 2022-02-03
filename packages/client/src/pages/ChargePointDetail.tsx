import { IonContent, IonHeader, IonCard, IonIcon, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { RouteComponentProps } from "react-router-dom";
import React, { useState } from "react";
import RetailerDropdown from "../components/RetailerDropdown";
import { logoElectron } from "ionicons/icons";
import useRetailers from "../hooks/getRetailers";
import ChargingSession from "../components/ChargingSession";

interface ChargePointDetailProps
  extends RouteComponentProps<{
    id: string;
  }> {
  chargePoint: {
    id: number,
    stationName: string
  }

}
export interface Provider {
  name: string,
  id: number,
  logo?: string
}
const ChargePointDetail: React.FC<ChargePointDetailProps> = (props: ChargePointDetailProps) => {
  const [isCharging, setIsCharging] = useState<number>();
  const [chargeStopTime, setChargeStopTime] = useState<number>()
  const [selectedProvider, setSelectedProvider] = useState<Provider>()
  console.log(selectedProvider, "IS THERE A PROVIDER NOW")
  const { match } = props;
  const { chargePoint } = props;
  const { id, stationName } = chargePoint;
  const { retailers, loadingRetailers } = useRetailers();
  console.log(retailers, "ARE THERE RETAILERS???")
  const handleCharge = () => {
    const timeNow = Date.now();
    console.log(timeNow, "whats this")
    if (!isCharging) {
      setIsCharging(timeNow);
      setChargeStopTime(undefined)
    } else if (isCharging) {
      setChargeStopTime(timeNow)
      setIsCharging(undefined)
    }
  }
  console.log(selectedProvider, isCharging, "are all qualifications met")
  const hasRetailers = Object.keys(retailers).length > 0
  console.log(hasRetailers, "IT DOES HAVE RETAILERS")
  return (
    <IonPage>
      <IonHeader className="ion-padding" style={{
        backgroundColor: "blue",
        color: "white"
      }}>
        <IonTitle>Charge Point Detail Page</IonTitle>
      </IonHeader>
      <IonContent>
        <IonCard>
          <p>Station Id: {id}</p>
          <p>Station Name {stationName}</p>
        </IonCard>
        {hasRetailers && (
          <RetailerDropdown retailers={retailers} loadingRetailers={loadingRetailers} selectedProvider={selectedProvider} setSelectedProvider={setSelectedProvider} />
        )}
        {selectedProvider && (
          <div className="ion-padding ion-text-center">
            <p>Your selected provider: {selectedProvider!.name}</p>
          <IonButton onClick={handleCharge}>
            <IonIcon slot="start" icon={logoElectron}></IonIcon>
            {!isCharging ? "Start Charge Session" : "Stop Charge Session"}
          </IonButton>
          </div>
        )}
        {isCharging && selectedProvider && (
          <ChargingSession chargeStartTime={isCharging} provider={selectedProvider} stopTime={chargeStopTime}/>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ChargePointDetail;

//<ion-icon name="logo-electron"></ion-icon>