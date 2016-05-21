/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {Component} from "react";
import {AppRegistry, StyleSheet, Text, View, TouchableHighlight, Image} from "react-native";

class BeerMate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            beerLevel: 0,
            backgroundImage: backgroundImages[5],
            socketState: 'initial'
        };
    }

    componentDidMount() {
        this.socket = new WebSocket('ws://10.0.2.2:2794');
        this.socket.onopen = this.onOpen;
        this.socket.onmessage = this.onMessage;
        this.socket.onclose = this.onClose;
        this.socket.onerror = this.onError;
    }

    render() {
        return (
            <Image source={this.state.backgroundImage} style={styles.container}>
                <Text style={styles.instructions}>
                    Current beer level: {this.state.beerLevel} ({this.state.socketState})
                </Text>
                <TouchableHighlight onPress={this.incrBeerLevel}>
                    <View>
                        <Text>Press me!</Text>
                    </View>
                </TouchableHighlight>
            </Image>
        );
    }

    onOpen = () => {
        this.setState({beerLevel: 1, socketState: 'open'});
    };

    onClose = (event: Event) => {
        this.setState({socketState: 'closed'});
    };

    onError = (event: Event) => {
        this.setState({socketState: 'error'});
    };

    onMessage = (event: Event) => {
        var beerLevel = JSON.parse(event.data).level;
        var imageNo = Math.floor(beerLevel * 6);

        this.setState({
            beerLevel: Math.round(100 * beerLevel),
            backgroundImage: backgroundImages[imageNo]
        });
    };

    incrBeerLevel = () => {
        this.socket.send("Test");
    };
}

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
