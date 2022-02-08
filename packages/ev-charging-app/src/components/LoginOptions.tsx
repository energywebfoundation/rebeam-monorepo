import React from "react";
import MetaMaskIcon from "../assets/login-icons/metamask-icon.svg";
import { IonButton, IonGrid, IonRow, IonCol, IonImg } from '@ionic/react';
import styled from "styled-components";
import EliaLogo from "../assets/svgs/rebeam-logo.svg";
import strings from "../constants/strings.json";
// import { ProviderType } from "iam-client-lib";
interface LoginOptionsProps {
    loginMethod: () => void;
}

    //STYLED COMPONENTS: 
    const MetaMaskLoginButton = styled(IonButton)`
        --background: white;
        --border-radius: 6px;
        height: 54px;
        margin-bottom: 66px;
    `

    const Container = styled.div`
    height: 100%;
    `

    const Grid = styled(IonGrid)`
        height: 100%;
        display: flex;
        flex-direction: column;
    `

    const LogoRow = styled(IonRow)`
        height: 80%;
    `

    const TitleHeader = styled.div`
    color: white;
    text-align: center;
    font-size: 48px;
    line-height: 58px;
    text-align: center;
    letter-spacing: 0.4px;
    `

    const LogoImg = styled(IonImg)`
    height: 130px;
    `

    const LoginButtonRow = styled(IonRow)`
    height: 100%;
    `

    const MetaMaskLogo = styled(IonImg)`
    height: 38px;
    width: 38px;
    `

    const ConnectHeader = styled.h1`
    font-size: 16px;
    color: #363636;
    margin: 0
    `

const LoginOptions = (props: LoginOptionsProps) => {
    const { loginMethod } = props;


    //METHODS: 
    const handleSelectMetamask = async () => {
        loginMethod();
    }

return (
        <Container>
            <Grid>
                <LogoRow class="ion-align-items-end">
                    <IonCol>
                        <LogoImg src={EliaLogo}>
                        </LogoImg>
                    </IonCol>
                </LogoRow>
                <IonRow >
                    <IonCol class="ion-align-items-center ion-align-self-center">
                        <TitleHeader>
                            {strings.eliaRebeam}
                        </TitleHeader>
                    </IonCol>
                </IonRow>
                <LoginButtonRow class="ion-align-items-end">
                    <IonCol className="login-button">
                        <MetaMaskLoginButton expand="block"
                            onClick={handleSelectMetamask}
                        >
                            <IonGrid>
                                <IonRow>
                                    <IonCol size="2">
                                        <MetaMaskLogo
                                            src={MetaMaskIcon}
                                            alt="MetaMask Logo"
                                        ></MetaMaskLogo>
                                    </IonCol>
                                    <IonCol class="ion-align-self-center">
                                        <ConnectHeader>{strings.connectToMeteMask}</ConnectHeader>
                                    </IonCol>
                                    <IonCol size="2"></IonCol>
                                </IonRow>
                            </IonGrid>
                        </MetaMaskLoginButton>

                    </IonCol>
                </LoginButtonRow>
            </Grid>
        </Container>
    )

}

export default LoginOptions