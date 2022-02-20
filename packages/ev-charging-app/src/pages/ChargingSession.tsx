import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonLoading,
} from '@ionic/react';
import styled from 'styled-components';
import strings from '../constants/strings.json';
import { chevronBackOutline } from 'ionicons/icons';
import ChargingStatusIcon from '../assets/ChargingStatusIcon.png';
import ChargingStatus from '../components/ChargingStatus';
import StopCharge from '../components/StopCharge';
import { useHistory } from 'react-router-dom';
import ChargeAuthorized from '../components/ChargeAuthorized';
import axios from 'axios';
const ChargingHeader = styled.h1`
  font-size: 21px;
  line-height: 25px;
  text-align: center;
  color: #030303;
  margin: 10px 0;
`;

const StatusImg = styled(IonImg)`
  height: 242px;
`;

interface IChargingSessionProps {
  token: string;
}

interface ISessionData {
  duration: string;
  totalKwh: string;
  cost: string;
}

export interface IPresentationData {
  prentationLinkEncoded: string;
}

const ChargingSession: React.FC<IChargingSessionProps> = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sessionData, setSessionData] = useState<ISessionData | null>(null);
  const history = useHistory();
  const handleBackClick = () => {
    history.push('/map');
  };

  useEffect(() => {
    if (!isAuthorized) {
      const poll = setInterval(async () => {
        const id = localStorage.getItem('ocpiToken');
        const results = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}charge/session-conf/${id}`
        );
        console.log(results?.data, 'THE DATA FROM THE MOCK AUTH CALL');
        if (results?.data) {
          const data = results.data;
          const { command, uid, result } = data;
          if (
            uid === id &&
            result === 'ACCEPTED' &&
            command === 'START_SESSION'
          ) {
            setIsAuthorized(true);
          }
          //QUESTION: Should we also set isAuthorized inlocal storage? in case user closes app?
          return () => clearInterval();
        }
      }, 2000);
      return () => clearInterval(poll);
    }
  }, [isAuthorized]);

  useEffect(() => {
    if (isAuthorized) {
      console.log('in this');
      const poll = setInterval(async () => {
        const id = localStorage.getItem('ocpiToken');
        const results = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}charge/session-update/${id}`
        );
        console.log(results?.data, 'THE DATA FROM THE MOCK SESSION CALL');
        if (results?.data) {
          const data = results.data;
          const { kwh, totalCost } = data;
          const duration = '2 min';
          setSessionData({
            totalKwh: kwh,
            cost: totalCost,
            duration,
          });
          console.log(results.data);
          return () => clearInterval();
        }
      }, 2000);
      return () => clearInterval(poll);
    }
  }, [sessionData, isAuthorized]);

  return (
    <IonPage>
      <IonContent>
        <IonLoading
          isOpen={!isAuthorized}
          message={strings.requestingChargeLoader}
        />
        {isAuthorized && !sessionData && <ChargeAuthorized />}
        {isAuthorized && sessionData && (
          <>
            <IonGrid>
              <IonRow>
                <IonCol
                  size="1"
                  className=" ion-align-items-center ion-align-self-center"
                >
                  <IonIcon
                    onClick={handleBackClick}
                    icon={chevronBackOutline}
                    className="ion-align-self-center"
                  ></IonIcon>
                </IonCol>
                <IonCol className="ion-align-self-center">
                  <ChargingHeader>{strings.charging}</ChargingHeader>
                </IonCol>
                <IonCol size="1" className=" ion-align-items-center"></IonCol>
              </IonRow>
            </IonGrid>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <StatusImg src={ChargingStatusIcon}></StatusImg>
                </IonCol>
              </IonRow>
            </IonGrid>
            <ChargingStatus />
            <StopCharge />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ChargingSession;
