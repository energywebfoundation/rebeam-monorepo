import React from 'react';
import { IonGrid, IonRow, IonCol, IonProgressBar } from '@ionic/react';

const ChargeAuthorized = () => {
  return (
    <>
      <IonGrid>
        <IonRow>
          <IonCol>
            {'Charge Authorized. Your charging session will begin momentarily'}
          </IonCol>
        </IonRow>
        <IonRow>
          <IonProgressBar type="indeterminate"></IonProgressBar>
          <br />
        </IonRow>
      </IonGrid>
    </>
  );
};

export default ChargeAuthorized;
