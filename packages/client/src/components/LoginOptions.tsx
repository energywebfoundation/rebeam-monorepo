import React from "react";
import MetaMaskIcon from "../assets/login-icons/metamask-icon.svg";
import { IonButton, IonGrid, IonRow, IonCol, IonImg } from '@ionic/react';
import styled from "styled-components";
import EliaLogo from "../assets/svgs/rebeam-logo.svg";
import strings from "../constants/strings.json";
import "./login-options.css"
// import { ProviderType } from "iam-client-lib";
interface LoginOptionsProps {
    loginMethod: any
}


const LoginOptions = (props: LoginOptionsProps) => {
    const { loginMethod } = props;


    //METHODS: 
    const handleSelectMetamask = async () => {
        console.log("selected Metamask")
        loginMethod();
    }



    //STYLED COMPONENTS: 
    const MetaMaskLoginButton = styled(IonButton)`
        --background: white;
        --border-radius: 6px;
        height: 54px;
    `

    const Container = styled.div`
    height: 100%;
    border: 1px solid white;
    `

    const Grid = styled(IonGrid)`
        border: 10px solid orange;
        height: 100%;
        display: flex;
        flex-direction: column;
    `

    const LogoRow = styled(IonRow)`
        border: 3px solid green;
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
    border: 5px solid white;
    height: 100%;
    `

    const MetaMaskLogo = styled(IonImg)`
    height: 38px;
    width: 38px;
    border: 1px solid red;
    `

    const ConnectHeader = styled.h1`
    font-size: 16px;
    color: #363636;
    border: 1px solid green;
    margin: 0
    `


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
                    <IonCol className="login-button" style={{
                        border: "4px solid yellow",
                    }}>
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