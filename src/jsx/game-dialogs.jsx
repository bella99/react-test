import React from 'react';

import Language from './language';
import BaseUtils from './base-utils';
import GameUtils from './game-utils';

export class GameDownloadDialog extends React.Component {

    constructor(props) {
        super(props);

        this.showDialog = this.showDialog.bind(this);
    }

    componentDidMount() {
        $(this.refs.dialog).appendTo('body');
        $('#game-download-qrcode').qrcode({
            text: GameUtils.getGameFullUrl("download")
        });
    }

    componentWillUnmount() {
        $(this.refs.dialog).remove();
    }

    showDialog() {
        $(this.refs.dialog).modal('show');
    }

    render() {
        var game = GameUtils.game;

        var iconAppstore = <div />;
        var iconGooglePlay = <div />;

        var download_url = game.download_url || '';
        if(download_url.indexOf('itunes.apple.com') != -1) {
            iconAppstore = (
                <div className="icon">
                    <a href={download_url}><img src="/assets/images/download-appstore.png" /></a>
                </div>
            );
        }
        else if(download_url.indexOf('play.google.com') != -1) {
            iconGooglePlay = (
                <div className="icon">
                    <a href={download_url}><img src="/assets/images/download-googleplay.png" /></a>
                </div>
            );
        }

        return (
            <div ref="dialog" className="game-download-dialog modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-sm" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="header theme_titlebar_background theme_titlebar_text">
                                <span className="close-btn pull-right" data-dismiss="modal"><span className="glyphicon glyphicon-remove"></span></span>
                                <img className="icon img-circle rectbox-center-x" src={BaseUtils.getGameIcon(game.icon_url)} />
                            </div>
                            <div className="body theme_card_background theme_secondary_text">
                                <div className="title">{Language.getText(202105)}</div>
                                {iconAppstore}
                                {iconGooglePlay}
                                <div className="qrtitle">{Language.getText(202106)}</div>
                                <div className="icon">
                                    <div id="game-download-qrcode" className="qrcode" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
