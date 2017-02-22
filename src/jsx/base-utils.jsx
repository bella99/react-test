import _ from 'lodash';
import Language from './language';

class BaseUtils {

    refreshHref(url) {
        window.location.href = url;
    }

    getGameIcon(url) {
        return url || "/assets/images/default-game.png";
    }

    getAvatar(url) {
        return url || "/assets/images/default-avatar.png";
    }

    prettifyNumber(value, opts) {
        if(!opts)
            opts = {};

        var space = 0;
        var stuffix = "";

        if(opts.s) {
            if(value > 1000) {
                space = 1;
                stuffix = "K";
                value = value / 1000;
            }
        }

        var text = "" + value;
        var subs = text.split('.');
        return subs[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + ((subs.length < 2 || space < 1) ? '' : '.' + subs[1].substring(0, space)) + stuffix;
    }

    prettifyDate(value) {
        var offset = -1, count = 0;
        var time = (Date.now() / 1000) - value;
        if (time < 60 * 2) {
            count = 1;
            offset = 0;
        } else if (time >= 60 * 2 && time < 60 * 60) {
            offset = 1;
            count = time / 60;
        } else if (time >= 60 * 60 && time < 60 * 60 * 2) {
            offset = 2;
            count = 1;
        } else if (time >= 60 * 60 * 2 && time < 60 * 60 * 24) {
            offset = 3;
            count = time / (60 * 60);
        } else if (time >= 60 * 60 * 24 && time < 60 * 60 * 24 * 2) {
            offset = 4;
            count = 1;
        } else if (time >= 60 * 60 * 24 * 2 && time < 60 * 60 * 24 * 30) {
            offset = 5;
            count = time / (60 * 60 * 24);
        } else if (time >= 60 * 60 * 24 * 30 && time < 60 * 60 * 24 * 30 * 2) {
            offset = 6;
            count = 1;
        } else if (time >= 60 * 60 * 24 * 30 * 2 && time < 60 * 60 * 24 * 30 * 12) {
            offset = 7;
            count = time / (60 * 60 * 24 * 30);
        } else if (time >= 60 * 60 * 24 * 30 * 12 && time < 60 * 60 * 24 * 30 * 12 * 2) {
            offset = 8;
            count = 1;
        } else if (time >= 60 * 60 * 24 * 30 * 12 * 2) {
            offset = 9;
            count = time / (60 * 60 * 24 * 30 * 12);
        }
        if(offset < 0)
            return "";

        return Math.floor(count) + ' ' + Language.getText(200001 + offset);
    }

    getThumbnailImageUrl(image_url, size) {
        if(!image_url)
            return "";
        if(!size || size < 1)
            size = 256;
        if( /_[\d]{1,}x[\d]{1,}$/.test(image_url))
            return image_url;
        else
            return image_url += "_" + size + "x" + size;
    }
}

export default new BaseUtils();
