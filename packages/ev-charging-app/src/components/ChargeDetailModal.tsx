import React from 'react';
import { IonModal, IonContent, IonButton } from '@ionic/react';
import StationHeader from './StationHeader';
import NavigationOptions from './NavigationOptions';
import styled from 'styled-components';
import strings from '../constants/strings.json';
import { ChargePoint } from '../App';

export interface Provider {
  name: string;
  id: number;
  logo?: string;
}

export interface DetailModalProps {
  selectedChargePoint?: ChargePoint;
  isOpen: boolean;
  handleStartCharge: () => void;
  showModal: (x: boolean) => void;
  setToken: (x: string) => void;
}

const StyledBorder = styled.hr`
  background-color: #b3bbc0;
  margin: 0;
`;
const SessionButton = styled(IonButton)`
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.4px;
  --color: white;
`;

const ChargePointDetailModal = (props: DetailModalProps) => {
  const { selectedChargePoint, isOpen, handleStartCharge, showModal } = props;
  const handleDismiss = () => {
    showModal(false);
  };
  return (
    <div>
      {selectedChargePoint && (
        <IonModal
          isOpen={isOpen}
          breakpoints={[0.1, 0.5, 1]}
          initialBreakpoint={0.35}
          onDidDismiss={handleDismiss}
        >
          <IonContent>
            <StationHeader selectedChargePoint={selectedChargePoint} />
            <StyledBorder></StyledBorder>
            <NavigationOptions />
            <StyledBorder></StyledBorder>
            <div className="ion-padding ion-text-center">
              <SessionButton
                id="start-charging "
                expand="block"
                onClick={handleStartCharge}
                color={'primary'}
              >
                {strings.requestStartCharging}
              </SessionButton>
            </div>
          </IonContent>
        </IonModal>
      )}
    </div>
  );
};

export default ChargePointDetailModal;
