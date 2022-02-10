import { IonContent, IonPage, IonIcon, IonGrid, IonRow, IonCol, IonImg } from '@ionic/react';
import styled from "styled-components";
import strings from "../constants/strings.json";
import { chevronBackOutline } from "ionicons/icons";
import ChargingStatusIcon from "../assets/ChargingStatusIcon.png";
import ChargingStatus from "../components/ChargingStatus"
import StopCharge from '../components/StopCharge';
import {useHistory }from "react-router-dom";

const ChargingHeader = styled.h1`
font-size: 21px;
line-height: 25px;
text-align: center;
color: #030303;
margin: 10px 0
`

const StatusImg = styled(IonImg)`
    height: 242px;
`


const ChargingSession: React.FC = () => {
    const history = useHistory();
    const handleBackClick = () => {
        history.push('/map');
    }
    return (
        <IonPage>
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonCol size="1" className=" ion-align-items-center ion-align-self-center">
                                <IonIcon onClick={handleBackClick} icon={chevronBackOutline} className="ion-align-self-center"></IonIcon>
                        </IonCol>
                        <IonCol className="ion-align-self-center">
                            <ChargingHeader>{strings.charging}</ChargingHeader>
                        </IonCol>
                        <IonCol size="1" className=" ion-align-items-center">
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <StatusImg src={ChargingStatusIcon}>
                            </StatusImg>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <ChargingStatus/>
                <StopCharge/>
            </IonContent>
        </IonPage>
    );
};

export default ChargingSession;

