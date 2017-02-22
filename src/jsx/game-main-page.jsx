import _ from 'lodash';
import React from 'react';
import {browserHistory} from 'react-router';

import Language from './language';
import BaseUtils from './base-utils';
import GameUtils from './game-utils';
import GameVideoListPanel from './game-video-list-panel';
import GameImageListPanel from './game-image-list-panel';
import {GameFeatureSlider} from './game-feature-slider';
import {GameTopicSearchBar} from './game-topic-search-bar';
import {GameInfluenceTopPanel, GameCollectionPanel, GameRisingTopicPanel, GameVoteTopicPanel} from './game-panels';

class Category extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            summary: {
                total: 0,
                today: 0,
                recent_topics: [],
                image_total: 0,
                image_list: []
            }
        };

        this.goCagegory = this.goCagegory.bind(this);
    }

    goCagegory() {
        var category = this.props.category;

        browserHistory.push(GameUtils.getGameUrl("category/" + category.id));
    }

    goTopic(topic_id) {
        browserHistory.push(GameUtils.getGameUrl("topic/" + topic_id));
    }

    componentDidMount() {
        var category = this.props.category;

        this.serverRequest = $.get("/api/category/summary", {
            game_id: GameUtils.game_id,
            category: category.id
        }, function (result) {
            this.serverRequest = null;
            if (result.errno)
                console.error(result.message);
            else
                this.setState({
                    summary: result.data
                });
        }.bind(this));
    }

    componentWillUnmount() {
        if(this.serverRequest)
            this.serverRequest.abort();
    }

    render() {
        var summary = this.state.summary;
        var category = this.props.category;

        var categoryImageInfo;
        if(summary.image_total > 0) {
            var totalInfo;
            if(summary.image_total > summary.image_list.length)
                totalInfo = (<span className="counters theme_secondary_text"> +{BaseUtils.prettifyNumber(summary.image_total - summary.image_list.length)}</span>);
            categoryImageInfo = (
                <div className="images">
                    {
                        summary.image_list.slice(0, 5).map((topic) => {
                            var image = BaseUtils.getThumbnailImageUrl(topic.images[0].url, 64);
                            return (
                                <div key={"image-" + topic.topic_id} className="image rectbox-image"><img src={image} /></div>
                            )
                        })
                    }
                    {totalInfo}
                </div>
            );
        }

        return (
            <div className="category-item theme_background_line_all list-group-item theme_card_background">
                <div className="category-summary media" onClick={this.goCagegory}>
                    <div className="media-left">
                        <img alt="" className="icon" src={category.icon_url}/>
                    </div>
                    <div className="media-body">
                        <span className="name media-headding theme_main_text">{category.name}</span>
                        <p><span className="counters theme_secondary_text">{Language.getText(200101)} {BaseUtils.prettifyNumber(summary.total)} • {Language.getText(200102)} +{BaseUtils.prettifyNumber(summary.today)}</span></p>
                        {categoryImageInfo}
                    </div>
                </div>
                <div className="category-topic-list media-list theme_main_background">
                    {
                        summary.recent_topics.map((topic) => {
                            var creator = topic.creator || {};
                            return (
                                <div key={"recent-topic-" + topic.topic_id} className="media theme_background_line theme_secondary_card_background" onClick={this.goTopic.bind(this, topic.topic_id)}>
                                    <div className="media-left hide">
                                        <img alt="" className="avatar img-circle" src={BaseUtils.getAvatar(creator.head_url)}/>
                                    </div>
                                    <div className="media-body">
                                        <span className="name  media-headding theme_secondary_text"><span className="nick-name"> {creator.nickname}</span><span className="pull-right theme_hint_text">{BaseUtils.prettifyDate(topic.create_time)}</span></span>
                                        <p><span className="title theme_main_text">{GameUtils.getTopicLikeText(topic)}</span></p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}

class CategoryList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: props.categories
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            categories: props.categories
        });
    }

    render() {
        return (
            <div className="category-list list-group">
                {
                    this.state.categories.map((category) => {
                        return <Category key={"cagegory-" + category.id} category={category} />
                    })
                }
            </div>
        );
    }
}


export default class GameMainPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            topic_categories: [],
            featured_topics: [],
            popular_topics: [],
            influence_tops: [],
            collections: []
        };
    }

    componentDidMount() {
        this.serverRequest = $.get("/api/game/mainpage", {
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

    render() {

        var featureSlider = <div />;
        var featuredTopics = _.filter(this.state.featured_topics, (topic) => {
            return topic.cover_url;
        });
        if(featuredTopics.length > 0) {
            featureSlider = <GameFeatureSlider topics={featuredTopics} />
        }

        return (
            <div>
                {featureSlider}
                <div className="container">
                    <div className="row game-main-page">
                        <div className="col-side-left col-md-2 hidden-sm hidden-xs">
                            <GameInfluenceTopPanel users={this.state.influence_tops} />
                            <GameCollectionPanel collections={this.state.collections} />
                            <GameVoteTopicPanel />
                        </div>
                        <div className="col-side-middle col-md-6">
                            <GameTopicSearchBar source={location.href}/>
                            <CategoryList categories={this.state.topic_categories} />
                        </div>
                        <div className="col-side-right col-md-4">
                            <GameRisingTopicPanel topics={this.state.popular_topics} />
                            <GameVideoListPanel />
                            <GameImageListPanel />
                        </div>
                    </div>
                </div>
            </div>
        );
    };
};
