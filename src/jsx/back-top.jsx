import React from 'react';

export default class BackTop extends React.Component {
    handleScroll() {
        if ($(window).scrollTop() > 300) {
            $('#back-top').show();
        } else {
            $('#back-top').hide();
        }
    }

    backTop() {
        $('body,html').animate({scrollTop: 0 + 'px'}, 500);
    }

    componentDidMount() {
        $(window).bind('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        $(window).unbind('scroll', this.handleScroll);
    }

    render() {
        return (
            <div id="back-top" className="back-top" onClick={this.backTop}><span className="glyphicon glyphicon-arrow-up"></span></div>
        );
    };
}
