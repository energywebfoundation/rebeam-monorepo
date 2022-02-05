import React from "react";
import BMWIcon from "../assets/bmwIcon.png";
import { IonContent, IonHeader, IonPage, IonTitle, IonIcon, IonGrid, IonRow, IonCol, IonImg } from '@ionic/react';
import styled from "styled-components";
import strings from "../constants/strings.json";

const CarImg = styled(IonImg)`
`

const DataValue = styled.h1`
font-weight: bold;
font-size: 26px;
line-height: 18px;
color: #5B5B5B;
margin: 2px;
padding: 0;
text-align: left;
`

const DataType = styled.p`
color: #5B5B5B;
text-transform: uppercase;
font-weight: bold;
font-size: 12px;line-height: 18px;
margin: 2px;
padding: 0;
text-align: left;
`

const PaddedRow = styled(IonRow)`
margin-bottom: 40px;

`

export const ChargingStatus = () => {
    return (
        <div>
            <IonGrid>
                <IonRow>
                    <IonCol size="6">
                        <IonGrid>
                            <IonRow>
                                <IonCol>
                                <DataValue>{"00:05:30"}</DataValue>
                                </IonCol>
                            </IonRow>
                            <PaddedRow>
                            <IonCol>
                                <DataType>{strings.duration}</DataType>
                                </IonCol>
                            </PaddedRow>
                            <IonRow>
                                <IonCol>
                                <DataValue>{"0.49"}</DataValue>
                                </IonCol>
                            </IonRow>
                            <PaddedRow>
                                <IonCol>
                                <DataType>{strings.totalKwH}</DataType>
                                </IonCol>
                            </PaddedRow>
                            <IonRow>
                                <IonCol>
                                <DataValue>{"$0.80"}</DataValue>
                                </IonCol>
                            </IonRow>
                            <PaddedRow>
                                <IonCol>
                                <DataType>{strings.cost}</DataType>
                                </IonCol>
                            </PaddedRow>
                        </IonGrid>
                     </IonCol>
                    <IonCol size="6" className="ion-align-self-center">
                        <CarImg src={BMWIcon}/>
                    </IonCol>
                </IonRow>
            </IonGrid>

        </div>
    )
}

export default ChargingStatus;

