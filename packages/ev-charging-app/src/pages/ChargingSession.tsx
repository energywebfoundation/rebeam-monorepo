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
import axios from "axios";
import styled from 'styled-components';
import strings from '../constants/strings.json';
import { chevronBackOutline } from 'ionicons/icons';
import ChargingStatus from '../components/ChargingStatus';
import StopCharge from '../components/StopCharge';
import { useHistory } from 'react-router-dom';
import ChargeAuthorized from '../components/ChargeAuthorized';
import usePollForSessionAuth from '../hooks/usePollForSessionAuthorization';
import usePollForSessionUpdates from '../hooks/usePollForSessionUpdates';
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
  formattedStartTime: string;
}

export interface ICdrData {
  formattedCost?: string;
  id: string;
  formattedEndTime: string;
  sessionToken: string;
}

export interface IPresentationData {
  prentationLinkEncoded: string;
}

const ChargingSession: React.FC<IChargingSessionProps> = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sessionData, setSessionData] = useState<ISessionData | null>(null);
  const [sessionEnded, endSession] = useState(false);
  const [cdrData, setcdrData] = useState<ICdrData | undefined>(undefined);
  const history = useHistory();

  const handleBackClick = () => {
    history.push('/map');
  };

  usePollForSessionAuth(isAuthorized, setIsAuthorized);
  usePollForSessionUpdates(isAuthorized, setSessionData);

  const handleStopSessionClick = async () => {
    const requestStopBody = {
      token: localStorage.getItem('ocpiToken'),
      id: sessionData?.id,
    };
    const result = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}charge/stop-session/`,
      requestStopBody
    );
    if (result.status === 200) {
      endSession(true);
    }
  };



useEffect(() => {
    if (sessionEnded && !cdrData) {
      const poll = setInterval(async () => {
        const id = localStorage.getItem('ocpiToken');
        const results = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}charge/session-cdr/${id}`
        );
        if (results?.data) {
          const data = results.data;
          setcdrData(data);
        }
      }, 500);
      return () => clearInterval(poll);
    }
  }, [sessionEnded, cdrData]);  

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
            <ChargingStatus chargeSessionData={sessionData} cdrData={cdrData} />
            <StopCharge
              handleStopCharge={handleStopSessionClick}
              sessionEnded={sessionEnded}
            />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ChargingSession;
