import React, {useState} from "react";
import { IonModal, IonContent, IonButton } from '@ionic/react';
import StationHeader from "./StationHeader";
import RetailerDropdown from "./RetailerDropdown";
import useRetailers from "src/hooks/getRetailers";
import NavigationOptions from "./NavigationOptions"
import styled from "styled-components";
import strings from "../constants/strings.json";
import { useHistory } from "react-router-dom";
import { ChargePoint } from "../App";


export interface Provider {
    name: string,
    id: number,
    logo?: string
  }
  

export interface DetailModalProps {
    selectedChargePoint?: ChargePoint;
    setSelectedChargePoint: any
    isOpen: boolean;
    handleStartCharge: () => void;

}

const ChargePointDetailModal = (props: DetailModalProps) => {
    const history = useHistory();
        
const SectionBreak = styled.br`
backgroundColor: "#B3BBC0"
`
const StyledBorder = styled.hr`
background-color: #B3BBC0;
margin: 0;
`
const SessionButton = styled(IonButton)`
font-size: 16px;
line-height: 20px;
text-align: center;
letter-spacing: 0.4px;
--color: white;
`
    const {selectedChargePoint, isOpen, setSelectedChargePoint, handleStartCharge} = props;
    console.log(isOpen, "IS OPEN")
    const [selectedProvider, setSelectedProvider] = useState<Provider>();
    console.log("State Selected Provider Set:", selectedProvider,)
    const { retailers, loadingRetailers } = useRetailers();
    console.log("State Retailers Set:", retailers)

    const hasRetailers = Object.keys(retailers).length > 0
    // This is for the drawer
    return (
        <div>
            <IonModal
                isOpen={isOpen}
                breakpoints={[0.1, 0.5, 1]}
                initialBreakpoint={0.5}
            >
                <IonContent>
                    <StationHeader selectedChargePoint={selectedChargePoint}/>
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
                </IonContent>
            </IonModal>
        </div>
    )
}

export default ChargePointDetailModal;
