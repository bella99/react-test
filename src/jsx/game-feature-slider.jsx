import _ from 'lodash';
import React from 'react';
import {Link, browserHistory} from 'react-router';

import GameUtils from './game-utils';

class TopicsBox extends React.Component {
    constructor(props) {
        super(props);

        var topics = [].concat(props.topics);
        while (topics.length < 3) {
            topics = topics.concat(topics);
        }

        topics = [].concat(topics, topics, topics);

        this.state = {
            topics: topics,
            amount: topics.length,
            middle_left: Math.floor(topics.length / 3),
            middle_right: Math.floor(topics.length / 3 * 2),
        }
        this.status = {
            index: this.state.middle_left,
            stepWidth: 0,
            isStepping: false
        };
        this.movePrev = this.movePrev.bind(this);
        this.moveNext = this.moveNext.bind(this);
        this.onResize = this.onResize.bind(this);
        this.onAnimateCompleted = this.onAnimateCompleted.bind(this);
    }

    handleClick(index) {
        var topic = this.state.topics[index];
        browserHistory.push(GameUtils.getGameUrl("topic/" + topic.topic_id));
    }

    onAnimateCompleted() {
        this.status.isStepping = false;
    }

    animateMove(fromIndex, toIndex, isReset) {
        if (isReset) {
            $(this.refs.topicsBox).css({left: (0 - fromIndex * this.status.stepWidth) + 'px'});
        }
        $(this.refs.topicsBox).animate({left: (0 - toIndex * this.status.stepWidth) + 'px'}, {done: this.onAnimateCompleted});
        this.status.index = toIndex;
    }

    movePrev() {
        if (this.status.isStepping)
            return;
        this.status.isStepping = true;

        var isReset = false;
        var fromIndex = this.status.index;
        var toIndex = fromIndex - 1;
        if (toIndex < 1) {
            isReset = true;
            fromIndex = this.state.middle_right + 1;
            toIndex = fromIndex - 1;
        }
        this.animateMove(fromIndex, toIndex, isReset);
    }

    moveNext() {
        if (this.status.isStepping)
            return;
        this.status.isStepping = true;

        var isReset = false;
        var fromIndex = this.status.index;
        var toIndex = fromIndex + 1;
        if (toIndex >= this.state.amount - 1) {
            isReset = true;
            fromIndex = this.state.middle_left + (fromIndex - this.state.middle_right);
            toIndex = fromIndex + 1;
        }
        this.animateMove(fromIndex, toIndex, isReset);
    }

    onResize(width, height) {
        this.status.stepWidth = width;
        $(this.refs.topicsBox).css({left: (0 - this.status.index * width) + 'px'});
        $(this.refs.topicsBox).find("li").css({width: width + 'px', height: height + 'px'});
    }

    render() {
        return (
            <ul ref="topicsBox" className="topics-box">
                {
                    this.state.topics.map((topic, index) => {
                        return (
                            <li ref={"index-" + index} key={"topics-index-" + index}
                                onClick={this.handleClick.bind(this, index)}>
                                <img src={topic.cover_url}/>
                            </li>
                        );
                    })
                }
            </ul>
        )
    }
}

export class GameFeatureSlider extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            topics: props.topics || []
        };
        this.movePrev = this.movePrev.bind(this);
        this.moveNext = this.moveNext.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    handleResize() {
        var centerWidth = parseInt($(this.refs.centerBox).css('width'));
        var minCenterWidth = parseInt($(this.refs.centerBox).css('min-width'));
        if (centerWidth <= minCenterWidth) {
            var frameWidth = parseInt($(this.refs.featureSlider).css('width'));
            var sideWidth = Math.floor((frameWidth - centerWidth) / 2);
            if (sideWidth < 0)
                sideWidth = 0;
            $(this.refs.leftBox).css({width: sideWidth + 'px'});
            $(this.refs.rightBox).css({width: sideWidth + 'px'});
        }
        else {
            $(this.refs.leftBox).css({width: '30%'});
            $(this.refs.rightBox).css({width: '30%'});
        }
        var width = parseInt($(this.refs.centerBox).css('width'));
        var height = Math.floor(width * 480 / 1200);
        $(this.refs.featureSlider).css({height: height + 'px'});
        this.refs.topicsBox.onResize(width, height);
    }

    componentDidMount() {
        this.handleResize();
        $(window).bind('resize', this.handleResize);
    }

    componentWillUnmount() {
        $(window).unbind('resize', this.handleResize);
    }

    movePrev() {
        this.refs.topicsBox.movePrev();
    }

    moveNext() {
        this.refs.topicsBox.moveNext();
    }

    render() {
        return (
            <div ref="featureSlider" className="game-feature-slider">
                <div ref="leftBox" className="cover left-box"></div>
                <div ref="centerBox" className="center-box">
                    <TopicsBox ref="topicsBox" topics={this.state.topics}/>
                </div>
                <div ref="rightBox" className="cover right-box"></div>
                <span className="prev slider-btn" onClick={this.movePrev}><span className="glyphicon glyphicon-menu-left"></span></span>
                <span className="next slider-btn" onClick={this.moveNext}><span className="glyphicon glyphicon-menu-right"></span></span>
            </div>
        )
    }
}
