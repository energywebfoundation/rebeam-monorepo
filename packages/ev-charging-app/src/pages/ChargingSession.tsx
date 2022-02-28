import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonLoading,
} from '@ionic/react';
import styled from 'styled-components';
import strings from '../constants/strings.json';
import { chevronBackOutline } from 'ionicons/icons';
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

interface IChargingSessionProps {
  token: string;
}

export interface ISessionData {
  kwh?: number;
  formattedCost?: string;
  start_date_time: string;
  last_updated: string;
  id: string;
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
      const poll = setInterval(async () => {
        const id = localStorage.getItem('ocpiToken');
        const results = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}charge/fetch-session/`,
          {
            sessionId: id,
          }
        );
        if (results?.data) {
          const data = results.data;
          setSessionData(data);
          console.log(results.data);
        }
      }, 500);
      return () => clearInterval(poll);
    }
  }, [isAuthorized]);

  return (
    <IonPage>
      <IonContent>
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
        {isAuthorized && !sessionData && <ChargeAuthorized />}
        <IonLoading
          isOpen={!isAuthorized}
          message={strings.requestingChargeLoader}
        />
        {isAuthorized && sessionData && (
          <>
            <IonGrid></IonGrid>
            <ChargingStatus chargeSessionData={sessionData} />
            <StopCharge />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ChargingSession;
