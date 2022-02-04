import { IonContent, IonHeader, IonCard, IonIcon, IonItemDivider, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { RouteComponentProps } from "react-router-dom";
import React, { useState } from "react";
import RetailerDropdown from "../components/RetailerDropdown";
import { logoElectron } from "ionicons/icons";
import useRetailers from "../hooks/getRetailers";
import ChargingSession from "../components/ChargingSession";
import StationHeader from "../components/StationHeader";
import NavigationOptions from "../components/NavigationOptions";
import styled from "styled-components";

interface ChargePoint {
  id: number,
  stationName: string,
  formattedAddress?: string,
  img?: string
}
interface ChargePointDetailProps
  extends RouteComponentProps<{
    id: string;
  }> {
  chargePoint: ChargePoint

}
export interface Provider {
  name: string,
  id: number,
  logo?: string
}

const SectionBreak = styled.br`
backgroundColor: "#B3BBC0"
`

const SessionButton = styled(IonButton)`
color: orange

`

const ChargePointDetail: React.FC<ChargePointDetailProps> = (props: ChargePointDetailProps) => {
  const [isCharging, setIsCharging] = useState<number>();
  const [chargeStopTime, setChargeStopTime] = useState<number>()
  const [selectedProvider, setSelectedProvider] = useState<Provider>()
  console.log("State Selected Provider Set:", selectedProvider, )
  const { match } = props;
  const { chargePoint } = props;
  const { id, stationName } = chargePoint;
  const { retailers, loadingRetailers } = useRetailers();
  console.log("State Retailers Set:", retailers)
  const handleCharge = () => {
    const timeNow = Date.now();
    if (!isCharging) {
      setIsCharging(timeNow);
      setChargeStopTime(undefined)
    } else if (isCharging) {
      setChargeStopTime(timeNow)
      setIsCharging(undefined)
    }
  }
  const hasRetailers = Object.keys(retailers).length > 0
  return (
    <IonPage>
      <IonContent>
      <StationHeader/>
      <hr style={{
        backgroundColor: "#B3BBC0"
      }}></hr>
      <NavigationOptions/>
      <hr style={{
        backgroundColor: "#B3BBC0"
      }}></hr>
        {hasRetailers && (
          <RetailerDropdown retailers={retailers} loadingRetailers={loadingRetailers} selectedProvider={selectedProvider} setSelectedProvider={setSelectedProvider} />
        )}
          <hr style={{
        backgroundColor: "#B3BBC0"
      }}></hr>
     
          <div className="ion-padding ion-text-center">
          <SessionButton expand="block" onClick={handleCharge}>
            {!isCharging ? "Start Charging" : "Stop Charge Session"}
          </SessionButton>
          </div>
       
        {isCharging && selectedProvider && (
          <ChargingSession chargeStartTime={isCharging} provider={selectedProvider} stopTime={chargeStopTime}/>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ChargePointDetail;

//<ion-icon name="logo-electron"></ion-icon>