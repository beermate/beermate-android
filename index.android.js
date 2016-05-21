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
            beerLevel: 0
        };
    }

    componentDidMount() {
        this.socket = new WebSocket('ws://10.0.2.2:2794');
        this.socket.onopen = this.onOpen;
        this.socket.onmessage = this.onMessage;
    }

    render() {
        return (
            <Image source={require('./img/full.png')} style={styles.container}>
                <Text style={styles.instructions}>
                    Current beer level: {this.state.beerLevel}
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
        this.setState({beerLevel: 1});
    };

    onMessage = (event: Event) => {
        var level = JSON.parse(event.data).level;

        this.setState({beerLevel: Math.round(level * 100)});
    };

    incrBeerLevel = () => {
        this.socket.send("Test");
    };
}

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
