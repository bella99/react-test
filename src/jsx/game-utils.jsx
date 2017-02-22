import _ from 'lodash';
import Language from './language';

class  GameUtils {

    get game_id() {
        return GameConfig.game.game_id;
    }

    get game() {
        return GameConfig.game;
    }

    getCategoryName(id) {
        var category = _.find(GameConfig.game.categories, (row) => {
            return row.id == id;
        });
        return category? category.name: "";
    }

    getCategoryList() {
        return GameConfig.game.categories || [];
    }

    getGameUrl(path) {
        var url = '/game/' + GameConfig.game.game_id;
        if(path)
            url += '/' +  path;
        return url;
    }

    getGameFullUrl(path) {
        var url = window.location.href;
        var base = url.match(/.*\/game\/[0-9]+/g);
        if(!base)
            base = '/game/' + GameConfig.game.game_id;
        return base + '/' +  path;
    }

    getTopicLikeText(topic) {
        if(!topic)
            return "";
        var content = _.trim(topic.title) || _.trim(topic.content) || "";
        if(!content && topic.images && topic.images.length > 0)
            return Language.getText(201008);
        return content;
    }

    get isLogined() {
        return GameConfig.loginuser? true: false;
    }

    get isJoined() {
        return GameConfig.gameuser? true: false;
    }

    get loginUser() {
        return GameConfig.gameuser || GameConfig.loginuser || {};
    }

    get gameUser() {
        return GameConfig.gameuser || {};
    }
}

export default new GameUtils();
