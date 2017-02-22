import _ from 'lodash';
import React from 'react';
import {browserHistory} from 'react-router';

import Language from './language';
import DataStore from './data-store';
import BaseUtils from './base-utils';
import GameUtils from './game-utils';
import GameTopicActionBar from './game-topic-action-bar';

class VideoItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            topic: props.topic
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        var id = this.state.topic.topic_id;
        browserHistory.push(GameUtils.getGameUrl("topic/" + id));
    }

    render() {
        var topic = this.state.topic;
        var image_url = (topic.images && topic.images.length > 0)? topic.images[0].url: "";

        return (
            <div className="video-item" onClick={this.onClick}>
                <div className="video rectbox-video rectbox-covered">
                    <span className="video-cover"></span>
                    <img src={BaseUtils.getThumbnailImageUrl(image_url)} />
                    <i className="glyphicon glyphicon-play control"></i>
                    <div className="cover">
                    </div>
                </div>
                <div className="summary">
                    <div className="creator linebox-one">
                        <img className="avatar img-circle" src={BaseUtils.getAvatar(topic.creator.head_url)} />
                        <span className="name theme_main_text">{topic.creator.nickname}</span>
                    </div>
                    <div className="info theme_hint_text">
                        {Language.getText(202001)} {BaseUtils.prettifyNumber(topic.like_count, {s: 1})} • {Language.getText(202002)} {BaseUtils.prettifyNumber(topic.reply_count, {s: 1})}
                    </div>
                </div>
            </div>
        );
    }
}

export default class GameVideosPage extends React.Component {
    constructor(props) {
        super(props);

        this.store = DataStore.createItem("video-page-otype");

        this.state = {
            otype: this.store.getValueAsInt(6),
            topics: []
        };
        this.querier = {
            ended: 0,
            cursor: 0
        };
        this.serverRequest = null;

        this.handleScroll = this.handleScroll.bind(this);
        this.queryMoreTopics = this.queryMoreTopics.bind(this);
        this.handleQueryCompleted = this.handleQueryCompleted.bind(this);
        this.handleChangeOType = this.handleChangeOType.bind(this);
    }

    queryMoreTopics() {
        if(this.serverRequest || this.querier.ended) {
            this.handleQueryCompleted(false, []);
        }
        else {
            var queryCount = 30;
            this.serverRequest = $.get("/api/topic/list", {
                game_id: GameUtils.game_id,
                category: 0,
                type: 3,
                otype: this.state.otype,
                cursor: this.querier.cursor,
                count: queryCount
            }, function (result) {
                this.serverRequest = null;

                var topics = [];
                var uglied = false;
                if (result.errno)
                    console.error(result.message);
                else {
                    var data = result.data;
                    this.querier = {
                        ended: data.ended,
                        cursor: data.cursor + data.count
                    };
                    topics = data.topics;
                    uglied = data.topics.length < queryCount;
                }
                this.handleQueryCompleted(uglied, topics);
            }.bind(this));
        }
    }

    handleQueryCompleted(uglied, topics) {
        if(topics.length > 0) {
            var appends = topics.filter((topic) => {
                return !_.find(this.state.topics, (row) => {
                    return row.topic_id == topic.topic_id;
                });
            });
            if(appends.length > 0) {
                this.setState({
                    topics: this.state.topics.concat(appends)
                });
            }
            if(!uglied) {
                uglied = appends.length != topics.length;
            }
        }
        if(uglied) {
            this.queryMoreTopics();
        }
    }

    handleScroll() {
        if (window.innerHeight + window.scrollY >= this.refs.topicList.offsetHeight) {
            this.queryMoreTopics();
        }
    }

    componentDidMount() {
        $(window).bind('scroll', this.handleScroll);
        this.queryMoreTopics();
    }

    componentWillUnmount() {
        if(this.serverRequest)
            this.serverRequest.abort();
        $(window).unbind('scroll', this.handleScroll);
    }

    handleChangeOType(otype) {
        this.setState({
            otype: otype,
            topics: []
        });
        this.querier = {
            ended: 0,
            cursor: 0
        };
        this.queryMoreTopics();
        this.store.setValue(otype);
    }

    render() {
        return (
            <div className="container">
                <div className="game-videos-page">
                    <div className="top-bar">
                        <span className="title theme_secondary_text">{Language.getText(200105)}</span>
                    </div>

                    <GameTopicActionBar theme="otype"
                                    otype={this.state.otype}
                                    onChangeOType={this.handleChangeOType}/>
                    <div ref="topicList" className="video-list center-block theme_card_background">
                        {
                            this.state.topics.map((topic) => {
                                return <VideoItem key={"topic-" + topic.topic_id} topic={topic} />
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}
