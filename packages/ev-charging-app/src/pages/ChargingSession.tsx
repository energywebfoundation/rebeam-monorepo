import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonLoading,
  IonProgressBar,
} from '@ionic/react';
import axios from 'axios';
import styled from 'styled-components';
import strings from '../constants/strings.json';
import { chevronBackOutline } from 'ionicons/icons';
import ChargingStatus from '../components/ChargingStatus';
import StopCharge from '../components/StopCharge';
import { useHistory } from 'react-router-dom';
import usePollForSessionAuth from '../hooks/usePollForSessionAuthorization';
import usePollForSessionUpdates from '../hooks/usePollForSessionUpdates';
import usePollForPresentationData from '../hooks/usePollForPresentationData';
import WalletPopover from '../components/WalletPopover';
import usePollForCDR from '../hooks/usePollForCDR';
const ChargingHeader = styled.h1`
  font-size: 21px;
  line-height: 25px;
  text-align: center;
  color: #030303;
  margin: 10px 0;
`;

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

const ChargingSession = () => {
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sessionData, setSessionData] = useState<ISessionData | null>(null);
  const [sessionEnded, endSession] = useState(false);
  const [stopChargeRequested, setStopChargeRequested] = useState(false);
  const history = useHistory();

  usePollForSessionAuth(isAuthorized, setIsAuthorized);
  usePollForSessionUpdates(isAuthorized, setSessionData, sessionEnded);
  const {
    presentation,
    pollingForPresentationData,
    setPresentation,
    setpollingForPresentationData,
  } = usePollForPresentationData(setSupplierModalOpen);
  const { cdrData } = usePollForCDR(
    stopChargeRequested,
    endSession,
    sessionEnded
  );
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
      setpollingForPresentationData(true);
    }
  };

  const handleSelectSwitchboard = () => {
    window.open(`${process.env.REACT_APP_SWITCHBOARD_URL}${presentation}`);
    setTimeout(() => {
      setSupplierModalOpen(false);
      setStopChargeRequested(true);
    }, 5000);
  };

  const handleWalletPopoverDismiss = () => {
    setSupplierModalOpen(false);
    setPresentation(undefined);
    setpollingForPresentationData(false);
  };

  return (
    <IonPage>
      <IonContent>
        <IonLoading
          isOpen={pollingForPresentationData}
          message={strings.requestStopCharging}
          onDidDismiss={() => setpollingForPresentationData(false)}
        />
        <IonLoading
          isOpen={stopChargeRequested && !cdrData}
          message={strings.retrievingSessionData}
        />
        <IonLoading
          isOpen={isAuthorized && !sessionData}
          message={strings.chargeAuthorized}
        />
        <IonLoading isOpen={!isAuthorized} message={strings.requestingAuth} />
        <IonGrid>
          <IonRow>
            <IonCol
              size="1"
              className=" ion-align-items-center ion-align-self-center"
            >
              <IonIcon
                onClick={() => {
                  history.push('/map');
                }}
                icon={chevronBackOutline}
                className="ion-align-self-center"
              ></IonIcon>
            </IonCol>
            <IonCol className="ion-align-self-center">
              <ChargingHeader>{strings.charging}</ChargingHeader>
            </IonCol>
            <IonCol size="1" className=" ion-align-items-center"></IonCol>
          </IonRow>
          {isAuthorized && sessionData && (
            <>
              <ChargingStatus
                chargeSessionData={sessionData}
                cdrData={cdrData}
              />
              {!sessionEnded && (
                <IonProgressBar type="indeterminate"></IonProgressBar>
              )}
              <StopCharge
                handleStopCharge={handleStopSessionClick}
                sessionEnded={sessionEnded}
              />
            </>
          )}

          <WalletPopover
            isOpen={supplierModalOpen && !!presentation}
            presentationDataEncoded={presentation}
            handleWalletSelect={handleSelectSwitchboard}
            handleDismiss={handleWalletPopoverDismiss}
          />
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ChargingSession;
