import React from 'react';

import GameFooter from './game-footer';
import GameMainHeader from './game-header';

export default class GameRootLayout extends React.Component {
    render() {
        return (
            <div>
                <GameMainHeader />
                {this.props.children}
                <GameFooter />
            </div>
        );
    };
};
