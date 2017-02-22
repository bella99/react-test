import React from 'react';
import {browserHistory} from 'react-router';

import Language from './language';
import BaseUtils from './base-utils';
import GameUtils from './game-utils';
import {GameTopicList} from './game-topic-list';

export default class GameCollectionDetailPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            collection_id: props.params.collection_id,
            collection: null
        };
        this.serverRequest = null;
    }

    componentDidMount() {
        this.serverRequest = $.get("/api/collection/detail", {
            game_id: GameUtils.game_id,
            collection_id: this.state.collection_id
        }, function (result) {
            this.serverRequest = null;

            if (result.errno)
                console.error(result.message);
            else {
                var data = result.data;
                this.setState({
                    collection: data
                });
            }
        }.bind(this));
    }

    componentWillUnmount() {
        if(this.serverRequest)
            this.serverRequest.abort();
    }

    render() {
        if(!this.state.collection)
            return <div />;

        var collection = this.state.collection;

        return (
            <div className="game-collection-detail-page">


                <div className="detail-body">
                    <div className="image">
                        <img src={collection.cover_icon_url} width="100%"/>
                    </div>
                    <div className="summary theme_card_background">
                        <div className="title linebox-text-one ">{collection.title}</div>
                        <div className="content">
                            <pre className="content-text">
                                <code>
                                    {collection.content}
                                </code>
                            </pre>
                        </div>
                        <div className="counters theme_secondary_text">
                            <span>{Language.getText(202001)} {BaseUtils.prettifyNumber(collection.like_count)} • {Language.getText(202004)} {BaseUtils.prettifyNumber(collection.view_count)}</span>
                        </div>
                    </div>
                </div>
                <div className="topic-count theme_background_line theme_secondary_text theme_card_background">
                    Topics {collection.topics.length}
                </div>
                <GameTopicList topics={collection.topics} />
            </div>
        );
    }
}
