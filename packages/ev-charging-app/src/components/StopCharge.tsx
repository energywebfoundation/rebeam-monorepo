import React from 'react';
import styled from 'styled-components';
import { IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import strings from '../constants/strings.json';

const StopButton = styled(IonButton)`
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.4px;
  --color: white;
  margin-bottom: 10px;
`;

interface IStopChargeProps {
  handleStopCharge: () => void;
  sessionEnded: boolean;
}

export const StopCharge = (props: IStopChargeProps) => {
  const { handleStopCharge, sessionEnded } = props;
  return (
    <div>
      <IonRow class="ion-justify-content-end" className="ion-padding">
        <IonCol>
          <StopButton
            color="danger"
            expand="block"
            onClick={handleStopCharge}
            disabled={sessionEnded}
          >
            {strings.stopCharging}
          </StopButton>
        </IonCol>
      </IonRow>
    </div>
  );
};

export default StopCharge;
