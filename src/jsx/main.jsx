import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Redirect, browserHistory} from 'react-router';

import BackTop from './back-top';

import UserLoginPage from './user-login-page';
import UserForgetpwdPage from './user-forgetpwd-page';
import NotFoundPage from './notfound-page';

import GameRootLayout from './game-root-layout';
import GameMultiColumnLayout from './game-multi-column-layout';
import GameMainPage from './game-main-page';
import GameTopicsPage from './game-topics-page';
import GameImagesPage from './game-images-page';
import GameVideosPage from './game-videos-page';
import GameTopicSearchPage from './game-topic-search-page';
import GameTopicDetailPage from './game-topic-detail-page';
import GameTopicCreatePage from './game-topic-create-page';
import GameCollectionDetailPage from './game-collection-detail-page';

class App extends React.Component {
    render() {
        return (
            <div className="app-root theme_main_background">
                {this.props.children}
                <BackTop />
            </div>
        );
    };
};

class NonePage extends React.Component {
    render() {
        return (
            <h1>Please input url like: '/game/:game_id'</h1>
        );
    };
};

class Page404 extends React.Component {
    render() {
        return (
            <NotFoundPage />
        );
    };
};

ReactDOM.render((
    <Router history={browserHistory}>
        <Route component={App}>
            <Route path="/" component={NonePage} />
            <Route path="/user/">
                <Route path="login" component={UserLoginPage} />
                <Route path="forgetpwd" component={UserForgetpwdPage} />
            </Route>
            <Route path="/game/" component={GameRootLayout}>
                <Route path=":game_id" component={GameMainPage} />
                <Route path=":game_id/images" component={GameImagesPage} />
                <Route path=":game_id/videos" component={GameVideosPage} />
                <Route path=":game_id/topic/create" component={GameTopicCreatePage} />
                <Route component={GameMultiColumnLayout}>
                    <Route path=":game_id/topics" component={GameTopicsPage} />
                    <Redirect from=":game_id/category/0" to=":game_id/topics" />
                    <Route path=":game_id/category/:category" component={GameTopicsPage} />
                    <Route path=":game_id/topic/:topic_id" component={GameTopicDetailPage} />
                    <Route path=":game_id/collection/:collection_id" component={GameCollectionDetailPage} />
                    <Route path=":game_id/search" component={GameTopicSearchPage} />
                </Route>
            </Route>
            <Route path="*" component={Page404} />
        </Route>
    </Router>
), document.getElementById('root'));
