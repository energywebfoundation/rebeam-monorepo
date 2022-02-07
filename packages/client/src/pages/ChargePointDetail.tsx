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
import strings from "../constants/strings.json";
import { useHistory } from "react-router-dom";

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
font-size: 16px;
line-height: 20px;
text-align: center;
letter-spacing: 0.4px;
--color: white;
`

const ChargePointDetail: React.FC<ChargePointDetailProps> = (props: ChargePointDetailProps) => {
  const [isCharging, setIsCharging] = useState<number>();
  const [chargeStopTime, setChargeStopTime] = useState<number>();
  const [selectedProvider, setSelectedProvider] = useState<Provider>();
  const history = useHistory();
  console.log("State Selected Provider Set:", selectedProvider,)
  const { retailers, loadingRetailers } = useRetailers();
  console.log("State Retailers Set:", retailers)
  const handleStartCharge = () => {
    history.push(`/charge`)
  }


  const StyledBorder = styled.hr`
    background-color: #B3BBC0;
    margin: 0;
  `
  const hasRetailers = Object.keys(retailers).length > 0
  return (
    <IonPage>
      <IonContent>
        <StationHeader />
        <StyledBorder></StyledBorder>
        <NavigationOptions />
        <StyledBorder></StyledBorder>
        {hasRetailers && (
          <RetailerDropdown retailers={retailers} loadingRetailers={loadingRetailers} selectedProvider={selectedProvider} setSelectedProvider={setSelectedProvider} />
        )}
        <StyledBorder></StyledBorder>
        <div className="ion-padding ion-text-center">
          <SessionButton expand="block" onClick={handleStartCharge} disabled={!selectedProvider} color={selectedProvider ? "primary" : "warning"}>
            {strings.startCharging}
          </SessionButton>
        </div>

        {isCharging && selectedProvider && (
          <ChargingSession chargeStartTime={isCharging} provider={selectedProvider} stopTime={chargeStopTime} />
        )}
      </IonContent>
    </IonPage>
  );
};

export default ChargePointDetail;

//<ion-icon name="logo-electron"></ion-icon>