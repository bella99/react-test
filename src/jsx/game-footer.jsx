import React from 'react';
import {Link} from 'react-router';

import GameUtils from './game-utils';

export default class GameFooter extends React.Component {

    render() {
        return (
            <footer className="game-footer">
                <div className="container">
                    <div className="media">
                        <div className="media-left">

                            <div className="copyright">Powered by</div>
                            <img src="/assets/images/ktplay_logo_2015_withe_font.svg"/>
                            <div className="slogan">You are amazing! Choose your own gaming adventure at KTplay.</div>

                        </div>
                    </div>
                </div>
            </footer>

        );
    }
}

