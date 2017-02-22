import React from 'react';
import {browserHistory} from 'react-router';

import Language from './language';
import BaseUtils from './base-utils';
import GameUtils from './game-utils';

export class GameInfluenceTopPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: props.users
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            users: props.users
        });
    }

    render() {
        if(this.state.users.length < 1)
            return <div></div>;

        var first = this.state.users[0];
        var others = this.state.users.slice(1, 5);
        var hasInfluence=first.length==0?'hide':'';
        return (
            <div className={"game-panel game-influence-top-panel panel theme_main_background "+hasInfluence}>
                <div className="panel-heading theme_main_text"><span className="color-block theme_panel_influencer_rank"></span>{Language.getText(201001)}</div>
                <div className="panel-body">
                    <div className="first-user">
                        <span className="sort-one">1</span>
                        <img alt="" className="avatar img-circle" src={BaseUtils.getAvatar(first.head_url)}/>
                        <p><span className="name theme_secondary_text">{first.nickname}</span></p>
                        <p><span className="score theme_main_text">{BaseUtils.prettifyNumber(first.influence.score)}</span></p>
                    </div>
                    <ul className="other-user media-list">
                        {
                            others.map((user,index) => {
                                return (
                                    <li key={"user-" + user.user_id} className="media media-middle">
                                        <div className="media-left">
                                            <span className={"sort-one sort-small sort-"+index}>{index+2}</span>
                                            <img alt="" className="avatar img-circle" src={BaseUtils.getAvatar(user.head_url)} />
                                        </div>
                                        <div className="media-body">
                                            <span className="name theme_secondary_text">{user.nickname}</span>
                                            <p><span className="score theme_main_text">{BaseUtils.prettifyNumber(user.influence.score)}</span></p>
                                        </div>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export class GameCollectionPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            collections: props.collections
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            collections: props.collections
        });
    }

    goCollection(collection_id) {
        browserHistory.push(GameUtils.getGameUrl("collection/" + collection_id));
    }

    render() {
        if(this.state.collections.length < 1)
            return <div></div>;
        var hasCollections=this.state.collections.length==0?'hide':'';
        return (
            <div className={"game-panel game-collection-panel panel theme_main_background "+hasCollections}>
                <div className="panel-heading theme_main_text"><span className="color-block theme_panel_collections"></span>{Language.getText(201002)}</div>
                <div className="panel-body">
                    <div className="list-group">
                        {
                            this.state.collections.map((row) => {
                                return (
                                    <div key={"collection-" + row.collection_id} className="collection-item list-group-item theme_main_background" onClick={this.goCollection.bind(this, row.collection_id)}>
                                        <img alt="" className="cover" src={row.icon_url}/>
                                        <p><span className="title linebox-text-two theme_main_text">{row.title}</span></p>
                                        <p><span className="counters theme_secondary_text">{Language.getText(202004)} {BaseUtils.prettifyNumber(row.view_count, {s: 1})} • {Language.getText(202001)} {BaseUtils.prettifyNumber(row.like_count, {s: 1})}</span></p>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export class GameRisingTopicPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            topics: props.topics
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            topics: props.topics
        });
    }

    goTopic(topic_id) {
        browserHistory.push(GameUtils.getGameUrl("topic/" + topic_id));
    }

    render() {
        var topics = this.state.topics.slice(0, 5);
        var hasRising=topics.length==0?'hide':'';
        return (
            <div className={"game-panel game-panel-fat game-rising-topic-panel panel theme_card_background "+hasRising}>
                <div className="panel-heading theme_main_text"><span className="color-block theme_panel_rising"></span>{Language.getText(201003)}</div>
                <div className="panel-body">
                    <div className="media-list">
                        {
                            topics.map((topic) => {
                                var creator = topic.creator;
                                return (
                                    <div key={"topic-" + topic.topic_id} className="media" onClick={this.goTopic.bind(this, topic.topic_id)}>
                                        <div className="media-left">
                                            <img alt="" className="avatar img-circle" src={BaseUtils.getAvatar(creator.head_url)}/>
                                        </div>
                                        <div className="media-body">
                                            <span className="name media-headding linebox-text-one theme_secondary_text">{creator.nickname}</span>
                                            <p><span className="title linebox-text-two theme_main_text">{topic.title || topic.content}</span></p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export class GameVoteTopicPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            total: 0,
            topic: null
        }
    }

    componentDidMount() {
        this.serverRequest = $.get("/api/vote/pick", {
            game_id: GameUtils.game_id
        }, function (result) {
            this.serverRequest = null;
            if (result.errno)
                console.error(result.message);
            else
                this.setState(result.data);
        }.bind(this));
    }

    componentWillUnmount() {
        if(this.serverRequest)
            this.serverRequest.abort();
    }


    goTopic(topic_id) {
        browserHistory.push(GameUtils.getGameUrl("topic/" + topic_id));
    }

    render() {
        if(!this.state.topic)
            return <div></div>;

        var topic = this.state.topic;
        var vote_date = topic.vote_data || {};
        var vote_options = vote_date.options || [];
        var vote_counters = vote_date.counters || [];

        var total = 0;
        var vote_list = [];
        vote_options.forEach((row, index) => {
            var data = {
                index: index,
                icon_url: row.icon_url || "",
                desc: row.desc || "",
                count: (vote_counters[index] || {}).count || 0
            };
            total += data.count;
            vote_list.push(data);
        });
        vote_list.forEach((row) => {
            row.rate = row.count? Math.floor((row.count / total) * 100): 0
        });
        var hasVote=vote_list.length==0?'hide':'';
        return (
            <div className={"game-panel game-vote-topic-panel panel theme_main_background "+hasVote} onClick={this.goTopic.bind(this, topic.topic_id)}>
                <div className="panel-heading theme_main_text"><span className="color-block theme_panel_poll"></span>{Language.getText(201004)}</div>
                <div className="panel-body">
                    <div className="title theme_main_text">{topic.title || topic.content}</div>
                    <div className="media-list">
                        {
                            vote_list.map((vote) => {
                                var style = {
                                    width: vote.rate + "%"
                                };
                                return (
                                    <div key={"item-" + vote.index} className="media" >
                                        {(()=>{
                                             if(vote.icon_url){
                                                 return (
                                                     <div className="media-left">
                                                         <img alt="" className="icon" src={vote.icon_url}/>
                                                     </div>
                                                 );
                                             }
                                         })()}
                                        <div className="media-body">
                                            <span className="desc  media-headding theme_secondary_text">{vote.desc}</span>
                                            <div className="progress">
                                                <div className="progress-bar" role="progressbar" aria-valuenow={vote.rate} aria-valuemin="0" aria-valuemax="100" style={style}>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>

                </div>
            </div>
        );
    }
}
