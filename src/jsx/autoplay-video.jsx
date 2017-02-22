import React from 'react';

export default class AutoplayVideo extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            topic: props.topic
        };
        this.status = {
            small: false,
            player: null
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    getVideoUrl() {
        var video_url = "";
        var style_opts = this.state.topic.style_opts || {};
        if(style_opts.video_urls && style_opts.video_urls.length > 0)
            video_url = style_opts.video_urls[0].url;
        return video_url;
    }

    handleScroll() {
        if ($(window).scrollTop() > $('.autovideo-block').outerHeight()) {
            if(!this.status.small) {
                this.status.small = true;
                $('.autovideo-block .video-js').addClass('small-video');
                $('.fixed-video').show();
            }
        } else {
            if(this.status.small) {
                this.status.small = false;
                $('.autovideo-block .video-js').removeClass('small-video');
                $('.fixed-video').hide();
            }
        }
    }

    handleClose() {
        $(window).unbind('scroll', this.handleScroll);
        $('.autovideo-block .video-js').removeClass('small-video');
        $('.fixed-video').hide();
    }

    componentDidMount() {
        $(window).bind('scroll', this.handleScroll);
        this.status.player = videojs('topic-video-player', {
            flash: {
                swf: "/assets/vendor/video-js/video-js.swf"
            }
        }, (() => {
            this.status.player.play();
        }).bind(this));
    }

    componentWillReceiveProps(props) {
        this.status.player.pause();
        this.setState({
            topic: props.topic
        });
    }

    componentDidUpdate() {
        this.status.player.src({
            type: 'application/x-mpegURL',
            src: this.getVideoUrl()
        });
        this.status.player.play();
    }

    componentWillUnmount() {
        $(window).unbind('scroll', this.handleScroll);
        if(this.status.player)
            this.status.player.dispose();
    }

    render() {
        var video_url = this.getVideoUrl();

        return (
            <div className="autovideo-block">
                <div className="fixed-video alert-dismissible" role="alert">
                    <button type="button" className="close" data-dismiss="alert" onClick={this.handleClose}><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                </div>
                <video className="video-js vjs-default-skin" id="topic-video-player" controls width="100%" height="480">
                    <source src={video_url} type='application/x-mpegURL'/>
                </video>
            </div>
        );
    };
}
