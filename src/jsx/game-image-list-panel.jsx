import _ from 'lodash';
import React from 'react';
import {Link, browserHistory} from 'react-router';

import Language from './language';
import GameUtils from './game-utils';
import {ListImagesBlock} from './images-block';

export default class GameImageListPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            total: 0,
            topics: []
        };
        this.onClickImage = this.onClickImage.bind(this);
        this.onClickImageMore = this.onClickImageMore.bind(this);
    }

    onClickImage(index, id) {
        browserHistory.push(GameUtils.getGameUrl("topic/" + id));
    }

    onClickImageMore() {
        browserHistory.push(GameUtils.getGameUrl("images"));
    }

    componentDidMount() {
        this.serverRequest = $.get("/api/image/summary", {
            game_id: GameUtils.game_id
        }, function (result) {
            if (result.errno)
                console.error(result.message);
            else {
                var data = result.data;
                this.setState({
                    total: data.total,
                    topics: data.topics
                });
            }
        }.bind(this));
    }

    componentWillUnmount() {
        this.serverRequest.abort();
    }

    render() {
        var total = this.state.total;
        var images = [];
        this.state.topics.forEach(function(row) {
            if(row.images && row.images.length > 0) {
                var image = row.images[0];
                images.push({
                    id: row.topic_id,
                    url: image.url
                });
            }
        });
        images = _.shuffle(images);

        return (
            <div className="game-panel game-panel-fat game-panel-more game-image-list-panel panel theme_card_background">
                <div className="panel-heading theme_main_text"><span className="color-block theme_panel_photos"></span>{Language.getText(201006)} <Link to={GameUtils.getGameUrl('images')} className="more pull-right theme_secondary_text">{Language.getText(201007)}</Link></div>
                <div className="panel-body">
                    <ListImagesBlock total={total} images={images} onClick={this.onClickImage} onClickMore={this.onClickImageMore}/>
                </div>
            </div>
        );
    };
};
