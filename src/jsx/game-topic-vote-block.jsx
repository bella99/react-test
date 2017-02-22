import React from 'react';

import Language from './language';
import GameUtils from './game-utils';

export default class GameTopicVoteBlock extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            votes: props.votes
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            votes: props.votes
        });
    }

    render() {
        var vote_date = this.state.votes || {};
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

        var curTime = new Date().getTime();
        var isVoting = Language.getText(curTime < vote_date.end_time? 202101: 202102);

        return (
            <div className="game-topic-vote-block">
                <div className="vote-title">
                    <span>{isVoting}</span>
                    <span className="pull-right">{vote_date.total} {Language.getText(202103)}</span>
                </div>
                {
                    vote_list.map((item)=>{
                        var style = {
                            width: item.rate + "%"
                        };
                        var hasImg=item.icon_url==""?'hide':'';
                        return(
                            <div className="media" key={"item-" + item.index}>
                                <div className="media-left">
                                    <img className={"vote-img "+hasImg} src={item.icon_url} />
                                </div>
                                <div className="media-body vote-body">
                                    <div className="vote-name media-heading text-muted">
                                        {item.desc}
                                    </div>
                                    <div className="progress theme_main_background vote-progress">
                                        <div className="progress-bar theme_titlebar_background vote-progress-bar" role="progressbar" aria-valuenow={item.rate} aria-valuemin="0" aria-valuemax="100" style={style}>
                                            {item.rate}%
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
