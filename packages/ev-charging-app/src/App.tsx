import { Redirect, Route } from 'react-router-dom';
import React, { useState } from 'react';

import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import Map from './pages/Map';
import { IonReactRouter } from '@ionic/react-router';
import ChargingSession from './pages/ChargingSession';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

export interface ChargePoint {
  id: string;
  stationName: string;
  formattedAddress?: string;
  img?: string;
  country?: string;
  evses?: any;
}

const App: React.FC = () => {
  const [selectedChargePoint, setSelectedChargePoint] = useState<
    ChargePoint | undefined
  >(undefined);
  const [ocpiToken, setOcpiToken] = useState<string>('');
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/">
            <Redirect to="/map" />
          </Route>
          <Route exact path="/map">
            <Map
              setSelectedChargePoint={setSelectedChargePoint}
              selectedChargePoint={selectedChargePoint}
              setToken={setOcpiToken}
              token={ocpiToken}
            ></Map>
          </Route>
          <Route exact path="/charge">
            <ChargingSession token={ocpiToken} />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};
export default App;
