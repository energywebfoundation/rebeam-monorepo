import { IonGrid, IonRow, IonCol, IonImg } from '@ionic/react';
import React from 'react';
import styled from 'styled-components';
import ChargeStationImg from '../assets/BuildingImg.png';
import ModalPinIcon from '../assets/ModalPinIcon.png';
import { ChargePoint } from '../App';

const Header = styled.h1`
  font-weight: bold;
  font-size: 17px;
  color: #363636;
  margin: 2px 0;
  font-family: Arial;
  text-align: left;
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
const MapIcon = styled(IonImg)``;

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

const RowContainer = styled(IonRow)`
  height: 110px;
`;

const ImgCol = styled(IonCol)`
  margin-right: 14px;
`;

const HeaderRow = styled(IonRow)`
  height: 35px;
`;

const AddressRow = styled(IonRow)`
  height: 17px;
`;

const MapPinRow = styled(IonRow)`
  height: 17px;
  margin-top: 5px;
`;

interface StationHeaderProps {
  selectedChargePoint: ChargePoint;
}

const StationHeader = (props: StationHeaderProps) => {
  const { selectedChargePoint } = props;
  return (
    <div>
      <IonGrid>
        <RowContainer>
          <ImgCol size="3">
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
          </ImgCol>
          <IonCol>
            <IonGrid>
              <HeaderRow>
                <IonCol>
                  <Header>{selectedChargePoint.stationName}</Header>
                </IonCol>
              </HeaderRow>
              <AddressRow>
                <IonCol>
                  <Address>{selectedChargePoint.formattedAddress}</Address>
                </IonCol>
              </AddressRow>
              <MapPinRow>
                <MapIcon src={ModalPinIcon}></MapIcon>
                <IonCol>
                  <MapInfo>{'450m/5m'}</MapInfo>
                </IonCol>
              </MapPinRow>
            </IonGrid>
          </IonCol>
        </RowContainer>
      </IonGrid>
    </div>
  );
};

export default StationHeader;
