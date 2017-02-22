import _ from 'lodash';
import React from 'react';
import {Link, browserHistory} from 'react-router';

import Language from './language';
import BaseUtils from './base-utils';
import GameUtils from './game-utils';

class VideoItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            topic: props.topic
        };
        this.goTopic = this.goTopic.bind(this);
    }

    goTopic() {
        browserHistory.push(GameUtils.getGameUrl("topic/" + this.state.topic.topic_id));
    }

    render() {
        var topic = this.state.topic;

        var image_url = topic.images.length > 0? topic.images[0].url : '';
        return (
            <div className="video-item" onClick={this.goTopic}>
                <div className="video rectbox-video">
                    <span className="video-cover"></span>
                    <img src={BaseUtils.getThumbnailImageUrl(image_url)} />
                    <i className="glyphicon glyphicon-play control"></i>
                </div>
                <div className="video-title linebox-text-two">{topic.title || topic.content}</div>
                <div className="counters theme_hint_text">{Language.getText(202004)} {BaseUtils.prettifyNumber(topic.view_count, {s: 1})} • {Language.getText(202001)} {BaseUtils.prettifyNumber(topic.like_count, {s: 1})}</div>
            </div>
        );
    }
}

export default class GameVideoListPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            total: 0,
            topics: []
        };
    }

    componentDidMount() {
        this.serverRequest = $.get("/api/video/summary", {
            game_id: GameUtils.game_id
        }, function (result) {
            if (result.errno)
                console.error(result.message);
            else {
                this.setState({
                    topics: result.data.topics
                });
            }
        }.bind(this));
    }

    componentWillUnmount() {
        this.serverRequest.abort();
    }

    render() {
        if(this.state.topics.length < 1)
            return <div />;

        var topics =  _.take(_.shuffle(this.state.topics), 2);
        return (
            <div className="game-panel game-panel-fat game-panel-more game-video-list-panel panel theme_card_background">
                <div className="panel-heading theme_main_text"><span className="color-block theme_panel_videos"></span>{Language.getText(201005)} <Link to={GameUtils.getGameUrl('videos')} className="more pull-right theme_secondary_text">{Language.getText(201007)}</Link></div>
                <div className="panel-body">
                    {
                        topics.map((topic) => {
                            return <VideoItem key={topic.topic_id} topic={topic} />;
                        })
                    }
                </div>
            </div>
        );
    };
};
