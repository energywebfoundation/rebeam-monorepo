import React from "react";
import { IonContent, IonAccordionGroup, IonAccordion, IonIcon, IonItem, IonRow, IonCol, IonLabel, IonList, IonPage, IonImg, IonGrid } from '@ionic/react';

interface ColumnProps  {
    children: JSX.Element;
    size?: string;
    rowStyle?: string;
    colStule?: string;
}
export const Column = (props: ColumnProps) => {
    return (
        <React.Fragment>
                <IonRow>
                    <IonCol>
                        {props.children}
                    </IonCol>
                </IonRow>
        </React.Fragment>

    )
}

export default Column;