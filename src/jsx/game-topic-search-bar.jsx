import _ from 'lodash';
import React from 'react';
import {Link, browserHistory} from 'react-router';

import GameUtils from './game-utils';

export class GameTopicSearchBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            keyword:'',
            hotwords: [],
            tipwords: []
        };

        this.serverRequest = null;
        this.querySearchHots = this.querySearchHots.bind(this);
        this.querySearchTips = this.querySearchTips.bind(this);

        this.onChange = this.onChange.bind(this);
        this.searchNow = this.searchNow.bind(this);
        this.handleKeyup = this.handleKeyup.bind(this);
        this.handleShowExtend = this.handleShowExtend.bind(this);
        this.handleHideExtend = this.handleHideExtend.bind(this);
    }

    querySearchHots() {
        if(this.serverRequest)
            this.serverRequest.abort();

        this.serverRequest = $.get("/api/game/search/hots", {
            game_id: GameUtils.game_id
        }, function (result) {
            this.serverRequest = null;
            if (result.errno)
                console.error(result.message);
            else {
                this.setState({
                    hotwords: result.data.hots
                });
            }
        }.bind(this));
    }

    querySearchTips(keyword) {
        if(this.serverRequest)
            this.serverRequest.abort();

        if(!keyword)
            this.setState({tipwords: []});
        else
            this.serverRequest = $.get("/api/game/search/tips", {
                game_id: GameUtils.game_id,
                keyword: keyword
            }, function (result) {
                this.serverRequest = null;
                if (result.errno)
                    console.error(result.message);
                else {
                    console.log(result);
                    this.setState({
                        tipwords: result.data.tips
                    });
                }
            }.bind(this));
    }

    componentDidMount() {
        this.querySearchHots();
    }

    componentWillUnmount() {
        if(this.serverRequest)
            this.serverRequest.abort();
    }

    onChange(e){
        var keyword = e.target.value;
        this.setState({keyword: keyword});
        this.querySearchTips(keyword);
    }

    goSearch(keyword) {
        browserHistory.push({
            pathname: GameUtils.getGameUrl('search'),
            query: {
                keyword: keyword
            }
        });
    }

    searchNow(){
        this.goSearch(this.state.keyword);
    }

    handleKeyup(e) {
        if(e.keyCode == 13){
            this.goSearch(this.state.keyword);
        }
    }

    handleShowExtend(){
        $(this.refs.extend).show();
    }

    handleHideExtend(){
        window.setTimeout(function(){
            $('.extend').hide();
        },500)

    }

    render() {
        var hasHotWords=this.state.hotwords.length>=1?'':'hide';
        return (
            <div className="game-topic-search-bar">
                <div className="keyword-input input-group">
                    <input type="text" className="keyword form-control" value={this.state.keyword} placeholder="hot search"
                           onChange={this.onChange}
                           onKeyUp={this.handleKeyup}
                           onFocus={this.handleShowExtend}
                           onBlur={this.handleHideExtend}/>
                    <span className="search-btn input-group-addon btn"  onClick={this.searchNow.bind(this)}><span className="glyphicon glyphicon-search"></span></span>
                </div>
                <div ref="extend" className="extend">
                    <ul className="tip-words list-group">
                        {
                            this.state.tipwords.map((word, index)=>{
                                return (<li key={index} className="tip-item list-group-item" onClick={this.goSearch.bind(this, word)}>{word}</li>);
                            })
                        }
                    </ul>
                    <div className="hot-words">
                        {
                            this.state.hotwords.map((item,index)=>{
                                return (<span key={index} className="word" onClick={this.goSearch.bind(this, item.keyword)}>{item.keyword}</span>);
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}
