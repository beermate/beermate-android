'use strict';

import React, {Component} from "react";
import {AppRegistry, StyleSheet, Text, View, TouchableHighlight, Image} from "react-native";
import LiterCounter from './LiterCounter';
import BloodAlcoholCounter from './BloodAlcoholCounter';

class BeerMate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            beerLevel: 0,
            backgroundImage: backgroundImages[5],
            socketState: CLOSED
        };
        this.bloodAlcoholCounter = new BloodAlcoholCounter(80, 'male', 0.031);
        this.literCounter = new LiterCounter(this.bloodAlcoholCounter);
    }

    render() {
        return (
            <Image source={this.state.backgroundImage} style={styles.container}>
                <Text style={styles.instructions}>
                    Current beer level: {this.state.beerLevel} ({this.state.socketState})
                    {Math.round(10 * this.literCounter.getLiterCount())/10} L
                    {Math.round(10000 * this.bloodAlcoholCounter.getBloodAlcohol())/10} ‰
                </Text>
                <TouchableHighlight onPress={this.toggleConnection}>
                    <View>
                        <Text>{OPEN === this.state.socketState || OPENING === this.state.socketState? 'Disconnect' : 'Connect'}</Text>
                    </View>
                </TouchableHighlight>
            </Image>
        );
    }

    onOpen = () => {
        this.setState({socketState: OPEN});
    };

    onClose = (event: Event) => {
        this.setState({socketState: CLOSED});
    };

    onError = (event: Event) => {
        this.setState({socketState: CLOSED});
    };

    onMessage = (event: Event) => {
        var beerLevel = Math.max(Math.min(parseFloat(JSON.parse(event.data).level), 1), 0);
        var imageNo = Math.min(Math.floor(beerLevel * 6), 5);

        console.log('Received event with level ' + beerLevel + ', image no: ' + imageNo);

        this.literCounter.pushLevel(beerLevel);

        this.setState({
            beerLevel: Math.round(100 * beerLevel),
            backgroundImage: backgroundImages[imageNo]
        });
    };

    toggleConnection = () => {
        if (OPEN === this.state.socketState) {
            this.socket.close();
            this.socket.onopen = null;
            this.socket.onmessage = null;
            this.socket.onclose = null;
            this.socket.onerror = null;
            this.setState({socketState: CLOSED});

            return;
        }

        if (CLOSED === this.state.socketState) {
            this.socket = new WebSocket('ws://' + SERVER_ADDRESS + ':' + SERVER_PORT);
            this.socket.onopen = this.onOpen;
            this.socket.onmessage = this.onMessage;
            this.socket.onclose = this.onClose;
            this.socket.onerror = this.onError;
            this.setState({socketState: OPENING});
        }
    };
}

const SERVER_ADDRESS = '192.168.0.173';
const TEST_SERVER_ADDRESS = '10.0.2.2';
const SERVER_PORT = '2794';

const CLOSED = 0;
const OPEN = 1;
const OPENING = 2;

const backgroundImages = [
    require('./img/beer-1.png'),
    require('./img/beer-2.png'),
    require('./img/beer-3.png'),
    require('./img/beer-4.png'),
    require('./img/beer-5.png'),
    require('./img/beer-6.png')
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        width: null,
        height: null,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

AppRegistry.registerComponent('BeerMate', () => BeerMate);
