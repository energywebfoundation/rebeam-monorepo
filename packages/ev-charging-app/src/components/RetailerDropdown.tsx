import {
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonRow,
  IonCol,
  IonLabel,
  IonList,
  IonImg,
  IonGrid,
} from '@ionic/react';
import { ReactChild, ReactFragment, ReactPortal, useRef } from 'react';
import { Provider } from './ChargeDetailModal';
import strings from '../constants/strings.json';
import styled from 'styled-components';
import Selected from '../assets/svgs/selected-icon.svg';
import supplierIcon from '../assets/svgs/supplier-icon.svg';

interface RetailerDropdownProps {
  retailers: any;
  loadingRetailers: boolean;
  selectedProvider?: Provider;
  setSelectedProvider?: any;
}

const SelectSupplierHeader = styled.p`
  font-size: 16px;
  line-height: 19px;
  margin: 0;
  padding: 0px;
  color: #363636; ;
`;

const SelectSupplierSubHeader = styled.p`
  font-size: 16px;
  line-height: 19px;
  margin: 0;
  color: #363636;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const SupplierItem = styled(IonItem)`
  --inner-padding-bottom: 10px;
  --inner-padding-top: 10px;
`;
const RetailerLabel = styled(IonLabel)`
  margin: 2px;
  padding: 5px 5px 5px 10px;
`;

const RetailerLogoImg = styled(IonImg)`
  height: 20px;
`;

const RetailerDropdown: React.FC<RetailerDropdownProps> = (
  props: RetailerDropdownProps
) => {
  const { retailers, setSelectedProvider, selectedProvider } = props;
  const accordionGroupRef = useRef(null);
  const handleSelectProvider = (provider: any) => {
    setSelectedProvider(provider);
  };

  return (
    <div className="ion-padding ion-text-center">
      <IonAccordionGroup value="retailers" ref={accordionGroupRef}>
        <IonAccordion value="providers">
          <IonItem slot="header">
            <IonGrid>
              <IonRow>
                <IonCol class="ion-align-self-center" size="2">
                  <IonImg src={supplierIcon}></IonImg>
                </IonCol>
                <IonCol>
                  <IonGrid>
                    <IonRow>
                      <IonCol>
                        <SelectSupplierHeader>
                          {selectedProvider
                            ? selectedProvider.name
                            : strings.selectSupplier}
                        </SelectSupplierHeader>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <SelectSupplierSubHeader>
                          {strings.supplier}
                        </SelectSupplierSubHeader>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>
          <IonList slot="content">
            {retailers?.map(
              (
                retailer: {
                  id: { toString: () => string | undefined };
                  logo: string | undefined;
                  name:
                    | boolean
                    | ReactChild
                    | ReactFragment
                    | ReactPortal
                    | null
                    | undefined;
                },
                index: number
              ) => {
                const isSelected = retailer?.name === selectedProvider?.name;
                return (
                  <SupplierItem
                    key={index}
                    onClick={() => handleSelectProvider(retailer)}
                  >
                    {retailer.logo && (
                      <RetailerLogoImg src={retailer.logo}></RetailerLogoImg>
                    )}
                    <RetailerLabel className="ion-padding">
                      {retailer.name}
                    </RetailerLabel>
                    {isSelected && <IonImg src={Selected}></IonImg>}
                  </SupplierItem>
                );
              }
            )}
          </IonList>
        </IonAccordion>
      </IonAccordionGroup>
    </div>
  );
};

export default RetailerDropdown;
