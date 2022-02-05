import React from "react";
import styled from "styled-components";
import { IonContent, IonHeader, IonPage, IonTitle, IonIcon, IonGrid, IonRow, IonCol, IonImg, IonButton } from '@ionic/react';
import strings from "../constants/strings.json";

const MessageContainer = styled.div`
font-style: normal;
font-weight: normal;
font-size: 14px;
line-height: 18px;
text-align: center;
color: #000000;
`

const StopButton = styled(IonButton)`
font-style: normal;
font-weight: bold;
font-size: 16px;
line-height: 20px;
text-align: center;
letter-spacing: 0.4px;
--color: white;
margin-bottom: 10px;
`

export const StopCharge = () => {
    return (
        <div>
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <StopButton color="danger" expand="block">{strings.stopCharging}</StopButton>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <MessageContainer>
                            {strings.stopChargingMessage}
                        </MessageContainer>
                    </IonCol>
                </IonRow>
            </IonGrid>


        </div>

    )
}

export default StopCharge;
