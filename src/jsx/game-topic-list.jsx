import _ from 'lodash';
import React from 'react';
import {Link, browserHistory} from 'react-router';

import Language from './language';
import BaseUtils from './base-utils';
import GameUtils from './game-utils';

function VideoBlock(props) {
    var image_url = props.image_url;

    return (
        <div className="video-block rectbox-video">
            <span className="video-cover"></span>
            <img src={BaseUtils.getThumbnailImageUrl(image_url)} />
            <i className="glyphicon glyphicon-play control"></i>
        </div>
    );
}

function ImageBlock(props) {
    var image_url = props.image_url;

    return (
        <div className="image-block rectbox-image">
            <img src={BaseUtils.getThumbnailImageUrl(image_url)} />
        </div>
    );
}

class Topic extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            topic: props.topic
        };
        this.textRender = props.textRender;
        this.goTopic = this.goTopic.bind(this);
    }

    goTopic() {
        var topic_id = this.state.topic.topic_id;

        browserHistory.push(GameUtils.getGameUrl("topic/" + topic_id));
    }

    render() {
        var topic = this.state.topic;
        var mediaStyle = topic.style || 0;
        var image_url = (topic.images && topic.images.length > 0)? topic.images[0].url: "";

        var topicMedia = <div />;
        if(mediaStyle == 2)
            topicMedia = <VideoBlock image_url ={image_url} />
        else if(image_url)
        topicMedia = <ImageBlock image_url ={image_url} />;

        var titleBlock = <div />;
        if(topic.title) {
            if(!this.textRender)
                titleBlock = <div className="title linebox-text-one">{topic.title}</div>;
            else
                titleBlock = <div className="title linebox-text-one" dangerouslySetInnerHTML={{__html: this.textRender(topic.title)}} />;
        }

        var contentBlock = <div />;
        if(topic.content) {
            if(!this.textRender)
                contentBlock =  <div className="content linebox-text-one theme_secondary_text">{topic.content}</div>;
            else
                contentBlock =  <div className="content linebox-text-one theme_secondary_text" dangerouslySetInnerHTML={{__html: this.textRender(topic.content)}} />;
        }

        var likesBlock = <div />;
        if(topic.liked_users.length > 0) {
            likesBlock = (
                <div className="like-images">
                    {
                        topic.liked_users.map((item)=>{
                            return(
                                <img key={"topic-" + topic.topic_id + "-liker-" +　item.user_id} className="img-circle" src={BaseUtils.getAvatar(item.head_url)} />
                            )
                        })
                    }
                </div>
            );
        }

        var replyBlock = <div />;
        var recent_replies = (topic.recent_replies || []).slice(0, 2);
        if(recent_replies.length > 0) {
            replyBlock = (
                <div className="topic-replies theme_secondary_card_background theme_background_line">
                    {
                        recent_replies.map((item)=>{
                            return (
                                <div key={item.reply_id} className="topic-reply">
                                    <div className="name theme_secondary_text linebox-text-one">
                                        {item.creator.nickname}
                                    </div>
                                    <div className="content linebox-text-one">
                                        {GameUtils.getTopicLikeText(item)}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            );
        }

        return (
            <div className="topic media" onClick={this.goTopic}>
                <div className="topic-left media-left">
                    <img className="avatar img-circle" src={BaseUtils.getAvatar(topic.creator.head_url)} />
                </div>
                <div className="topic-right media-body theme_card_background theme_background_line">
                    <div className="topic-body">
                        <div className="topic-info" onClick={this.goTopic}>
                            {titleBlock}
                            {contentBlock}
                            <div className="fields">
                                {likesBlock}
                                <div className="texts theme_hint_text">
                                    {Language.getText(202001)} {BaseUtils.prettifyNumber(topic.like_count)} • {Language.getText(202003)} {BaseUtils.prettifyNumber(topic.favorite_count)} • {Language.getText(202002)} {BaseUtils.prettifyNumber(topic.reply_count)} • {BaseUtils.prettifyDate(topic.modify_time || topic.create_time)}
                                </div>
                            </div>
                        </div>
                        <div className="topic-media">
                            {topicMedia}
                        </div>
                    </div>
                    {replyBlock}
                </div>
            </div>
        );
    }
}

export class GameTopicList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            topics: props.topics
        };
    }

    render() {
        var topics = this.state.topics;

        return (
            <div className="game-topic-list">
                {
                    topics.map((topic) => {
                        return <Topic key={topic.topic_id} topic={topic}/>
                    })
                }
            </div>
        );
    }
}

export class GameDynamicTopicList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            topics: []
        };

        this.textRender = props.textRender;
        this.queryMoreTopics = props.queryMoreTopics;
        this.queryResetTopics = props.queryResetTopics;
        this.handleQueryCompleted = this.handleQueryCompleted.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
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
            this.queryMoreTopics(this.handleQueryCompleted);
        }
    }

    handleScroll() {
        if (window.innerHeight + window.scrollY >= this.refs.topicList.offsetHeight) {
            this.queryMoreTopics(this.handleQueryCompleted);
        }
    }

    componentDidMount() {
        $(window).bind('scroll', this.handleScroll);
        this.queryMoreTopics(this.handleQueryCompleted);
    }

    componentWillUnmount() {
        $(window).unbind('scroll', this.handleScroll);
    }

    componentWillReceiveProps(nextProps) {
        window.scrollTo(0, 0);
        this.setState({
            topics: []
        });
        this.queryResetTopics(this.handleQueryCompleted);
    }

    render() {
        return (
            <div ref="topicList" className="game-topic-list">
                {
                    this.state.topics.map((topic) => {
                        return (
                            <Topic key={topic.topic_id} topic={topic} textRender={this.textRender}/>
                        )
                    })
                }
            </div>
        );
    }
}
