import React from 'react';
import {Link, browserHistory} from 'react-router';

export default class UserLoginPage extends React.Component {
    constructor(props) {
        super(props);

    }
    componentDidMount() {
    }

    componentWillUnmount() {

    }
    render() {
        return (
            <div className="not-found theme_main_background">
                <div><img src="/assets/images/not-found.svg" alt="kt-not-found"/></div>
                <div>抱歉,您访问的页面可能去玩游戏了...</div>
                <div>您可以去其他地方逛逛</div>
                <Link to="" className="btn btn-info btn-lg">网站首页</Link>
                <div><img src="/assets/images/ktplay_logo_2015_black_font.svg" alt=""/></div>
            </div>
        );
    };
};
