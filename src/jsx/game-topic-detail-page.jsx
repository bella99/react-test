import _ from 'lodash';
import React from 'react';
import {browserHistory} from 'react-router';

import Language from './language';
import BaseUtils from './base-utils';
import GameUtils from './game-utils';
import {ImagesBlock} from './images-block';
import AutoplayVideo from './autoplay-video';
import GameTopicVoteBlock from './game-topic-vote-block';

class AnswerList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            reply: props.reply,
            answers: []
        };
        this.serverRequest = null;
    }

    componentDidMount() {
        if( this.state.reply.answer_count < 1)
            return;

        this.serverRequest = $.get("/api/replyanswer/list", {
            reply_id: this.state.reply.reply_id,
            cursor: 0,
            count: 100
        }, function (result) {
            this.serverRequest = null;

            if (result.errno)
                console.error(result.message);
            else {
                this.setState({
                    answers: result.data.answers
                });
            }
        }.bind(this));
    }

    componentWillUnmount() {
        if(this.serverRequest)
            this.serverRequest.abort();
    }

    render() {
        return (
            <div className="replyanswer-list">
                {
                    this.state.answers.map((answer) => {
                        return (
                            <div key={"answer-" + answer.reply_answer_id} className="replyanswer-item theme_background_line">
                                <div className="media">
                                    <div className="media-left">
                                        <img className="avatar img-circle" src={BaseUtils.getAvatar(answer.creator.head_url)} />
                                    </div>
                                    <div className="media-body">
                                        <div className="name media-heading theme_hint_text">
                                            {answer.creator.nickname}
                                            <span className="pull-right time">{BaseUtils.prettifyDate(answer.create_time)}</span>
                                        </div>
                                        <div className="content-body">
                                            <pre><code>{answer.content}</code></pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}

class ReplyItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            reply: props.reply
        };
    }

    render() {
        var reply = this.state.reply;

        return (
            <div className="reply-item">
                <div className="media">
                    <div className="media-left">
                        <img className="avatar img-circle" src={BaseUtils.getAvatar(reply.creator.head_url)} />
                    </div>
                    <div className="media-body theme_background_line_bottom">
                        <div className="name media-heading theme_hint_text">
                            {reply.creator.nickname}
                            <span className="pull-right time">{BaseUtils.prettifyDate(reply.create_time)}</span>
                        </div>
                        <div className="content-body">
                            <pre><code>{reply.content}</code></pre>
                        </div>
                        <ImagesBlock images={reply.images}  />
                        <div className="counters theme_hint_text">
                            <span>{Language.getText(202001)} {BaseUtils.prettifyNumber(reply.like_count)} • {Language.getText(202002)} {BaseUtils.prettifyNumber(reply.answer_count)}</span>
                        </div>
                        <AnswerList reply={reply} />
                    </div>
                </div>
            </div>
        );
    }
}

class ReplyList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            topic: props.topic,
            replies: []
        };
        this.querier = {
            ended: 0,
            cursor: 0
        };
        this.serverRequest = null;
        this.handleScroll = this.handleScroll.bind(this);
        this.queryMoreReplies = this.queryMoreReplies.bind(this);
        this.handleQueryCompleted = this.handleQueryCompleted.bind(this);
    }

    queryMoreReplies() {
        if(this.serverRequest || this.querier.ended) {
            this.handleQueryCompleted(false, []);
        }
        else {
            var queryCount = 30;
            this.serverRequest = $.get("/api/reply/list", {
                topic_id: this.state.topic.topic_id,
                cursor: this.querier.cursor,
                count: queryCount
            }, function (result) {
                this.serverRequest = null;

                var replies = [];
                var uglied = false;
                if (result.errno)
                    console.error(result.message);
                else {
                    var data = result.data;
                    this.querier = {
                        ended: data.ended,
                        cursor: data.cursor + data.count
                    };
                    replies = data.replies;
                    uglied = data.replies.length < queryCount;
                }
                this.handleQueryCompleted(uglied, replies);
            }.bind(this));
        }
    }

    handleQueryCompleted(uglied, replies) {
        if(replies.length > 0) {
            var appends = replies.filter((reply) => {
                return !_.find(this.state.replies, (row) => {
                    return row.reply_id == reply.reply_id;
                });
            });
            if(appends.length > 0) {
                this.setState({
                    replies: this.state.replies.concat(appends)
                });
            }
            if(!uglied) {
                uglied = appends.length != replies.length;
            }
        }
        if(uglied) {
            this.queryMoreReplies();
        }
    }

    handleScroll() {
        if (window.innerHeight + window.scrollY >= this.refs.replyList.offsetHeight) {
            this.queryMoreReplies();
        }
    }

    componentDidMount() {
        $(window).bind('scroll', this.handleScroll);
        this.queryMoreReplies();
    }

    componentWillUnmount() {
        if(this.serverRequest)
            this.serverRequest.abort();
        $(window).unbind('scroll', this.handleScroll);
    }

    componentWillReceiveProps(props) {
        this.querier = {
            ended: 0,
            cursor: 0
        };
        this.setState({
            topic: props.topic,
            replies: []
        }, () => {
            this.queryMoreReplies();
        });
    }

    render() {
        return (
            <div ref="replyList" className="topic-detal-reply-list theme_background_line">
                {
                    this.state.replies.map((reply) => {
                        return <ReplyItem key={reply.reply_id} reply={reply} />
                    })
                }
            </div>
        );
    }
}

