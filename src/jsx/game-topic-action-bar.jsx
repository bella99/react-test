import React from 'react';
import {Link} from 'react-router';

import Language from './language';
import GameUtils from './game-utils';

export default class GameTopicActionBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            type: props.type || 0,
            otype: props.otype || 4,
            theme: props.theme || 'all'
        };
        this.onChangeType = props.onChangeType;
        this.onChangeOType = props.onChangeOType;
    }

    componentDidMount() {
        $(this.refs.orderSelect).selectpicker();
        $(this.refs.orderSelect).on('hidden.bs.select', function (e) {
            var otype = parseInt(e.target.value);
            this.setState({
                otype: otype
            });
            if(this.onChangeOType) {
                this.onChangeOType(otype);
            }
        }.bind(this));
    }

    componentWillUnmount() {
        $(this.refs.orderSelect).selectpicker('destory');
    }

    handleChangeType(type) {
        if(type == this.state.type)
            type = 0;
        this.setState({
            type: type
        });
        if(this.onChangeType) {
            this.onChangeType(type);
        }
    }

    render() {
        var typeVideo = <div />;
        var typeVote = <div />;

        if(this.state.theme == 'all') {
            typeVideo = <li className={this.state.type==3? "active": ""} onClick={this.handleChangeType.bind(this, 3)}><span className="glyphicon glyphicon-facetime-video"></span>Video</li>;
            typeVote = <li className={this.state.type==2? "active": ""} onClick={this.handleChangeType.bind(this, 2)}><span className="glyphicon glyphicon-stats"></span>Poll</li>;
        }

        return (
            <div className="game-topic-action-bar theme_card_background">
                <ul className="nav nav-pills theme_secondary_text">
                    <li>
                        <span className="glyphicon glyphicon-th-list" onClick={this.handleChangeType.bind(this, 0)}></span>
                        <select ref="orderSelect" className="order-select selectpicker" defaultValue={this.state.otype}>
                            <option value="4">{Language.getText(200201)}</option>
                            <option value="1">{Language.getText(200202)}</option>
                            <option value="6">{Language.getText(200203)}</option>
                            <option value="2">{Language.getText(200204)}</option>
                        </select>
                    </li>
                    {typeVideo}
                    {typeVote}
                </ul>
            </div>
        );
    }
}
