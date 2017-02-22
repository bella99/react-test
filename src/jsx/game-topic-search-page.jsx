import _ from 'lodash';
import React from 'react';

import Language from './language';
import GameUtils from './game-utils';
import {GameDynamicTopicList} from './game-topic-list';

class WaittingBox extends React.Component {

    show() {
        $(this.refs.waittingBox).show();
    }

    hide() {
        $(this.refs.waittingBox).hide();
    }

    render() {
        return (
            <div ref="waittingBox" className="waitting-box">
                <img className="icon rectbox-center-xy" src="/assets/images/waitting-box.svg" />
            </div>
        );
    }
}

function HtmlTextRunder(keyword) {
    var lenmin = 0,
        lenmax = 0,
        kwscount = 0,
        keywords = [];
    if (keyword) {
        _.each(keyword.split(" "), function(kw) {
            if (kw) {
                keywords.push(kw.toLowerCase());
                if (kw.length > lenmax)
                    lenmax = kw.length;
                if (lenmin == 0 || kw.length < lenmin)
                    lenmin = kw.length;
            }
        });
        keywords = _.uniq(keywords.sort(function(a, b) {
            return b.length - a.length;
        }));
        kwscount = keywords.length;
    }

    var filter = function(txt, kwindex) {
        if (kwindex >= kwscount)
            return _.escape(txt);

        var kw = keywords[kwindex];
        var pos = txt.toLowerCase().indexOf(kw);
        if (pos < 0)
            return filter(txt, kwindex + 1);

        var rpos = pos + kw.length;
        var left = "",
            center = txt.substring(pos, rpos),
            right = "";
        if (pos > 0) {
            if (pos < lenmin)
                left = _.escape(txt.substring(0, pos));
            else
                left = filter(txt.substring(0, pos), kwindex + 1);
        }
        if (rpos < txt.length) {
            if (rpos + lenmin > txt.length)
                right = _.escape(txt.substring(rpos));
            else
                right = filter(txt.substring(rpos), kwindex);
        }

        return left + '<span class="keyword">' + _.escape(center) + '</span>' + right;
    };

    this.render = function(text) {
        return filter(text, 0);
    };
}

export default class GameTopicSearchPage extends React.Component {
    constructor(props) {
        super(props);

        this.querier = {
            ended: 0,
            cursor: 0
        };
        this.state = {
            keyword: props.params.keyword || props.location.query.keyword
        }
        this.textRender = new HtmlTextRunder(this.state.keyword);
        this.serverRequest = null;
        this.renderHtmlText = this.renderHtmlText.bind(this);
        this.queryMoreTopics = this.queryMoreTopics.bind(this);
        this.queryResetTopics = this.queryResetTopics.bind(this);
    }

    componentWillUnmount() {
        if(this.serverRequest)
            this.serverRequest.abort();
    }

    renderHtmlText(text) {
        return this.textRender.render(text);
    }

    queryMoreTopics(queryCompleted) {
        if(!this.state.keyword)
            queryCompleted(false, []);
        else if(this.serverRequest || this.querier.ended)
            queryCompleted(false, []);
        else {
            var queryCount = 15;
            this.refs.waittingBox.show();
            this.serverRequest = $.get("/api/topic/search", {
                game_id: GameUtils.game_id,
                keyword: this.state.keyword,
                cursor: this.querier.cursor,
                count: queryCount
            }, function (result) {
                this.serverRequest = null;
                this.refs.waittingBox.hide();

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
                    if(data.cursor < 1) {
                        $(this.refs.total).text('' + data.total);
                    }
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
        $(this.refs.total).text("0");
        this.queryMoreTopics(queryCompleted);
    }

    render() {
        return (
            <div className="game-topic-search-page">
                <div className="top-bar">
                    <span className="result theme_secondary_text"><span ref="total">0</span> {Language.getText(202107)}</span>
                </div>
                <WaittingBox ref="waittingBox" />
                <GameDynamicTopicList queryResetTopics={this.queryResetTopics} queryMoreTopics={this.queryMoreTopics} textRender={this.renderHtmlText} />
            </div>
        );
    };
};
