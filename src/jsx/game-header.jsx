import React from 'react';
import {Link, browserHistory} from 'react-router';

import Language from './language';
import BaseUtils from './base-utils';
import GameUtils from './game-utils';
import {GameDownloadDialog} from './game-dialogs';

class GameTinyHeader extends React.Component {

    constructor(props) {
        super(props);

        this.onDownload = props.onDownload.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
    }

    handleDownload() {
        this.onDownload();
    }

    render() {
        var game = GameUtils.game;

        return (
            <div className="game-header game-tiny-header">
                <div className="background background-color theme_titlebar_background"></div>
                <div className="container theme_titlebar_text rectbox-center-y">
                    <div className="game-summary media media-middle">
                        <div className="media-left"><Link to={GameUtils.getGameUrl()}><img className="icon" src={BaseUtils.getGameIcon(game.icon_url)} /></Link></div>
                        <div className="media-body">
                            <span className="name media-headding">{game.name}</span>
                        </div>
                    </div>
                    <div className="game-download">
                        <button className="download-btn theme_titlebar_background rectbox-center-y" onClick={this.handleDownload}>{Language.getText(202104)}</button>
                    </div>
                </div>
            </div>
        );
    }
}

class GameTopHeader extends React.Component {
    render() {
        var game = GameUtils.game;
        var rightBlock = <div />;
        if(!GameUtils.isLogined)
            rightBlock = (
                <div className="login-bar">
                    <Link to={"/user/login?redirect_url=" + GameUtils.getGameUrl()} className="search-icon theme_main_text pull-right">登录</Link>
                </div>
            )
        else
            rightBlock = (
                <div className="logined-bar dropdown">
                    <div className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img className="avatar img-circle" src={GameUtils.gameUser.head_url} />
                    </div>
                    <ul className="dropdown-menu">
                        <li><a href={"/user/logout?redirect_url=" + GameUtils.getGameUrl()} className="theme_main_text pull-right">登出</a></li>
                    </ul>
                </div>
            );

        return (
            <div className="game-header game-top-header theme_card_background">
                <div className="container theme_main_text rectbox-center-y">
                    <div className="left"><Link to={"/"}><img className="logo-icon" src="/assets/images/ktplay_logo_2015_black_font.svg" /></Link></div>
                    <div className="right">
                        {rightBlock}
                    </div>
                </div>
            </div>
        );
    }
}

export default class GameMainHeader extends React.Component {

    constructor(props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
    }

    handleDownload() {
        this.refs.downloadDialog.showDialog();
    }

    handleScroll() {
        if ($(window).scrollTop() + 10 >= this.refs.mainHeader.offsetHeight) {
            $('.game-tiny-header').show();
        } else {
            $('.game-tiny-header').hide();
        }
    }

    componentDidMount() {
        $(window).bind('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        $(window).unbind('scroll', this.handleScroll);
    }

    render() {
        var game = GameUtils.game;

        return (
            <div>
                <GameTinyHeader onDownload={this.handleDownload} />
                <GameTopHeader />
                <div ref="mainHeader" className="game-header game-main-header">
                    <div className="background background-color theme_titlebar_background"></div>
                    <div className="container theme_titlebar_text rectbox-center-y">
                        <div className="game-summary media media-middle">
                            <div className="media-left"><Link to={"/game/" + game.game_id}><img className="icon img-circle" src={BaseUtils.getGameIcon(game.icon_url)} /></Link></div>
                            <div className="media-body">
                                <span className="name media-headding">{game.name}</span>
                                <p className="counters">{Language.getText(200101)} {BaseUtils.prettifyNumber(game.topic_count)} • {Language.getText(200103)} {BaseUtils.prettifyNumber(game.user_count)}</p>
                            </div>
                        </div>
                        <div className="game-download">
                            <div className="download-btn theme_titlebar_background rectbox-center-y" onClick={this.handleDownload}>{Language.getText(202104)}</div>
                        </div>
                    </div>
                </div>
                <GameDownloadDialog ref="downloadDialog" />
            </div>
        );
    }
}
