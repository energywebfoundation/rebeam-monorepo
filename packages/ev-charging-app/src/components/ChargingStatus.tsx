import React from 'react';
import BMWIcon from '../assets/bmwIcon.png';
import { IonGrid, IonRow, IonCol, IonImg } from '@ionic/react';
import styled from 'styled-components';
import strings from '../constants/strings.json';
import { ICdrData, ISessionData } from '../pages/ChargingSession';
const CarImg = styled(IonImg)``;

const StartTime = styled.h3`
  font-weight: bold;
  font-size: 15px;
  line-height: 18px;
  color: #5b5b5b;
  margin: 2px;
  padding: 0;
  text-align: left;
`;

const DataValue = styled.h1`
  font-weight: bold;
  font-size: 26px;
  line-height: 18px;
  color: #5b5b5b;
  margin: 2px;
  padding: 0;
  text-align: left;
`;

const DataType = styled.p`
  color: #5b5b5b;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 12px;
  line-height: 18px;
  margin: 2px;
  padding: 0;
  text-align: left;
`;

const PaddedRow = styled(IonRow)`
  margin-bottom: 40px;
`;

const ChargeDataRow = styled(IonRow)`
margin-top: 20%;
`

interface IChargingStatusProps {
  chargeSessionData: ISessionData;
  cdrData?: ICdrData;
}

export const ChargingStatus = (props: IChargingStatusProps) => {
  const { chargeSessionData, cdrData } = props;
  const { kwh, formattedStartTime } = chargeSessionData;
  return (
      <ChargeDataRow className="ion-padding">
        <IonCol size="6">
          <IonGrid>
            <IonRow>
              <IonCol>
                <StartTime>{formattedStartTime}</StartTime>
              </IonCol>
            </IonRow>
            <PaddedRow>
              <IonCol>
                <DataType>{strings.duration}</DataType>
              </IonCol>
            </PaddedRow>
            <IonRow>
              <IonCol>
                <DataValue>{kwh || '...'}</DataValue>
              </IonCol>
            </IonRow>
            <PaddedRow>
              <IonCol>
                <DataType>{strings.totalKwH}</DataType>
              </IonCol>
            </PaddedRow>
            <IonRow>
              <IonCol>
                <DataValue>{cdrData?.formattedCost || '...'}</DataValue>
              </IonCol>
            </IonRow>
            <PaddedRow>
              <IonCol>
                <DataType>{strings.cost}</DataType>
              </IonCol>
            </PaddedRow>
            <IonRow>
              <IonCol>
                <StartTime>{cdrData?.formattedEndTime || '...'}</StartTime>
              </IonCol>
            </IonRow>
            <PaddedRow>
              <IonCol>
                <DataType>{strings.sessionEndTime}</DataType>
              </IonCol>
            </PaddedRow>
          </IonGrid>
        </IonCol>
        <IonCol size="6" className="ion-align-self-center">
          <CarImg src={BMWIcon} />
        </IonCol>
      </ChargeDataRow>
  );
};

export default ChargingStatus;
