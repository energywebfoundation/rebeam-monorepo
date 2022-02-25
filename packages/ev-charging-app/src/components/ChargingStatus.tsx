import React from 'react';
import BMWIcon from '../assets/bmwIcon.png';
import { IonGrid, IonRow, IonCol, IonImg } from '@ionic/react';
import styled from 'styled-components';
import strings from '../constants/strings.json';
import { ISessionData } from '../pages/ChargingSession';
const CarImg = styled(IonImg)``;

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

interface IChargingStatusProps {
  chargeSessionData: ISessionData;
}

export const ChargingStatus = (props: IChargingStatusProps) => {
  const { chargeSessionData } = props;
  const { kwh, formattedCost, start_date_time } = chargeSessionData;
  return (
    <div>
      <IonGrid>
        <IonRow>
          <IonCol size="6">
            <IonGrid>
              <IonRow>
                <IonCol>
                  <DataValue>{start_date_time}</DataValue>
                </IonCol>
              </IonRow>
              <PaddedRow>
                <IonCol>
                  <DataType>{strings.duration}</DataType>
                </IonCol>
              </PaddedRow>
              <IonRow>
                <IonCol>
                  <DataValue>{kwh ? kwh : '...'}</DataValue>
                </IonCol>
              </IonRow>
              <PaddedRow>
                <IonCol>
                  <DataType>{strings.totalKwH}</DataType>
                </IonCol>
              </PaddedRow>
              <IonRow>
                <IonCol>
                  <DataValue>{formattedCost ? formattedCost : '...'}</DataValue>
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
            <CarImg src={BMWIcon} />
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
};

export default ChargingStatus;
