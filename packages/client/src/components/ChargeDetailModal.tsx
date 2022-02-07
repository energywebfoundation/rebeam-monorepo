import React, {useState} from "react";
import { IonModal, IonContent, IonButton } from '@ionic/react';
import StationHeader from "./StationHeader";
import RetailerDropdown from "./RetailerDropdown";
import useRetailers from "src/hooks/getRetailers";
import NavigationOptions from "./NavigationOptions"
import styled from "styled-components";
import strings from "../constants/strings.json";
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
    const [selectedProvider, setSelectedProvider] = useState<Provider>();
    const { retailers, loadingRetailers } = useRetailers();

    const hasRetailers = Object.keys(retailers).length > 0
    // This is for the drawer
    return (
        <div>
            <IonModal
                isOpen={isOpen}
                breakpoints={[0.1, 0.5, 1]}
                initialBreakpoint={0.8}
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


{/* <IonModal
isOpen={isOpen}
breakpoints={[0.1, 0.5, 1]}
initialBreakpoint={0.5}
> */}