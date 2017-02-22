import React from 'react';

import GameImageListPanel from './game-image-list-panel';
import GameVideoListPanel from './game-video-list-panel';

export default class GameMultiColumnLayout extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="game-multi-column-layout row">
                    <div className="col-md-8 multi-column-layout-left">
                        {this.props.children}
                    </div>
                    <div className="col-md-4 multi-column-layout-right">
                        <GameVideoListPanel />
                        <GameImageListPanel />
                    </div>
                </div>
            </div>
        );
    };
};
