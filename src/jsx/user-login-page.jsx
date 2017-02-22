import _ from 'lodash';
import React from 'react';
import {Link, browserHistory} from 'react-router';

import BaseUtils from './base-utils';

export default class UserLoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: ''
        };
        this.serverRequest = null;
        this.redirectUrl =  props.params.redirect_url || props.location.query.redirect_url || "/";

        this.changeUser = this.changeUser.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.handleLoginClick = this.handleLoginClick.bind(this);

    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    changeUser(e){
        this.setState({username: _.trim(e.target.value)});
    }

    changePassword(e){
        this.setState({password: _.trim(e.target.value)});
    }

    handleLoginClick(){
        if(!this.state.username){
            this.refs.username.focus();
            return;
        }
        if(!this.state.password){
            this.refs.password.focus();
            return;
        }

        if(this.serverRequest)
            return;
        this.serverRequest = $.get("/api/user/login", {
            username: this.state.username,
            password: this.state.password,
            auto_login: $(this.refs.autoLogin).is(':checked')? 1: 0
        }, function (result) {
            this.serverRequest = null;
            if (result.errno)
                this.setState({
                    username: '',
                    password: ''
                });
            else {
                BaseUtils.refreshHref(this.redirectUrl);
            }
        }.bind(this));
    }

    render() {
        return (
            <div className="user-login-page">
                <div className="login-title theme_background_line_bottom theme_card_background "><img src="/assets/images/ktplay_logo_2015_black_font.svg" alt="kt-logo"/></div>
                <div className="login-bg">
                    <div className="login-block">
                        <div className="login">登录社区</div>
                        <div className="slogan">互动交流、分享游戏经验、共享游戏攻略、热门搜索游戏和内容</div>
                        <div className="input-group">
                            <input type="text" className="form-control" ref="username" placeholder="请输入电子邮件" onChange={this.changeUser} value={this.state.username} required/>
                        </div>
                        <div className="input-group">
                            <input type="password" className="form-control"  ref="password" placeholder="请输入密码" onChange={this.changePassword}  value={this.state.password} required/>
                        </div>
                        <div className="btn btn-lg btn-info" onClick={this.handleLoginClick}>登&nbsp;录</div>
                        <div className="login-tip">
                            <span className="pull-left"><input ref="autoLogin" type="checkbox" /> 下次自动登录</span>
                            <Link to="/user/forgetpwd" className="pull-right forgot-password theme_highlighted_item">忘记密码</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
};
