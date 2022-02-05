import { Redirect, Route, RouteComponentProps } from 'react-router-dom';
import React, { useRef, useState, useEffect } from "react";

import {
  IonApp,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonPage,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import Map from "./components/Map";
import Login from "./pages/Login";
import ChargePointDetail from './pages/ChargePointDetail';
import { IonReactRouter } from '@ionic/react-router';
import ChargingSession from "./pages/ChargingSession";

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

const App: React.FC = () => {
  const [selectedChargePoint, setSelectedChargePoint] = useState<{
    id: number;
    stationName: "string"
  }>()
  // const dismissSelectedChargePoint = () => {
  //   setSelectedChargePoint(undefined)
  // }
  const [did, setDid] = useState<string>("")
  console.log(did, "THE DID IS SET")
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route
            exact path="/login"
            render={() => {
              if (did) {
                return <Redirect to="/map"/>
              }
              return <Login setDid={setDid} />;
            }}
          >
          </Route>
          <Route exact path="/map">
            <Map setSelectedChargePoint={setSelectedChargePoint} selectedChargePoint={selectedChargePoint}></Map>
          </Route>
          <Route
            exact path="/detail/:id"
            render={(props) => {
              if (!selectedChargePoint) {
                return <Redirect to="/map"/>
              }
              return  <ChargePointDetail {...props} chargePoint={selectedChargePoint}/>
            }}
          >
          </Route>
          <Route exact path="/charge">
            <ChargingSession />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
};
// docs on Ionic Router: https://ionicframework.com/docs/react/navigation
export default App;
