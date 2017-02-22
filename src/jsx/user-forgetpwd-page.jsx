import React from 'react';

export default class UserForgetpwdPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: ''
        };
        this.forgetUsername = this.forgetUsername.bind(this);
        this.resetPwd = this.resetPwd.bind(this);

    }
    componentDidMount() {
    }

    componentWillUnmount() {

    }
    forgetUsername(e){
        var username = e.target.value;
        this.setState({username: username});
    }
    resetPwd(username){
        
    }
    render() {
        return (
            <div className="user-forgetpwd-page">
                <div className="forgetpwd-title theme_background_line_bottom theme_card_background "><img
                    src="/assets/images/ktplay_logo_2015_black_font.svg" alt="kt-logo"/></div>
                <div className="forgetpwd-bg">
                    <div className="forgetpwd-block">
                        <div className="forgetpwd">重置密码</div>
                        <div className="slogan">忘记密码?不要紧,请输入电子邮件验证一下</div>
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="请输入电子邮件" onChange={this.forgetUsername}
                                   value={this.state.username}/>
                        </div>
                        <div className="btn btn-lg btn-info"
                             onClick={this.resetPwd.bind(this,this.state.username)}>重置密码
                        </div>
                    </div>
                </div>
            </div>
        );
    };
};
