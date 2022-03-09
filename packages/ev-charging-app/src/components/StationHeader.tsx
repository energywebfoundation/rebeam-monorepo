import { IonGrid, IonRow, IonCol, IonImg } from '@ionic/react';
import React from 'react';
import styled from 'styled-components';
import ChargeStationImg from '../assets/BuildingImg.png';
import ModalPinIcon from '../assets/ModalPinIcon.png';
import { ChargePoint } from '../App';

const Header = styled.h1`
  font-weight: bold;
  font-size: 15px;
  color: #363636;
  margin: 0;
  font-family: Arial;
  text-align: left;
  padding: 0;
`;

const Address = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: #363636;
  margin: 0 0 2px;
  padding: 0;
  text-align: left;
`;

const MapInfo = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: #363636;
  margin: 0;
  padding: 0;
  color: #a466ff;
  text-align: left;
`;

const GridContainer = styled.div`
  margin: 20px 18px 15px;
`;

interface StationHeaderProps {
  selectedChargePoint: ChargePoint;
}

const StationHeader = (props: StationHeaderProps) => {
  const { selectedChargePoint } = props;
  return (
    <GridContainer>
      <IonGrid>
        <IonRow>
          <IonCol size="3">
            <div
              style={{
                borderRadius: '10px',
                backgroundImage: `url(${ChargeStationImg})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100%',
                margin: '0 auto',
              }}
            ></div>
          </IonCol>
          <IonCol>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <Header>{selectedChargePoint.stationName}</Header>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <Address>{selectedChargePoint.formattedAddress}</Address>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonImg src={ModalPinIcon}></IonImg>
                <IonCol>
                  <MapInfo>{'450m/5m'}</MapInfo>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCol>
        </IonRow>
      </IonGrid>
    </GridContainer>
  );
};

export default StationHeader;