export default class TopicDetail extends React.Component {
    constructor(props) {
        super(props);

        this.status = {
            topic_id: props.params.topic_id
        }
        this.state = {
            topic: null
        };
    }

    updateTopic() {
        if(this.serverRequest)
            this.serverRequest.abort();

        this.serverRequest = $.get("/api/topic/detail", {
            game_id: GameUtils.game_id,
            topic_id: this.status.topic_id
        }, function (result) {
            this.serverRequest = null;

            if (result.errno)
                console.error(result.message);
            else {
                this.setState({
                    topic: result.data
                });
            }
        }.bind(this));
    }

    componentWillReceiveProps(props) {
        window.scrollTo(0, 0);
        this.status = {
            topic_id: props.params.topic_id
        }
        this.setState({
            topic: null
        }, () => {
            this.updateTopic();
        });
    }

    componentDidMount() {
        this.updateTopic();
        window.scrollTo(0, 0);
    }

    componentWillUnmount() {
        if(this.serverRequest)
            this.serverRequest.abort();
    }

    render() {
        if (!this.state.topic)
            return <div />;

        var topic = this.state.topic;
        var mediaStyle = topic.style || 0;
        var detailVideoBlock, detailImageBlock, detailVoteBlock;
        if(mediaStyle == 2)
            detailVideoBlock = <AutoplayVideo topic={topic}/>;
        else {
            if(mediaStyle == 1)
                detailVoteBlock = <GameTopicVoteBlock votes={topic.vote_data}/>;
            if(topic.images && topic.images.length > 0)
                detailImageBlock = <ImagesBlock images={topic.images} />;
        }
        topic.liked_users = topic.liked_users.slice(0, topic.like_count);

        var roleText = '';
        if(topic.creator.official > 0)
            roleText = Language.getText(200106);
        else if(topic.creator.role > 0)
            roleText = Language.getText(200107);

        return (
            <div className="game-topic-detail-page theme_card_background">


                {detailVideoBlock}
                <div className="detail-head">
                    <div className="media detail-user">
                        <div className="media-left detail-user-left">
                            <img src={BaseUtils.getAvatar(topic.creator.head_url)} className="avatar img-circle" />
                        </div>
                        <div className="media-body detail-user-body">
                            <span className="name theme_highlighted_item">{topic.creator.nickname}</span>
                            <span className="role label theme_titlebar_background">{roleText}</span>
                            <div className="theme_hint_text time">{BaseUtils.prettifyDate(topic.create_time)} • {GameUtils.getCategoryName(topic.category)}</div>
                        </div>
                    </div>
                </div>

                <div className="detail-body">
                    <div className="content-title theme_main_text">{topic.title}</div>
                    <div className="content-body theme_secondary_text">
                        <pre><code>{topic.content}</code></pre>
                    </div>
                    {detailImageBlock}
                    {detailVoteBlock}
                </div>

                <div className="detail-footer theme_background_line_bottom ">
                    <div className="like-count theme_hint_text">{Language.getText(202001)} {topic.like_count}</div>
                    <div className="like-images">
                        {
                            topic.liked_users.map((item)=>{
                                return(
                                    <img key={"liker-" +　item.user_id} className="img-circle" src={BaseUtils.getAvatar(item.head_url)} />
                                )
                            })
                        }
                    </div>
                </div>

                <div className="detail-replies theme_secondary_card_background">
                    <div className="counters theme_hint_text ">
                        <span>{Language.getText(202003)} {BaseUtils.prettifyNumber(topic.favorite_count)} • {Language.getText(202002)} {BaseUtils.prettifyNumber(topic.reply_count)}</span>
                    </div>
                    <ReplyList topic={topic}/>
                </div>
            </div>
        );
    };
};
