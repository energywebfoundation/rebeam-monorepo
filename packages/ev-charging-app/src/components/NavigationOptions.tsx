import React from 'react';
import { IonGrid, IonRow, IonCol, IonImg } from '@ionic/react';
import Waze from '../assets/svgs/waze-icon.svg';
import GoogleMap from '../assets/svgs/google-maps-icon.svg';
import AppleMap from '../assets/svgs/maps-icon.svg';
import styled from 'styled-components';
import strings from '../constants/strings.json';

const NavImg = styled(IonImg)`
  height: 28px;
`;

const NavText = styled.p`
  margin: 0;
  padding: 0;
  text-align: center;
  font-size: 10px;
  line-height: 18px;
  color: #727272;
`;

const NavigationOptions = () => {
  return (
    <div>
      <IonGrid>
        <IonRow>
          <IonCol size="4">
            <IonGrid>
              <IonRow>
                <IonCol>
                  <NavImg src={AppleMap}></NavImg>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <NavText>{strings.maps}</NavText>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCol>
          <IonCol size="4">
            <IonGrid>
              <IonRow>
                <IonCol>
                  <NavImg src={GoogleMap}></NavImg>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <NavText>{strings.googleMaps}</NavText>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCol>
          <IonCol size="4">
            <IonGrid>
              <IonRow>
                <IonCol>
                  <NavImg src={Waze}></NavImg>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <NavText>{strings.waze}</NavText>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
};

export default NavigationOptions;
