import React from 'react';
import {Link, browserHistory} from 'react-router';

import DataStore from './data-store';
import GameUtils from './game-utils';
import {GameDynamicTopicList} from './game-topic-list';
import GameTopicActionBar from './game-topic-action-bar';

export default class GameTopicsPage extends React.Component {

    constructor(props) {
        super(props);

        this.store = DataStore.createItem("topic-page-otype");

        this.querier = {
            ended: 0,
            cursor: 0
        };
        this.state = {
            type: 0,
            otype: this.store.getValueAsInt(4),
            category: props.params.category
        }
        this.serverRequest = null;
        this.queryMoreTopics = this.queryMoreTopics.bind(this);
        this.queryResetTopics = this.queryResetTopics.bind(this);
        this.handleChangeType = this.handleChangeType.bind(this);
        this.handleChangeOType = this.handleChangeOType.bind(this);
    }

    componentWillUnmount() {
        if(this.serverRequest)
            this.serverRequest.abort();
    }

    queryMoreTopics(queryCompleted) {
        if(this.serverRequest || this.querier.ended) {
            queryCompleted(false, []);
        }
        else {
            var queryCount = 15;
            this.serverRequest = $.get("/api/topic/list", {
                game_id: GameUtils.game_id,
                category: this.state.category,
                type: this.state.type,
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
                queryCompleted(uglied, topics);
            }.bind(this));
        }
    }

    queryResetTopics(queryCompleted) {
        this.querier = {
            ended: 0,
            cursor: 0
        };
        this.queryMoreTopics(queryCompleted);
    }

    handleChangeType(type) {
        this.setState({
            type: type
        });
    }

    handleChangeOType(otype) {
        this.setState({
            otype: otype
        });
        this.store.setValue(otype);
    }

    render() {
        return (
            <div className="game-topics-page">
                <div className="top-bar">
                    <span className="category theme_secondary_text">{GameUtils.getCategoryName(this.state.category)}</span>
                </div>

                <GameTopicActionBar type={this.state.type}
                                otype={this.state.otype}
                                onChangeType={this.handleChangeType}
                                onChangeOType={this.handleChangeOType}/>
                <GameDynamicTopicList queryResetTopics={this.queryResetTopics} queryMoreTopics={this.queryMoreTopics} />
            </div>
        );
    };
};
